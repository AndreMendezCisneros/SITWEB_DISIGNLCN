import { NextResponse } from "next/server";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { canUploadMedia } from "@/lib/auth/roles";
import {
  ensureMediaBucket,
  MEDIA_BUCKET,
} from "@/lib/media/ensure-bucket";
import {
  formatBytes,
  optimizeUpload,
} from "@/lib/media/optimize-image";
import {
  enforceRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { createRequestId, getClientIp } from "@/lib/security/request-id";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/services/auth";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || !canUploadMedia(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requestId = request.headers.get("x-request-id") ?? createRequestId();
    const ip = getClientIp(request.headers);
    const limit = await enforceRateLimit({
      key: `media:user:${profile.id}`,
      ...RATE_LIMITS.mediaUpload,
      ip,
      requestId,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Rate limit" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Tipo no permitido" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Archivo demasiado grande" },
        { status: 400 }
      );
    }

    const raw = Buffer.from(await file.arrayBuffer());
    const prepared = await optimizeUpload(raw, file.type, file.name);

    const path = `uploads/${profile.id}/${crypto.randomUUID()}.${prepared.extension}`;
    const supabase = createServiceClient();

    try {
      await ensureMediaBucket(supabase);
    } catch (e) {
      return NextResponse.json(
        {
          error:
            e instanceof Error
              ? e.message
              : "No se pudo preparar el bucket Storage `media`",
        },
        { status: 500 }
      );
    }

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, prepared.buffer, {
        contentType: prepared.mimeType,
        upsert: false,
        cacheControl: "31536000",
      });
    if (uploadError) {
      return NextResponse.json(
        {
          error:
            uploadError.message === "Bucket not found"
              ? "Bucket `media` no existe. Ejecuta la migración storage o créalo en Supabase → Storage."
              : uploadError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    const { data: asset, error } = await supabase
      .from("media_assets")
      .insert({
        name: prepared.displayName,
        path,
        public_url: publicUrl,
        mime_type: prepared.mimeType,
        size_bytes: prepared.optimizedBytes,
        created_by: profile.id,
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const savedRatio =
      prepared.originalBytes > 0
        ? Math.round(
            (1 - prepared.optimizedBytes / prepared.originalBytes) * 100
          )
        : 0;

    await writeAuditEvent({
      action: "media.upload",
      entityType: "media_assets",
      entityId: asset.id,
      summary: prepared.optimized
        ? `Upload optimizado ${prepared.displayName} (−${savedRatio}%)`
        : `Upload ${prepared.displayName}`,
      after: {
        path,
        mime_type: prepared.mimeType,
        size_bytes: prepared.optimizedBytes,
        original_bytes: prepared.originalBytes,
        width: prepared.width,
        height: prepared.height,
        optimized: prepared.optimized,
      },
      actorId: profile.id,
      actorRole: profile.role,
      actorEmail: profile.email,
      ip,
      requestId,
    });

    return NextResponse.json({
      ok: true,
      asset,
      optimization: {
        optimized: prepared.optimized,
        originalBytes: prepared.originalBytes,
        optimizedBytes: prepared.optimizedBytes,
        savedPercent: Math.max(0, savedRatio),
        originalLabel: formatBytes(prepared.originalBytes),
        optimizedLabel: formatBytes(prepared.optimizedBytes),
        width: prepared.width,
        height: prepared.height,
      },
    });
  } catch (err) {
    console.error("[media/upload]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Error interno al subir el archivo",
      },
      { status: 500 }
    );
  }
}

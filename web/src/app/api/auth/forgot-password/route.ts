import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import {
  enforceRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { createRequestId, getClientIp } from "@/lib/security/request-id";
import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "@/lib/validators/content";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const { email } = parsed.data;
  const emailHash = createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 16);

  const perCred = await enforceRateLimit({
    key: `forgot:ipemail:${ip}:${emailHash}`,
    ...RATE_LIMITS.forgotPasswordIpEmail,
    ip,
    requestId,
    userAgent,
  });
  if (!perCred.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos" },
      { status: 429, headers: { "Retry-After": String(perCred.retryAfter) } },
    );
  }

  const perIp = await enforceRateLimit({
    key: `forgot:ip:${ip}`,
    ...RATE_LIMITS.forgotPasswordIp,
    ip,
    requestId,
    userAgent,
  });
  if (!perIp.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos" },
      { status: 429, headers: { "Retry-After": String(perIp.retryAfter) } },
    );
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  try {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${site}/admin/login`,
    });
  } catch {
    // Respuesta genérica igual (no filtrar existencia).
  }

  await writeAuditEvent({
    action: "auth.password_reset_requested",
    entityType: "auth",
    summary: "Solicitud de restablecimiento de contraseña",
    ip,
    userAgent,
    requestId,
    metadata: { emailHash },
  });

  return NextResponse.json({
    ok: true,
    message:
      "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña.",
  });
}

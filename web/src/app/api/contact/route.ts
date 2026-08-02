import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createHash } from "crypto";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { isSupabaseConfigured } from "@/lib/env";
import {
  enforceRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { createRequestId, getClientIp } from "@/lib/security/request-id";
import {
  isTurnstileRequired,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";
import { createServiceClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators/contact";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  // Honeypot: aceptar y fingir éxito (no revelar el filtro)
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true, emailSent: false, requestId });
  }
  if (Date.now() - data.startedAt < 1200) {
    return NextResponse.json(
      { error: "Envío demasiado rápido" },
      { status: 400 }
    );
  }

  const turnstile = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstile.ok) {
    if (isTurnstileRequired() || !turnstile.skipped) {
      return NextResponse.json(
        {
          error:
            "No se pudo verificar que no eres un robot. Recarga e intenta de nuevo.",
        },
        { status: 403 }
      );
    }
  }

  const emailHash = createHash("sha256")
    .update(data.email.toLowerCase())
    .digest("hex")
    .slice(0, 16);
  const ipEmail = await enforceRateLimit({
    key: `contact:ipemail:${ip}:${emailHash}`,
    ...RATE_LIMITS.contactIpEmail,
    ip,
    requestId,
    userAgent,
  });
  if (!ipEmail.allowed) {
    return NextResponse.json(
      { error: "Rate limit" },
      { status: 429, headers: { "Retry-After": String(ipEmail.retryAfter) } }
    );
  }

  const ipLimit = await enforceRateLimit({
    key: `contact:ip:${ip}`,
    ...RATE_LIMITS.contactIp,
    ip,
    requestId,
    userAgent,
  });
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit" },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
    );
  }

  let messageId: string | null = null;
  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createServiceClient();
    const { data: row, error } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
      })
      .select("id")
      .single();
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
    }
    messageId = row.id as string;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "contactenos@lcs.pe";
  let emailSent = false;
  let emailError: string | null = null;

  if (!apiKey) {
    console.error(
      "[contact] RESEND_API_KEY ausente — mensaje guardado pero no se envió correo"
    );
    emailError = "Correo no configurado";
  } else {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from:
          process.env.CONTACT_FROM_EMAIL ?? "LCS Web <onboarding@resend.dev>",
        to: [to],
        replyTo: data.email,
        subject: `Contacto web LCS — ${data.name}`,
        text: [
          `Nombre: ${data.name}`,
          `Empresa: ${data.company || "—"}`,
          `Email: ${data.email}`,
          `Teléfono: ${data.phone || "—"}`,
          "",
          data.message,
        ].join("\n"),
      });
      if (error) {
        console.error("[contact] Resend error", error);
        emailError = error.message ?? "Error al enviar correo";
      } else {
        emailSent = true;
      }
    } catch (e) {
      console.error("[contact] Resend exception", e);
      emailError = e instanceof Error ? e.message : "Error al enviar correo";
    }
  }

  await writeAuditEvent({
    action: "contact.message_received",
    entityType: "contact_messages",
    entityId: messageId,
    summary: `Mensaje de ${data.name}${emailSent ? "" : " (sin email)"}`,
    after: {
      email: data.email,
      company: data.company,
      emailSent,
      emailError,
      turnstileSkipped: turnstile.skipped === true,
    },
    ip,
    userAgent,
    requestId,
  });

  return NextResponse.json({
    ok: true,
    requestId,
    emailSent,
    emailError: emailSent ? null : emailError,
  });
}

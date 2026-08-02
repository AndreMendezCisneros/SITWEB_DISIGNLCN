import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { setIdleCookie } from "@/lib/auth/idle";
import {
  enforceRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { createRequestId, getClientIp } from "@/lib/security/request-id";
import { homeForRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators/content";
import type { AppRole } from "@/types/database";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const emailHash = createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 16);

  const perCred = await enforceRateLimit({
    key: `login:ipemail:${ip}:${emailHash}`,
    ...RATE_LIMITS.loginIpEmail,
    ip,
    requestId,
    userAgent,
  });
  if (!perCred.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos" },
      { status: 429, headers: { "Retry-After": String(perCred.retryAfter) } }
    );
  }

  const perIp = await enforceRateLimit({
    key: `login:ip:${ip}`,
    ...RATE_LIMITS.loginIp,
    ip,
    requestId,
    userAgent,
  });
  if (!perIp.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos" },
      { status: 429, headers: { "Retry-After": String(perIp.retryAfter) } }
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      await writeAuditEvent({
        action: "auth.login_failure",
        entityType: "auth",
        summary: `Login fallido: ${email}`,
        ip,
        userAgent,
        requestId,
        metadata: { email },
      });
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    await supabase
      .from("profiles")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", data.user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    const role = (profile?.role as AppRole | undefined) ?? "viewer";
    const home = homeForRole(role);

    await writeAuditEvent({
      action: "auth.login_success",
      entityType: "auth",
      entityId: data.user.id,
      summary: `Login ok: ${email}`,
      actorId: data.user.id,
      actorEmail: email,
      actorRole: role,
      ip,
      userAgent,
      requestId,
    });

    const res = NextResponse.json({ ok: true, role, home });
    setIdleCookie(res);
    return res;
  } catch {
    return NextResponse.json(
      { error: "Auth no configurado. Define variables Supabase." },
      { status: 503 }
    );
  }
}

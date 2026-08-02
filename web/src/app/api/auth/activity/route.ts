import { NextResponse } from "next/server";
import { setIdleCookie } from "@/lib/auth/idle";
import {
  enforceRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { createRequestId, getClientIp } from "@/lib/security/request-id";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const limited = await enforceRateLimit({
    key: `activity:ip:${ip}`,
    ...RATE_LIMITS.authActivityIp,
    ip,
    requestId,
    userAgent,
  });
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Demasiados pings" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    setIdleCookie(res);
    return res;
  } catch {
    return NextResponse.json({ error: "Auth no disponible" }, { status: 503 });
  }
}

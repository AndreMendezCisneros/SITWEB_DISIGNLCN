import { NextResponse } from "next/server";
import { z } from "zod";
import { createRequestId, getClientIp } from "@/lib/security/request-id";
import {
  enforceRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { getCurrentProfile } from "@/services/auth";
import { inviteUser } from "@/services/users";
import type { AppRole } from "@/types/database";

const schema = z.object({
  email: z.string().email(),
  role: z.enum([
    "super_admin",
    "admin",
    "editor",
    "marketing",
    "viewer",
  ]),
  fullName: z.string().optional(),
});

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const ip = getClientIp(request.headers);
  const limit = await enforceRateLimit({
    key: `admin:mutate:${profile.id}`,
    ...RATE_LIMITS.adminMutations,
    ip,
    requestId,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    await inviteUser(
      parsed.data.email,
      parsed.data.role as AppRole,
      parsed.data.fullName
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 500 }
    );
  }
}

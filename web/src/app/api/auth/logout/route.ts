import { NextResponse } from "next/server";
import { clearIdleCookie } from "@/lib/auth/idle";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const reason = url.searchParams.get("reason");
  const wantsJson =
    request.headers.get("accept")?.includes("application/json") ||
    request.headers.get("content-type")?.includes("application/json");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.auth.signOut();
    if (user) {
      await writeAuditEvent({
        action: reason === "idle" ? "auth.idle_logout" : "auth.logout",
        entityType: "auth",
        entityId: user.id,
        summary: reason === "idle" ? "Logout por inactividad" : "Logout",
        actorId: user.id,
        actorEmail: user.email,
        metadata: reason ? { reason } : undefined,
      });
    }
  } catch {
    // ignore when supabase not configured
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const login = new URL("/admin/login", site);
  if (reason === "idle") login.searchParams.set("reason", "idle");

  if (wantsJson) {
    const res = NextResponse.json({ ok: true, redirect: login.pathname + login.search });
    clearIdleCookie(res);
    return res;
  }

  const res = NextResponse.redirect(login, { status: 303 });
  clearIdleCookie(res);
  return res;
}

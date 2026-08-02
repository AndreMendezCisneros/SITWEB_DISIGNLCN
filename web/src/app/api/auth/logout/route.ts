import { NextResponse } from "next/server";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.auth.signOut();
    if (user) {
      await writeAuditEvent({
        action: "auth.logout",
        entityType: "auth",
        entityId: user.id,
        summary: "Logout",
        actorId: user.id,
        actorEmail: user.email,
      });
    }
  } catch {
    // ignore when supabase not configured
  }
  return NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    { status: 303 }
  );
}

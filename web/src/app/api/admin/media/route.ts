import { NextResponse } from "next/server";
import { canAccessModule } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/services/auth";

/** Lista medios de la biblioteca (staff con acceso a Multimedia). */
export async function GET(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || !canAccessModule(profile.role, "multimedia")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const imagesOnly = searchParams.get("images") !== "0";

  const supabase = await createClient();
  let query = supabase
    .from("media_assets")
    .select("id,name,public_url,mime_type,size_bytes,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (imagesOnly) {
    query = query.like("mime_type", "image/%");
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).filter((row) => {
    if (!q) return true;
    return row.name.toLowerCase().includes(q);
  });

  return NextResponse.json({ items });
}

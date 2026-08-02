import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

async function countTable(table: string) {
  if (!hasSupabaseEnv()) return 0;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function getDashboardCounts() {
  const [projects, services, clients, media, messages] = await Promise.all([
    countTable("projects"),
    countTable("services"),
    countTable("clients"),
    countTable("media_assets"),
    countTable("contact_messages"),
  ]);
  return { projects, services, clients, media, messages };
}

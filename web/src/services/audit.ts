import { createClient } from "@/lib/supabase/server";
import type { AuditEvent } from "@/types/database";

export async function listAuditEvents(limit = 100): Promise<AuditEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as AuditEvent[]) ?? [];
}

export async function countRateLimitHits24h() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("audit_events")
    .select("*", { count: "exact", head: true })
    .eq("action", "security.rate_limit_hit")
    .gte("created_at", since);
  if (error) throw error;
  return count ?? 0;
}

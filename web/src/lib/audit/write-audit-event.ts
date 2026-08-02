import { hasSupabaseEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/server";

export type AuditInput = {
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  summary?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  metadata?: Record<string, unknown>;
  actorId?: string | null;
  actorRole?: string | null;
  actorEmail?: string | null;
};

export async function writeAuditEvent(input: AuditInput): Promise<string | null> {
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.info("[audit]", input.action, input.summary ?? "");
    }
    return null;
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc("write_audit_event", {
      p_action: input.action,
      p_entity_type: input.entityType ?? null,
      p_entity_id: input.entityId ?? null,
      p_summary: input.summary ?? null,
      p_before: input.before ?? null,
      p_after: input.after ?? null,
      p_ip: input.ip ?? null,
      p_user_agent: input.userAgent ?? null,
      p_request_id: input.requestId ?? null,
      p_metadata: input.metadata ?? {},
      p_actor_id: input.actorId ?? null,
      p_actor_role: input.actorRole ?? null,
      p_actor_email: input.actorEmail ?? null,
    });
    if (error) throw error;
    return (data as string) ?? null;
  } catch (err) {
    console.error("[audit] failed", err);
    return null;
  }
}

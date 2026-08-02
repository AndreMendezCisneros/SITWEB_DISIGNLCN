import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth";
import type { AppRole, Profile } from "@/types/database";

export async function listUsers(): Promise<Profile[]> {
  await requireRole(["super_admin"]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Profile[]) ?? [];
}

export async function updateUserRole(
  userId: string,
  role: AppRole,
  meta?: { ip?: string; requestId?: string }
) {
  const actor = await requireRole(["super_admin"]);
  const supabase = await createClient();
  const { data: before } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  await writeAuditEvent({
    action: "user.role_changed",
    entityType: "profiles",
    entityId: userId,
    summary: `Rol actualizado a ${role}`,
    before: before as Record<string, unknown>,
    after: data as Record<string, unknown>,
    actorId: actor.id,
    actorRole: actor.role,
    actorEmail: actor.email,
    ip: meta?.ip,
    requestId: meta?.requestId,
  });
  return data as Profile;
}

export async function setUserActive(
  userId: string,
  isActive: boolean,
  meta?: { ip?: string; requestId?: string }
) {
  const actor = await requireRole(["super_admin"]);
  const supabase = await createClient();
  const { data: before } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  await writeAuditEvent({
    action: isActive ? "user.reactivated" : "user.deactivated",
    entityType: "profiles",
    entityId: userId,
    summary: isActive ? "Usuario reactivado" : "Usuario desactivado",
    before: before as Record<string, unknown>,
    after: data as Record<string, unknown>,
    actorId: actor.id,
    actorRole: actor.role,
    actorEmail: actor.email,
    ip: meta?.ip,
    requestId: meta?.requestId,
  });
  return data as Profile;
}

export async function inviteUser(
  email: string,
  role: AppRole,
  fullName?: string
) {
  await requireRole(["super_admin"]);
  const service = createServiceClient();
  // No pasar role en metadata: el trigger siempre crea viewer.
  const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName ?? "" },
  });
  if (error) throw error;
  const userId = data.user?.id;
  if (userId && role !== "viewer") {
    const { error: roleErr } = await service
      .from("profiles")
      .update({
        role,
        full_name: fullName ?? "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (roleErr) throw roleErr;
  }
  await writeAuditEvent({
    action: "user.invited",
    entityType: "profiles",
    entityId: userId,
    summary: `Invitación enviada a ${email} (${role})`,
    after: { email, role, fullName },
  });
  return data.user;
}

import { redirect } from "next/navigation";
import {
  canAccessModule,
  canWriteModule,
  homeForRole,
  ROLE_WORKSPACE,
  WORKSPACES,
  type AdminModule,
  type WorkspaceDef,
  type WorkspaceId,
} from "@/lib/auth/roles";
import { getCurrentProfile } from "@/services/auth";
import type { AppRole, Profile } from "@/types/database";

export async function requireWorkspace(workspaceId: WorkspaceId): Promise<{
  profile: Profile;
  workspace: WorkspaceDef;
}> {
  const profile = await getCurrentProfile();
  if (!profile?.is_active) redirect("/admin/login");
  const ws = WORKSPACES[workspaceId];
  if (!ws.allowedRoles.includes(profile.role)) {
    redirect(homeForRole(profile.role));
  }
  const workspace =
    ROLE_WORKSPACE[profile.role].id === workspaceId
      ? ROLE_WORKSPACE[profile.role]
      : ws;
  return { profile, workspace };
}

export async function requireModuleAccess(module: AdminModule) {
  const profile = await getCurrentProfile();
  if (!profile?.is_active) redirect("/admin/login");
  if (!canAccessModule(profile.role, module)) {
    redirect(homeForRole(profile.role));
  }
  return profile;
}

export async function requireModuleWrite(module: AdminModule) {
  const profile = await requireModuleAccess(module);
  if (!canWriteModule(profile.role, module)) {
    throw new Error("Forbidden");
  }
  return profile;
}

export function isReadOnly(role: AppRole) {
  return role === "viewer";
}

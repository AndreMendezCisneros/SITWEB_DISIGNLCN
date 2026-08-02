import { WorkspaceShell } from "@/components/cms/workspace-shell";
import { homeForRole, ROLE_WORKSPACE, WORKSPACES } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentProfile } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return <>{children}</>;
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return <>{children}</>;
  }

  if (!WORKSPACES.admin.allowedRoles.includes(profile.role)) {
    redirect(homeForRole(profile.role));
  }

  return (
    <WorkspaceShell
      role={profile.role}
      email={profile.email}
      workspace={ROLE_WORKSPACE[profile.role]}
    >
      {children}
    </WorkspaceShell>
  );
}

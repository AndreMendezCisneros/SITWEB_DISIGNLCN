import { WorkspaceShell } from "@/components/cms/workspace-shell";
import { ROLE_WORKSPACE } from "@/lib/auth/roles";
import type { AppRole } from "@/types/database";

/** @deprecated use WorkspaceShell */
export function AdminShell({
  children,
  role,
  email,
}: {
  children: React.ReactNode;
  role: AppRole;
  email?: string | null;
}) {
  return (
    <WorkspaceShell
      role={role}
      email={email}
      workspace={ROLE_WORKSPACE[role]}
    >
      {children}
    </WorkspaceShell>
  );
}

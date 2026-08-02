import { WorkspaceShell } from "@/components/cms/workspace-shell";
import { requireWorkspace } from "@/lib/auth/guard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, workspace } = await requireWorkspace("editor");
  return (
    <WorkspaceShell
      role={profile.role}
      email={profile.email}
      workspace={workspace}
    >
      {children}
    </WorkspaceShell>
  );
}

import { redirect } from "next/navigation";
import { RenderModule } from "@/components/cms/render-module";
import { requireWorkspace } from "@/lib/auth/guard";
import {
  canAccessModule,
  homeForRole,
  type AdminModule,
  type WorkspaceId,
} from "@/lib/auth/roles";

export async function WorkspaceModulePage({
  workspaceId,
  module,
}: {
  workspaceId: WorkspaceId;
  module: Exclude<AdminModule, "dashboard">;
}) {
  const { profile, workspace } = await requireWorkspace(workspaceId);
  if (!canAccessModule(profile.role, module)) {
    redirect(homeForRole(profile.role));
  }
  return (
    <RenderModule
      module={module}
      basePath={workspace.basePath}
      role={profile.role}
    />
  );
}

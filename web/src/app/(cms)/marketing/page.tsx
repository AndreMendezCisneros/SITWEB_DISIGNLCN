import { DashboardPanel } from "@/components/cms/modules/dashboard-panel";
import { requireWorkspace } from "@/lib/auth/guard";

export default async function Page() {
  const { profile, workspace } = await requireWorkspace("marketing");
  return <DashboardPanel role={profile.role} workspace={workspace} />;
}

import { DashboardPanel } from "@/components/cms/modules/dashboard-panel";
import { requireWorkspace } from "@/lib/auth/guard";

export default async function AdminHomePage() {
  const { profile, workspace } = await requireWorkspace("admin");
  return <DashboardPanel role={profile.role} workspace={workspace} />;
}

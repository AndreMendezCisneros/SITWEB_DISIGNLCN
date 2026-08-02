import { DataTable } from "@/components/admin/data-table";
import { UserRoleForm } from "@/components/admin/user-role-form";
import { CmsPageHeader } from "@/components/cms/page-header";
import { hasSupabaseEnv } from "@/lib/env";
import { listUsers } from "@/services/users";
import { ROLE_LABELS } from "@/types/database";

export async function UsuariosPanel() {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para gestionar usuarios.</p>;
  }
  const users = await listUsers();
  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Usuarios"
        description="Solo Super Administrador puede invitar y cambiar roles"
      />
      <UserRoleForm />
      <DataTable
        rows={users}
        columns={[
          { key: "email", header: "Email", cell: (r) => r.email ?? "—" },
          {
            key: "name",
            header: "Nombre",
            cell: (r) => r.full_name ?? "—",
          },
          {
            key: "role",
            header: "Rol",
            cell: (r) => ROLE_LABELS[r.role],
          },
          {
            key: "active",
            header: "Activo",
            cell: (r) => (r.is_active ? "Sí" : "No"),
          },
        ]}
      />
    </div>
  );
}

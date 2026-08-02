import { SimpleCrud, statusField } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AppRole, Client } from "@/types/database";

export async function ClientesPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para gestionar clientes.</p>;
  }
  const rows = await listAdminRows<Client>("clients");
  const readOnly = !canWriteModule(role, "clientes");
  return (
    <div>
      <CmsPageHeader
        title="Clientes"
        description="Logos y enlaces del carrusel de clientes"
        readOnly={readOnly}
      />
      <SimpleCrud
        table="clients"
        title=""
        hideTitle
        revalidatePath={`${basePath}/clientes`}
        readOnly={readOnly}
        rows={rows}
        fields={[
          { name: "name", label: "Nombre" },
          { name: "logo_url", label: "Logo", type: "image", aspect: 1 },
          { name: "website", label: "Sitio web" },
          { name: "sort_order", label: "Orden", type: "number" },
          statusField,
        ]}
      />
    </div>
  );
}

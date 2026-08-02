import { SimpleCrud, statusField } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AppRole, Service } from "@/types/database";

export async function ServiciosPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para gestionar servicios.</p>;
  }
  const rows = await listAdminRows<Service>("services");
  const readOnly = !canWriteModule(role, "servicios");
  return (
    <div>
      <CmsPageHeader
        title="Servicios"
        description="Catálogo de servicios publicados en el sitio"
        readOnly={readOnly}
      />
      <SimpleCrud
        table="services"
        title=""
        hideTitle
        revalidatePath={`${basePath}/servicios`}
        readOnly={readOnly}
        rows={rows}
        fields={[
          { name: "title", label: "Título" },
          { name: "description", label: "Descripción", type: "textarea" },
          { name: "image_url", label: "Imagen", type: "image", aspect: 4 / 3 },
          { name: "sort_order", label: "Orden", type: "number" },
          statusField,
        ]}
      />
    </div>
  );
}

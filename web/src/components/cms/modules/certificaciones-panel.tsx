import { SimpleCrud, statusField } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AppRole, Certification } from "@/types/database";

export async function CertificacionesPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <p className="text-sm">Configura Supabase para gestionar certificaciones.</p>
    );
  }
  const rows = await listAdminRows<Certification>("certifications");
  const readOnly = !canWriteModule(role, "certificaciones");
  return (
    <div>
      <CmsPageHeader
        title="Certificaciones"
        description="Documentos y sellos institucionales"
        readOnly={readOnly}
      />
      <SimpleCrud
        table="certifications"
        title=""
        hideTitle
        revalidatePath={`${basePath}/certificaciones`}
        readOnly={readOnly}
        rows={rows}
        fields={[
          { name: "name", label: "Nombre" },
          { name: "issuer", label: "Emisor" },
          { name: "document_url", label: "URL documento" },
          { name: "image_url", label: "Imagen", type: "image", aspect: 1 },
          { name: "valid_until", label: "Vigencia (YYYY-MM-DD)" },
          { name: "sort_order", label: "Orden", type: "number" },
          statusField,
        ]}
      />
    </div>
  );
}

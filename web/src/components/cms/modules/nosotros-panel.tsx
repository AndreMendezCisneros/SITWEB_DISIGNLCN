import { SimpleCrud, statusField } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { ABOUT_SECTION_KEY_OPTIONS } from "@/lib/cms/placements";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AboutSection, AppRole } from "@/types/database";

export async function NosotrosPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para gestionar Nosotros.</p>;
  }
  const rows = await listAdminRows<AboutSection>("about_sections");
  const readOnly = !canWriteModule(role, "nosotros");
  return (
    <div>
      <CmsPageHeader
        title="Nosotros"
        description="Secciones fijas del sitio: Historia, Misión, Visión y Valores. Elige la clave correcta para que aparezcan en su lugar."
        readOnly={readOnly}
      />
      <SimpleCrud
        table="about_sections"
        title=""
        hideTitle
        revalidatePath={`${basePath}/nosotros`}
        readOnly={readOnly}
        rows={rows}
        fields={[
          {
            name: "key",
            label: "Sección del sitio",
            type: "select",
            options: ABOUT_SECTION_KEY_OPTIONS,
            helperText:
              "Historia se usa en Inicio y Nosotros. Las demás solo en la página Nosotros.",
          },
          { name: "title", label: "Título" },
          { name: "body", label: "Contenido", type: "textarea" },
          { name: "image_url", label: "Imagen", type: "image", aspect: 4 / 3 },
          { name: "sort_order", label: "Orden", type: "number" },
          statusField,
        ]}
      />
    </div>
  );
}

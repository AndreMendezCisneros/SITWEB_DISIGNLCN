import { SimpleCrud, statusField } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { BANNER_PLACEMENT_OPTIONS } from "@/lib/cms/placements";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AppRole, Banner } from "@/types/database";

export async function HeroPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para gestionar banners.</p>;
  }
  const rows = await listAdminRows<Banner>("banners");
  const readOnly = !canWriteModule(role, "hero");
  const items = rows.map((r) => ({
    ...r,
    placement: r.placement || "home.hero",
  }));
  return (
    <div>
      <CmsPageHeader
        title="Banners / Cabeceras"
        description="Elige en qué página y sección aparece cada banner. El de Inicio es único: solo puede haber uno publicado."
        readOnly={readOnly}
      />
      <SimpleCrud
        table="banners"
        title=""
        hideTitle
        revalidatePath={`${basePath}/hero`}
        readOnly={readOnly}
        rows={items}
        fields={[
          {
            name: "placement",
            label: "Dónde irá (página → sección)",
            type: "select",
            options: BANNER_PLACEMENT_OPTIONS,
            helperText:
              "Solo un banner publicado por ubicación. Si ya hay uno, archívalo o pásalo a borrador antes de publicar otro en el mismo sitio.",
          },
          { name: "title", label: "Título" },
          { name: "subtitle", label: "Subtítulo", type: "textarea" },
          { name: "cta_label", label: "Texto botón" },
          { name: "cta_href", label: "Enlace botón" },
          { name: "image_url", label: "Imagen", type: "image", aspect: 16 / 9 },
          { name: "sort_order", label: "Orden", type: "number" },
          statusField,
        ]}
      />
    </div>
  );
}

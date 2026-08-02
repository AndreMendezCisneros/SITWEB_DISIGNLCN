import { SimpleCrud, statusField } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AppRole, Project } from "@/types/database";

export async function ProyectosPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para gestionar proyectos.</p>;
  }
  const rows = await listAdminRows<Project>("projects");
  const readOnly = !canWriteModule(role, "proyectos");
  return (
    <div>
      <CmsPageHeader
        title="Proyectos"
        description="Portafolio de obras. Marca “Aparece en Inicio” para mostrarlos en la sección de destacados del home."
        readOnly={readOnly}
      />
      <SimpleCrud
        table="projects"
        title=""
        hideTitle
        revalidatePath={`${basePath}/proyectos`}
        readOnly={readOnly}
        rows={rows}
        fields={[
          { name: "name", label: "Nombre" },
          { name: "slug", label: "Slug" },
          { name: "category", label: "Categoría" },
          { name: "location", label: "Ubicación" },
          { name: "entity", label: "Entidad" },
          { name: "year", label: "Año", type: "number" },
          { name: "amount", label: "Monto", type: "number" },
          { name: "duration_days", label: "Plazo (días)", type: "number" },
          { name: "condition", label: "Condición" },
          { name: "description", label: "Descripción", type: "textarea" },
          { name: "image_url", label: "Imagen", type: "image", aspect: 4 / 3 },
          {
            name: "featured",
            label: "Aparece en Inicio (destacados)",
            type: "select",
            options: [
              { label: "Sí", value: "true" },
              { label: "No", value: "false" },
            ],
            helperText: "Los marcados aparecen en el bloque de proyectos del home.",
          },
          { name: "sort_order", label: "Orden", type: "number" },
          statusField,
        ]}
      />
    </div>
  );
}

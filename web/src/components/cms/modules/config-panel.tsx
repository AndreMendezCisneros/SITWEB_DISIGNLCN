import { SimpleCrud } from "@/components/admin/simple-crud";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canMutateTable, canWriteModule, moduleLabel } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { getSiteSettings, listAdminRows } from "@/services/content";
import type { AppRole, HomeStat } from "@/types/database";

export async function ConfigPanel({
  basePath,
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  const settings = await getSiteSettings();
  const canWriteSettings = canWriteModule(role, "configuracion");
  const canWriteStats = canMutateTable(role, "home_stats");
  const title = moduleLabel("configuracion", role);

  if (!hasSupabaseEnv()) {
    return (
      <div className="space-y-3">
        <CmsPageHeader title={title} />
        <pre className="overflow-auto bg-white p-4 text-xs">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    );
  }

  const stats = await listAdminRows<HomeStat>("home_stats");
  return (
    <div className="space-y-8">
      <CmsPageHeader
        title={title}
        description={
          role === "marketing"
            ? "Estadísticas institucionales del home"
            : "Datos de empresa y estadísticas del home"
        }
        readOnly={!canWriteSettings && !canWriteStats}
      />

      {role !== "marketing" ? (
        <dl className="cms-card grid gap-3 p-5 text-sm md:grid-cols-2">
          <div>
            <dt className="text-neutral-500">Empresa</dt>
            <dd>{settings.company_name}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Email</dt>
            <dd>{settings.email}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Teléfono</dt>
            <dd>{settings.phone}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Dirección</dt>
            <dd>{settings.address}</dd>
          </div>
          {!canWriteSettings ? (
            <p className="md:col-span-2 text-xs text-amber-700">
              Los datos de empresa solo los editan Admin / Super Admin.
            </p>
          ) : null}
        </dl>
      ) : null}

      <SimpleCrud
        table="home_stats"
        title="Estadísticas del home"
        revalidatePath={
          role === "marketing"
            ? `${basePath}/configuracion`
            : `${basePath}/configuracion`
        }
        readOnly={!canWriteStats}
        rows={stats}
        fields={[
          { name: "label", label: "Etiqueta" },
          { name: "value", label: "Valor" },
          { name: "sort_order", label: "Orden", type: "number" },
          {
            name: "status",
            label: "Estado",
            type: "select",
            options: [
              { label: "Publicado", value: "published" },
              { label: "Borrador", value: "draft" },
            ],
          },
        ]}
      />
    </div>
  );
}

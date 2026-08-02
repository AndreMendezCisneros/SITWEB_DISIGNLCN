import { DataTable } from "@/components/admin/data-table";
import { CmsPageHeader } from "@/components/cms/page-header";
import { hasSupabaseEnv } from "@/lib/env";
import { listAuditEvents } from "@/services/audit";

export async function AuditoriaPanel() {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para ver auditoría.</p>;
  }
  const rows = await listAuditEvents(200);
  return (
    <div className="space-y-4">
      <CmsPageHeader
        title="Auditoría"
        description="Registro append-only de operaciones críticas"
      />
      <DataTable
        rows={rows}
        columns={[
          {
            key: "created",
            header: "Fecha",
            cell: (r) => new Date(r.created_at).toLocaleString("es-PE"),
          },
          { key: "action", header: "Acción", cell: (r) => r.action },
          {
            key: "actor",
            header: "Actor",
            cell: (r) => r.actor_email ?? "sistema/anónimo",
          },
          { key: "summary", header: "Resumen", cell: (r) => r.summary ?? "—" },
          {
            key: "entity",
            header: "Entidad",
            cell: (r) =>
              r.entity_type ? `${r.entity_type}:${r.entity_id ?? ""}` : "—",
          },
        ]}
      />
    </div>
  );
}

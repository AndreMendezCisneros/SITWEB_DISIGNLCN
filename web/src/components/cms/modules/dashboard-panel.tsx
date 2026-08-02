import Link from "next/link";
import { CmsPageHeader } from "@/components/cms/page-header";
import {
  canViewAudit,
  moduleLabel,
  navForRole,
  type WorkspaceDef,
} from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { countRateLimitHits24h, listAuditEvents } from "@/services/audit";
import { getDashboardCounts } from "@/services/dashboard";
import { ROLE_LABELS, type AppRole } from "@/types/database";

export async function DashboardPanel({
  role,
  workspace,
}: {
  role: AppRole;
  workspace: WorkspaceDef;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <div className="cms-card border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Configura variables Supabase para activar el panel completo.
      </div>
    );
  }

  const counts = await getDashboardCounts();
  let recent: Awaited<ReturnType<typeof listAuditEvents>> = [];
  let rateHits = 0;
  if (canViewAudit(role)) {
    recent = await listAuditEvents(8);
    rateHits = await countRateLimitHits24h();
  }

  const shortcuts = navForRole(role).filter((l) => l.module !== "dashboard");

  const cards: { label: string; value: number; hint: string }[] = [];
  const mods = new Set(workspace.modules);
  if (mods.has("proyectos"))
    cards.push({
      label: "Proyectos",
      value: counts.projects,
      hint: "En el portafolio",
    });
  if (mods.has("servicios"))
    cards.push({
      label: "Servicios",
      value: counts.services,
      hint: "Catálogo activo",
    });
  if (mods.has("clientes"))
    cards.push({
      label: "Clientes",
      value: counts.clients,
      hint: "Logos publicados",
    });
  if (mods.has("multimedia"))
    cards.push({
      label: "Multimedia",
      value: counts.media,
      hint: "Archivos en biblioteca",
    });
  if (mods.has("mensajes"))
    cards.push({
      label: "Mensajes",
      value: counts.messages,
      hint: "Bandeja de contacto",
    });
  if (canViewAudit(role))
    cards.push({
      label: "Rate limits 24h",
      value: rateHits,
      hint: "Bloqueos recientes",
    });

  return (
    <div className="space-y-6">
      <CmsPageHeader
        title={`Hola, ${ROLE_LABELS[role]}`}
        description={workspace.subtitle}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="cms-card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
              {card.value}
            </p>
            <p className="mt-2 text-xs text-neutral-400">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="cms-card p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-neutral-900">
            Accesos rápidos
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {shortcuts.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full bg-[#f3f3f3] px-3.5 py-2 text-sm text-neutral-700 transition hover:bg-lcs-black hover:text-lcs-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {role === "viewer" ? (
            <p className="mt-4 text-xs text-amber-700">
              Tu cuenta es de consulta: puedes ver el contenido, no modificarlo.
            </p>
          ) : null}
          {role === "editor" ? (
            <p className="mt-4 text-xs text-neutral-500">
              Workspace Editor · sin usuarios, configuración ni bandeja de
              mensajes.
            </p>
          ) : null}
          {role === "marketing" ? (
            <p className="mt-4 text-xs text-neutral-500">
              Workspace Marketing · banners, clientes, multimedia y{" "}
              {moduleLabel("configuracion", "marketing").toLowerCase()}.
            </p>
          ) : null}
        </div>

        {recent.length ? (
          <div className="cms-card overflow-hidden lg:col-span-3">
            <div className="border-b border-black/[0.04] px-5 py-4 text-sm font-semibold">
              Últimos eventos de auditoría
            </div>
            <ul className="divide-y divide-black/[0.03] text-sm">
              {recent.map((ev) => (
                <li key={ev.id} className="px-5 py-3.5">
                  <p className="font-medium text-neutral-900">{ev.action}</p>
                  <p className="mt-0.5 text-neutral-500">
                    {ev.summary} ·{" "}
                    {new Date(ev.created_at).toLocaleString("es-PE")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="cms-card flex items-center p-5 text-sm text-neutral-500 lg:col-span-3">
            Resumen operativo de tu workspace. Usa los accesos para gestionar
            contenido.
          </div>
        )}
      </div>
    </div>
  );
}

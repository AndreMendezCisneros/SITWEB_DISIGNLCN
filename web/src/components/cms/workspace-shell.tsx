import { WorkspaceNav } from "@/components/cms/workspace-nav";
import { navGroupsForRole, type WorkspaceDef } from "@/lib/auth/roles";
import { ROLE_LABELS, type AppRole } from "@/types/database";

export function WorkspaceShell({
  children,
  role,
  email,
  workspace,
}: {
  children: React.ReactNode;
  role: AppRole;
  email?: string | null;
  workspace: WorkspaceDef;
}) {
  const groups = navGroupsForRole(role);
  const initials = (email ?? ROLE_LABELS[role])
    .split(/[@\s.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-[#f5f5f5] text-neutral-900">
      {/* Menú fijo: no se mueve al hacer scroll del contenido */}
      <aside className="hidden h-dvh w-[260px] shrink-0 flex-col bg-lcs-black text-lcs-white md:flex lg:w-[280px]">
        <div className="shrink-0 px-5 pb-4 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lcs-gold font-display text-lg text-lcs-black">
              L
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg text-lcs-gold">
                {workspace.title}
              </p>
              <p className="truncate text-[11px] text-white/50">
                {ROLE_LABELS[role]}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-white/45">
            {workspace.subtitle}
          </p>
          {role === "viewer" ? (
            <p className="cms-pill mt-3 bg-amber-300/15 text-amber-200">
              Solo lectura
            </p>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
          <WorkspaceNav role={role} groups={groups} />
        </div>
      </aside>

      {/* Solo esta columna hace scroll */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.04] bg-[#f5f5f5]/95 px-4 py-4 backdrop-blur md:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-neutral-900 md:text-lg">
              {workspace.title}
            </p>
            <p className="truncate text-xs text-neutral-500">
              {workspace.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden max-w-xs items-center rounded-full bg-white px-4 py-2 text-sm text-neutral-400 shadow-sm ring-1 ring-black/[0.04] lg:flex">
              Panel CMS · LCS
            </div>
            <span className="cms-pill bg-white text-neutral-600 shadow-sm ring-1 ring-black/[0.04]">
              {ROLE_LABELS[role]}
            </span>
            <div className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 shadow-sm ring-1 ring-black/[0.04]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lcs-black text-xs font-semibold text-lcs-gold">
                {initials || "U"}
              </span>
              <span className="hidden max-w-[140px] truncate text-xs text-neutral-600 sm:inline">
                {email}
              </span>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                className="rounded-full px-3 py-2 text-xs font-medium text-lcs-gold transition hover:bg-white"
                type="submit"
              >
                Salir
              </button>
            </form>
          </div>
        </header>

        <div className="sticky top-[65px] z-10 border-b border-black/[0.04] bg-[#f5f5f5] px-3 py-3 md:hidden">
          <WorkspaceNav role={role} groups={groups} mobile />
        </div>

        <main className="flex-1 px-4 pb-8 pt-2 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import type { AppRole } from "@/types/database";

/**
 * Matriz alineada a LCS.docx Cap. VI + workspaces por rol:
 * - Super Admin / Admin → /admin
 * - Editor → /editor
 * - Marketing → /marketing
 * - Viewer → /viewer
 */

export type AdminModule =
  | "dashboard"
  | "hero"
  | "nosotros"
  | "servicios"
  | "proyectos"
  | "clientes"
  | "certificaciones"
  | "mensajes"
  | "multimedia"
  | "configuracion"
  | "auditoria"
  | "usuarios";

export type WorkspaceId = "admin" | "editor" | "marketing" | "viewer";

export type WorkspaceDef = {
  id: WorkspaceId;
  basePath: string;
  title: string;
  subtitle: string;
  modules: AdminModule[];
  allowedRoles: AppRole[];
};

const MODULE_SLUG: Record<AdminModule, string> = {
  dashboard: "",
  hero: "hero",
  nosotros: "nosotros",
  servicios: "servicios",
  proyectos: "proyectos",
  clientes: "clientes",
  certificaciones: "certificaciones",
  mensajes: "mensajes",
  multimedia: "multimedia",
  configuracion: "configuracion",
  auditoria: "auditoria",
  usuarios: "usuarios",
};

const SLUG_MODULE: Record<string, AdminModule> = Object.fromEntries(
  Object.entries(MODULE_SLUG)
    .filter(([, slug]) => slug)
    .map(([mod, slug]) => [slug, mod as AdminModule])
) as Record<string, AdminModule>;

const ADMIN_MODULES: AdminModule[] = [
  "dashboard",
  "hero",
  "nosotros",
  "servicios",
  "proyectos",
  "clientes",
  "certificaciones",
  "mensajes",
  "multimedia",
  "configuracion",
  "auditoria",
  "usuarios",
];

const EDITOR_MODULES: AdminModule[] = [
  "dashboard",
  "hero",
  "nosotros",
  "servicios",
  "proyectos",
  "clientes",
  "certificaciones",
  "multimedia",
];

const MARKETING_MODULES: AdminModule[] = [
  "dashboard",
  "hero",
  "nosotros",
  "clientes",
  "multimedia",
  "configuracion",
];

const VIEWER_MODULES: AdminModule[] = [
  "dashboard",
  "hero",
  "nosotros",
  "servicios",
  "proyectos",
  "clientes",
  "certificaciones",
  "multimedia",
];

export const WORKSPACES: Record<WorkspaceId, WorkspaceDef> = {
  admin: {
    id: "admin",
    basePath: "/admin",
    title: "LCS Admin",
    subtitle: "Gestión completa del CMS",
    modules: ADMIN_MODULES,
    allowedRoles: ["super_admin", "admin"],
  },
  editor: {
    id: "editor",
    basePath: "/editor",
    title: "LCS Editor",
    subtitle: "Edición de contenido del sitio",
    modules: EDITOR_MODULES,
    allowedRoles: ["editor"],
  },
  marketing: {
    id: "marketing",
    basePath: "/marketing",
    title: "LCS Marketing",
    subtitle: "Banners, imágenes y textos comerciales",
    modules: MARKETING_MODULES,
    allowedRoles: ["marketing"],
  },
  viewer: {
    id: "viewer",
    basePath: "/viewer",
    title: "LCS Consulta",
    subtitle: "Solo lectura",
    modules: VIEWER_MODULES,
    allowedRoles: ["viewer"],
  },
};

export const ROLE_WORKSPACE: Record<AppRole, WorkspaceDef> = {
  super_admin: {
    ...WORKSPACES.admin,
    title: "LCS Super Admin",
    subtitle: "Control total del CMS",
  },
  admin: {
    ...WORKSPACES.admin,
    modules: ADMIN_MODULES.filter((m) => m !== "usuarios"),
  },
  editor: WORKSPACES.editor,
  marketing: WORKSPACES.marketing,
  viewer: WORKSPACES.viewer,
};

/** Quién puede mutar cada módulo (crear/editar/eliminar/publicar). */
const moduleWrite: Record<AdminModule, AppRole[]> = {
  dashboard: [],
  hero: ["super_admin", "admin", "editor", "marketing"],
  nosotros: ["super_admin", "admin", "editor", "marketing"],
  servicios: ["super_admin", "admin", "editor"],
  proyectos: ["super_admin", "admin", "editor"],
  clientes: ["super_admin", "admin", "editor", "marketing"],
  certificaciones: ["super_admin", "admin", "editor"],
  mensajes: ["super_admin", "admin"],
  multimedia: ["super_admin", "admin", "editor", "marketing"],
  configuracion: ["super_admin", "admin"],
  auditoria: [],
  usuarios: ["super_admin"],
};

const tableModule: Record<string, AdminModule> = {
  banners: "hero",
  about_sections: "nosotros",
  services: "servicios",
  projects: "proyectos",
  project_images: "proyectos",
  clients: "clientes",
  certifications: "certificaciones",
  coverage_regions: "nosotros",
  home_stats: "configuracion",
  site_settings: "configuracion",
  seo_meta: "configuracion",
  media_assets: "multimedia",
  media_folders: "multimedia",
  contact_messages: "mensajes",
  profiles: "usuarios",
};

function has(role: AppRole | null | undefined, allowed: AppRole[]) {
  return Boolean(role && allowed.includes(role));
}

export function homeForRole(role: AppRole) {
  return ROLE_WORKSPACE[role].basePath;
}

export function moduleLabel(module: AdminModule, role?: AppRole) {
  if (module === "configuracion" && role === "marketing") {
    return "Estadísticas del inicio";
  }
  const labels: Record<AdminModule, string> = {
    dashboard: "Dashboard",
    hero: "Banners (cabeceras)",
    nosotros: "Nosotros",
    servicios: "Servicios",
    proyectos: "Proyectos",
    clientes: "Clientes",
    certificaciones: "Certificaciones",
    mensajes: "Mensajes",
    multimedia: "Multimedia",
    configuracion: "Configuración",
    auditoria: "Auditoría",
    usuarios: "Usuarios",
  };
  return labels[module];
}

export function moduleHref(basePath: string, module: AdminModule) {
  const slug = MODULE_SLUG[module];
  return slug ? `${basePath}/${slug}` : basePath;
}

export type NavLink = {
  module: AdminModule;
  label: string;
  href: string;
};

export type NavGroup = {
  id: string;
  label: string | null;
  items: NavLink[];
};

export function navForRole(role: AppRole): NavLink[] {
  const ws = ROLE_WORKSPACE[role];
  return ws.modules.map((module) => ({
    module,
    label: moduleLabel(module, role),
    href: moduleHref(ws.basePath, module),
  }));
}

/** Menú CMS agrupado como el sitio: Inicio / Páginas / Medios y sistema. */
export function navGroupsForRole(role: AppRole): NavGroup[] {
  const links = navForRole(role);
  const byModule = new Map(links.map((l) => [l.module, l]));

  const pick = (modules: AdminModule[]) =>
    modules
      .map((m) => byModule.get(m))
      .filter((l): l is NavLink => Boolean(l));

  const isMarketing = role === "marketing";

  const groups: NavGroup[] = [
    { id: "dashboard", label: null, items: pick(["dashboard"]) },
    {
      id: "inicio",
      label: "Inicio",
      items: pick(
        isMarketing ? ["hero", "configuracion"] : ["hero"]
      ),
    },
    {
      id: "paginas",
      label: "Páginas",
      items: pick([
        "nosotros",
        "servicios",
        "proyectos",
        "clientes",
        "certificaciones",
      ]),
    },
    {
      id: "sistema",
      label: "Medios y sistema",
      items: pick(
        isMarketing
          ? ["multimedia"]
          : [
              "multimedia",
              "mensajes",
              "configuracion",
              "auditoria",
              "usuarios",
            ]
      ),
    },
  ];

  return groups.filter((g) => g.items.length > 0);
}

export function slugToModule(slug: string): AdminModule | null {
  if (!slug || slug === "") return "dashboard";
  return SLUG_MODULE[slug] ?? null;
}

export function workspaceAllows(role: AppRole, pathname: string): boolean {
  if (pathname === "/admin/login") return true;
  const ws = ROLE_WORKSPACE[role];
  if (pathname === ws.basePath) return ws.modules.includes("dashboard");
  if (!pathname.startsWith(`${ws.basePath}/`)) return false;
  const slug = pathname.slice(ws.basePath.length + 1).split("/")[0] ?? "";
  const mod = slugToModule(slug);
  return Boolean(mod && ws.modules.includes(mod));
}

/**
 * Si el usuario está en un workspace ajeno, sugiere la URL correcta
 * (mismo módulo si aplica) o su home.
 */
export function resolveWorkspaceRedirect(
  role: AppRole,
  pathname: string
): string | null {
  if (pathname === "/admin/login") return null;
  if (workspaceAllows(role, pathname)) return null;

  const match = pathname.match(
    /^\/(admin|editor|marketing|viewer)(?:\/([^/]+))?/
  );
  if (!match) return homeForRole(role);

  const slug = match[2] ?? "";
  const mod = slugToModule(slug);
  const ws = ROLE_WORKSPACE[role];
  if (mod && ws.modules.includes(mod)) {
    return moduleHref(ws.basePath, mod);
  }
  return homeForRole(role);
}

export function workspaceFromPath(pathname: string): WorkspaceId | null {
  if (pathname === "/admin/login") return null;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/editor" || pathname.startsWith("/editor/")) return "editor";
  if (pathname === "/marketing" || pathname.startsWith("/marketing/"))
    return "marketing";
  if (pathname === "/viewer" || pathname.startsWith("/viewer/")) return "viewer";
  return null;
}

export function isWorkspacePath(pathname: string) {
  return (
    pathname === "/admin/login" || workspaceFromPath(pathname) !== null
  );
}

export function canAccessModule(
  role: AppRole | null | undefined,
  module: AdminModule
) {
  if (!role) return false;
  return ROLE_WORKSPACE[role].modules.includes(module);
}

export function canWriteModule(
  role: AppRole | null | undefined,
  module: AdminModule
) {
  return has(role, moduleWrite[module]);
}

export function canMutateTable(
  role: AppRole | null | undefined,
  table: string
) {
  if (table === "home_stats") {
    return has(role, ["super_admin", "admin", "marketing"]);
  }
  if (table === "coverage_regions") {
    return has(role, ["super_admin", "admin", "editor"]);
  }
  const mod = tableModule[table];
  // Allowlist estricta: tablas desconocidas = denegado
  if (!mod) return false;
  return canWriteModule(role, mod);
}

export function canManageUsers(role: AppRole | null | undefined) {
  return canWriteModule(role, "usuarios");
}

export function canViewAudit(role: AppRole | null | undefined) {
  return role === "super_admin" || role === "admin";
}

/** @deprecated prefer canMutateTable / canWriteModule */
export function canWriteContent(role: AppRole | null | undefined) {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "editor" ||
    role === "marketing"
  );
}

export function canManageSettings(role: AppRole | null | undefined) {
  return canWriteModule(role, "configuracion");
}

export function canMutateMessages(role: AppRole | null | undefined) {
  return canWriteModule(role, "mensajes");
}

export function canUploadMedia(role: AppRole | null | undefined) {
  return canWriteModule(role, "multimedia");
}

/** @deprecated use navForRole */
export const ADMIN_NAV = navForRole("super_admin");

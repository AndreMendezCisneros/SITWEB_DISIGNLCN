/** Catálogo de ubicaciones fijas alineadas al sitio público (slots tipo WordPress). */

export const BANNER_PLACEMENTS = [
  {
    id: "home.hero",
    page: "Inicio",
    section: "Banner principal",
    label: "Inicio → Banner principal",
    singleton: true,
  },
  {
    id: "nosotros.hero",
    page: "Nosotros",
    section: "Cabecera",
    label: "Nosotros → Cabecera",
    singleton: true,
  },
  {
    id: "servicios.hero",
    page: "Servicios",
    section: "Cabecera",
    label: "Servicios → Cabecera",
    singleton: true,
  },
  {
    id: "proyectos.hero",
    page: "Proyectos",
    section: "Cabecera",
    label: "Proyectos → Cabecera",
    singleton: true,
  },
  {
    id: "clientes.hero",
    page: "Clientes",
    section: "Cabecera",
    label: "Clientes → Cabecera",
    singleton: true,
  },
  {
    id: "certificaciones.hero",
    page: "Certificaciones",
    section: "Cabecera",
    label: "Certificaciones → Cabecera",
    singleton: true,
  },
  {
    id: "contacto.hero",
    page: "Contacto",
    section: "Cabecera",
    label: "Contacto → Cabecera",
    singleton: true,
  },
] as const;

export type BannerPlacementId = (typeof BANNER_PLACEMENTS)[number]["id"];

export const BANNER_PLACEMENT_OPTIONS = BANNER_PLACEMENTS.map((p) => ({
  label: p.label,
  value: p.id,
}));

export function isBannerPlacement(value: string): value is BannerPlacementId {
  return BANNER_PLACEMENTS.some((p) => p.id === value);
}

export function bannerPlacementLabel(id: string): string {
  return BANNER_PLACEMENTS.find((p) => p.id === id)?.label ?? id;
}

/** Claves fijas de about_sections usadas por el sitio. */
export const ABOUT_SECTION_KEYS = [
  { value: "historia", label: "Historia (Inicio + Nosotros)" },
  { value: "mision", label: "Misión" },
  { value: "vision", label: "Visión" },
  { value: "valores", label: "Valores" },
] as const;

export type AboutSectionKey = (typeof ABOUT_SECTION_KEYS)[number]["value"];

export const ABOUT_SECTION_KEY_OPTIONS = ABOUT_SECTION_KEYS.map((k) => ({
  label: k.label,
  value: k.value,
}));

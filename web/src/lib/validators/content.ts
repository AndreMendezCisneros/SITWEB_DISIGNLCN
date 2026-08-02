import { z } from "zod";
import { BANNER_PLACEMENTS } from "@/lib/cms/placements";

export const publishStatusSchema = z.enum(["draft", "published", "archived"]);

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .or(z.literal(""))
  .transform((v) => v ?? "");

const bannerPlacementSchema = z.enum(
  BANNER_PLACEMENTS.map((p) => p.id) as [
    (typeof BANNER_PLACEMENTS)[number]["id"],
    ...(typeof BANNER_PLACEMENTS)[number]["id"][],
  ]
);

export const serviceSchema = z
  .object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(5000).default(""),
    image_url: optionalUrl,
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("draft"),
  })
  .strict();

export const projectSchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().min(2).max(220),
    category: z.string().trim().max(120).optional().or(z.literal("")),
    location: z.string().trim().max(220).optional().or(z.literal("")),
    client_name: z.string().trim().max(220).optional().or(z.literal("")),
    entity: z.string().trim().max(220).optional().or(z.literal("")),
    year: z.coerce.number().int().min(1990).max(2100).optional().nullable(),
    amount: z.coerce.number().nonnegative().optional().nullable(),
    duration_days: z.coerce.number().int().positive().optional().nullable(),
    condition: z.string().trim().max(80).optional().or(z.literal("")),
    description: z.string().trim().max(8000).default(""),
    image_url: optionalUrl,
    featured: z.union([z.boolean(), z.enum(["true", "false"])]).transform(
      (v) => v === true || v === "true"
    ),
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("draft"),
  })
  .strict();

export const clientSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
    logo_url: optionalUrl,
    website: optionalUrl,
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("draft"),
  })
  .strict();

export const certificationSchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    issuer: z.string().trim().max(160).optional().or(z.literal("")),
    document_url: optionalUrl,
    image_url: optionalUrl,
    valid_until: z.string().optional().or(z.literal("")),
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("draft"),
  })
  .strict();

export const bannerSchema = z
  .object({
    placement: bannerPlacementSchema.default("home.hero"),
    title: z.string().trim().min(2).max(200),
    subtitle: z.string().trim().max(500).optional().or(z.literal("")),
    cta_label: z.string().trim().max(80).optional().or(z.literal("")),
    cta_href: z.string().trim().max(300).optional().or(z.literal("")),
    image_url: optionalUrl,
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("draft"),
  })
  .strict();

export const aboutSectionSchema = z
  .object({
    key: z.enum(["historia", "mision", "vision", "valores"]),
    title: z.string().trim().min(2).max(200),
    body: z.string().trim().max(12000).default(""),
    image_url: optionalUrl,
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("published"),
  })
  .strict();

export const homeStatSchema = z
  .object({
    label: z.string().trim().min(1).max(160),
    value: z.string().trim().min(1).max(80),
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("published"),
  })
  .strict();

export const coverageRegionSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
    province: z.string().trim().max(160).optional().or(z.literal("")),
    lat: z.coerce.number().optional().nullable(),
    lng: z.coerce.number().optional().nullable(),
    sort_order: z.coerce.number().int().default(0),
    status: publishStatusSchema.default("published"),
  })
  .strict();

export const siteSettingsSchema = z
  .object({
    company_name: z.string().trim().min(2).max(200).optional(),
    company_short: z.string().trim().max(40).optional(),
    general_manager: z.string().trim().max(200).optional().or(z.literal("")),
    email: z.string().trim().max(160).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    address: z.string().trim().max(500).optional().or(z.literal("")),
    website: z.string().trim().max(300).optional().or(z.literal("")),
    social: z.record(z.string(), z.string()).optional(),
  })
  .strict();

/** Tablas mutables vía SimpleCrud / saveEntityAction. */
export const mutableTables = [
  "banners",
  "about_sections",
  "services",
  "projects",
  "clients",
  "certifications",
  "home_stats",
  "coverage_regions",
  "site_settings",
] as const;

export type MutableTable = (typeof mutableTables)[number];

export const mutableTableSchema = z.enum(mutableTables);

const schemas: Record<MutableTable, z.ZodType<Record<string, unknown>>> = {
  banners: bannerSchema,
  about_sections: aboutSectionSchema,
  services: serviceSchema,
  projects: projectSchema,
  clients: clientSchema,
  certifications: certificationSchema,
  home_stats: homeStatSchema,
  coverage_regions: coverageRegionSchema,
  site_settings: siteSettingsSchema,
};

export function parseEntityPayload(
  table: string,
  payload: Record<string, unknown>
): { table: MutableTable; data: Record<string, unknown> } {
  const tableParsed = mutableTableSchema.safeParse(table);
  if (!tableParsed.success) {
    throw new Error(`Tabla no permitida: ${table}`);
  }
  const t = tableParsed.data;
  const parsed = schemas[t].safeParse(payload);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".") || "campo"}: ${i.message}`)
      .join("; ");
    throw new Error(`Datos inválidos (${t}): ${msg}`);
  }
  return { table: t, data: parsed.data as Record<string, unknown> };
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

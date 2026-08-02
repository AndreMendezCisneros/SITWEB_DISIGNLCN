import { cache } from "react";
import { unstable_cache } from "next/cache";
import { isSupabaseConfigured, useContentFallback } from "@/lib/env";
import {
  fallbackAbout,
  fallbackBanners,
  fallbackCertifications,
  fallbackClients,
  fallbackProjects,
  fallbackRegions,
  fallbackServices,
  fallbackSettings,
  fallbackStats,
} from "@/lib/seed/fallback";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";
import type {
  AboutSection,
  Banner,
  Certification,
  Client,
  CoverageRegion,
  HomeStat,
  Project,
  Service,
  SiteSettings,
} from "@/types/database";

async function fetchPublished<T>(
  table: string,
  order = "sort_order"
): Promise<T[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("status", "published")
    .order(order, { ascending: true });
  if (error) throw error;
  return (data as T[]) ?? [];
}

function cachedPublished<T>(
  table: string,
  fallback: T[],
  order = "sort_order"
) {
  return unstable_cache(
    async () => {
      const allowFallback = useContentFallback();
      if (!isSupabaseConfigured()) {
        return allowFallback ? fallback : [];
      }
      try {
        const rows = await fetchPublished<T>(table, order);
        if (rows.length) return rows;
        return allowFallback ? fallback : [];
      } catch {
        return allowFallback ? fallback : [];
      }
    },
    [`public-${table}`, useContentFallback() ? "fb" : "nofb"],
    { revalidate: 60, tags: [`public-${table}`, "public-content"] }
  );
}

const loadBanners = cachedPublished<Banner>("banners", fallbackBanners);
const loadStats = cachedPublished<HomeStat>("home_stats", fallbackStats);
const loadAbout = cachedPublished<AboutSection>("about_sections", fallbackAbout);
const loadServices = cachedPublished<Service>("services", fallbackServices);
const loadProjects = cachedPublished<Project>("projects", fallbackProjects);
const loadClients = cachedPublished<Client>("clients", fallbackClients);
const loadCerts = cachedPublished<Certification>(
  "certifications",
  fallbackCertifications
);
const loadRegions = cachedPublished<CoverageRegion>(
  "coverage_regions",
  fallbackRegions
);

const loadSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const allowFallback = useContentFallback();
    if (!isSupabaseConfigured()) {
      if (allowFallback) return fallbackSettings;
      throw new Error("Supabase no configurado");
    }
    try {
      const supabase = createAnonClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as SiteSettings;
      if (allowFallback) return fallbackSettings;
      throw new Error("site_settings vacío");
    } catch (e) {
      if (allowFallback) return fallbackSettings;
      throw e;
    }
  },
  ["public-site_settings", useContentFallback() ? "fb" : "nofb"],
  { revalidate: 60, tags: ["public-site_settings", "public-content"] }
);

export const getSiteSettings = cache(() => loadSettings());
export const getBanners = cache(() => loadBanners());
export const getHomeStats = cache(() => loadStats());
export const getAboutSections = cache(() => loadAbout());
export const getServices = cache(() => loadServices());
export const getClients = cache(() => loadClients());
export const getCertifications = cache(() => loadCerts());
export const getCoverageRegions = cache(() => loadRegions());

/** Banner publicado para un slot concreto (p. ej. home.hero). */
export const getBannerByPlacement = cache(async (placement: string) => {
  const banners = await loadBanners();
  const match = banners.find((b) => b.placement === placement);
  if (match) return match;
  // Fallback legacy: home.hero usa el primero si no hay placement en datos viejos
  if (placement === "home.hero" && banners[0]) return banners[0];
  return null;
});

export const getProjects = cache(async (featuredOnly = false) => {
  const all = await loadProjects();
  return featuredOnly ? all.filter((p) => p.featured) : all;
});

export const getProjectBySlug = cache(async (slug: string) => {
  const all = await getProjects(false);
  return all.find((p) => p.slug === slug) ?? null;
});

const orderByTable: Record<string, { column: string; ascending: boolean }> = {
  media_assets: { column: "created_at", ascending: false },
  media_folders: { column: "created_at", ascending: false },
  contact_messages: { column: "created_at", ascending: false },
  audit_events: { column: "created_at", ascending: false },
};

export async function listAdminRows<T>(table: string): Promise<T[]> {
  const supabase = await createClient();
  const order = orderByTable[table] ?? {
    column: "sort_order",
    ascending: true,
  };
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(order.column, { ascending: order.ascending });
  if (error) throw error;
  return (data as T[]) ?? [];
}

const tablesWithUpdatedAt = new Set([
  "banners",
  "about_sections",
  "services",
  "projects",
  "clients",
  "certifications",
  "site_settings",
  "seo_meta",
  "profiles",
]);

export async function upsertAdminRow(
  table: string,
  payload: Record<string, unknown>,
  id?: string
) {
  const supabase = await createClient();
  const body = tablesWithUpdatedAt.has(table)
    ? { ...payload, updated_at: new Date().toISOString() }
    : payload;
  if (id) {
    const { data, error } = await supabase
      .from(table)
      .update(body)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase
    .from(table)
    .insert(body)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAdminRow(table: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

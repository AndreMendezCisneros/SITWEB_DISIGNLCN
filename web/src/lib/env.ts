function looksConfigured(value: string | undefined) {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  if (!v) return false;
  if (v.includes("your_project") || v.includes("your-project")) return false;
  if (v.includes("your_anon") || v.includes("your_service")) return false;
  if (v.includes("changeme") || v.includes("replace_me")) return false;
  if (v === "https://your_project.supabase.co") return false;
  return true;
}

/** True only when real Supabase credentials are present (not .env.example placeholders). */
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!looksConfigured(url) || !looksConfigured(anon)) return false;
  try {
    const host = new URL(url!).hostname;
    return host.endsWith(".supabase.co") || host.includes("supabase");
  } catch {
    return false;
  }
}

/** @deprecated use isSupabaseConfigured */
export function hasSupabaseEnv() {
  return isSupabaseConfigured();
}

/**
 * Seed/fallback de contenido estático.
 * - Sin Supabase configurado: siempre (CI / demo local).
 * - Con Supabase en producción: desactivado (no mostrar datos falsos).
 * - Override: ALLOW_CONTENT_FALLBACK=true|false
 */
export function useContentFallback() {
  const flag = process.env.ALLOW_CONTENT_FALLBACK?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  if (!isSupabaseConfigured()) return true;
  return process.env.NODE_ENV !== "production";
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured() || !url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return { url, anonKey };
}

export function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!looksConfigured(key)) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return key!;
}

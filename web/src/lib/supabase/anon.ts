import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";

/** Cliente anon sin cookies — apto para cache de contenido público. */
export function createAnonClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured");
  }
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/database";

export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Una sola vez por request (layout + páginas). */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
});

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile || !profile.is_active) {
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function requireRole(roles: AppRole[]) {
  const profile = await requireProfile();
  if (!roles.includes(profile.role)) {
    throw new Error("Forbidden");
  }
  return profile;
}

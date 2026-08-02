import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth";
import type { ContactMessage } from "@/types/database";

export async function listMessages(): Promise<ContactMessage[]> {
  await requireRole(["super_admin", "admin", "editor", "marketing", "viewer"]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ContactMessage[]) ?? [];
}

export async function markMessageRead(id: string, isRead = true) {
  await requireRole(["super_admin", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) throw error;
}

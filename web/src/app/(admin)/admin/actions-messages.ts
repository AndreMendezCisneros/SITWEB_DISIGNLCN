"use server";

import { revalidatePath } from "next/cache";
import { markMessageRead } from "@/services/messages";

export async function markMessageReadAction(id: string, isRead = true) {
  await markMessageRead(id, isRead);
  revalidatePath("/admin/mensajes");
}

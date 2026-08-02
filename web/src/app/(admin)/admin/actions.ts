"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { canMutateTable } from "@/lib/auth/roles";
import { bannerPlacementLabel } from "@/lib/cms/placements";
import {
  mutableTableSchema,
  parseEntityPayload,
} from "@/lib/validators/content";
import { createClient } from "@/lib/supabase/server";
import { deleteAdminRow, upsertAdminRow } from "@/services/content";
import { requireProfile } from "@/services/auth";

function bustPublicCache() {
  revalidateTag("public-content");
  revalidatePath("/");
  revalidatePath("/nosotros");
  revalidatePath("/servicios");
  revalidatePath("/proyectos");
  revalidatePath("/clientes");
  revalidatePath("/certificaciones");
  revalidatePath("/contacto");
}

async function assertBannerPlacementAvailable(
  placement: string,
  status: unknown,
  id?: string
) {
  if (status !== "published") return;

  const supabase = await createClient();
  let query = supabase
    .from("banners")
    .select("id, title")
    .eq("placement", placement)
    .eq("status", "published");

  if (id) {
    query = query.neq("id", id);
  }

  const { data, error } = await query.limit(1);
  if (error) throw error;
  if (data && data.length > 0) {
    const other = data[0] as { title?: string };
    throw new Error(
      `Ya hay un banner publicado en «${bannerPlacementLabel(placement)}»` +
        (other.title ? ` («${other.title}»)` : "") +
        ". Pásalo a borrador o archívalo antes de publicar otro en esa ubicación."
    );
  }
}

export async function saveEntityAction(
  table: string,
  payload: Record<string, unknown>,
  id?: string,
  revalidate = "/admin"
) {
  const profile = await requireProfile();
  if (!canMutateTable(profile.role, table)) {
    throw new Error("Forbidden: tu rol no puede modificar este módulo");
  }

  const { table: safeTable, data: body } = parseEntityPayload(table, payload);

  if (safeTable === "banners") {
    await assertBannerPlacementAvailable(
      String(body.placement ?? "home.hero"),
      body.status,
      id
    );
  }

  await upsertAdminRow(safeTable, body, id);
  revalidatePath(revalidate);
  bustPublicCache();
}

export async function deleteEntityAction(
  table: string,
  id: string,
  revalidate = "/admin"
) {
  const profile = await requireProfile();
  if (!canMutateTable(profile.role, table)) {
    throw new Error("Forbidden: tu rol no puede eliminar en este módulo");
  }
  const tableParsed = mutableTableSchema.safeParse(table);
  if (!tableParsed.success) {
    throw new Error(`Tabla no permitida: ${table}`);
  }
  if (!id || typeof id !== "string" || id.length > 80) {
    throw new Error("ID inválido");
  }
  await deleteAdminRow(tableParsed.data, id);
  revalidatePath(revalidate);
  bustPublicCache();
}

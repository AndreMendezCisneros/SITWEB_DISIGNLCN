import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "media";
const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

/** Crea el bucket `media` si no existe (service role). */
export async function ensureMediaBucket(supabase: SupabaseClient) {
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`No se pudo listar buckets: ${listError.message}`);
  }
  if (buckets?.some((b) => b.name === BUCKET || b.id === BUCKET)) {
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ALLOWED_MIME,
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`No se pudo crear bucket media: ${error.message}`);
  }
}

export { BUCKET as MEDIA_BUCKET };

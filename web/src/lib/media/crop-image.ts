export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Carga una URL (p. ej. Supabase) vía fetch→blob para evitar taint del canvas. */
export async function loadImageSource(src: string): Promise<{
  objectUrl: string;
  revoke: () => void;
}> {
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return { objectUrl: src, revoke: () => undefined };
  }

  const res = await fetch(src, { mode: "cors", credentials: "omit" });
  if (!res.ok) {
    throw new Error("No se pudo cargar la imagen para recortar");
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  return {
    objectUrl,
    revoke: () => URL.revokeObjectURL(objectUrl),
  };
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Imagen inválida para recorte"))
    );
    image.src = src;
  });
}

/**
 * Recorta el área en píxeles y exporta WebP (fallback JPEG si el navegador no soporta).
 */
export async function getCroppedBlob(
  imageSrc: string,
  crop: PixelCrop,
  mimeType: "image/webp" | "image/jpeg" = "image/webp",
  quality = 0.92
): Promise<Blob> {
  const image = await loadHtmlImage(imageSrc);
  const canvas = document.createElement("canvas");
  const width = Math.max(1, Math.round(crop.width));
  const height = Math.max(1, Math.round(crop.height));
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), mimeType, quality)
  );

  if (blob) return blob;

  // Fallback JPEG si WebP no está soportado.
  if (mimeType === "image/webp") {
    return getCroppedBlob(imageSrc, crop, "image/jpeg", quality);
  }
  throw new Error("No se pudo generar la imagen recortada");
}

export async function getCroppedFile(
  imageSrc: string,
  crop: PixelCrop,
  baseName = "cropped"
): Promise<File> {
  const blob = await getCroppedBlob(imageSrc, crop);
  const ext = blob.type === "image/jpeg" ? "jpg" : "webp";
  return new File([blob], `${baseName}.${ext}`, { type: blob.type });
}

import { createRequire } from "node:module";

export const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/** Límite de lado largo para web corporativa (hero / proyectos). */
export const MAX_IMAGE_EDGE = 1920;
/** Calidad WebP: buen balance peso/nitidez. */
export const WEBP_QUALITY = 80;

export type OptimizedUpload = {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  originalBytes: number;
  optimizedBytes: number;
  width: number | null;
  height: number | null;
  optimized: boolean;
  displayName: string;
};

type SharpFactory = typeof import("sharp");

function loadSharp(): SharpFactory | null {
  try {
    // createRequire evita fallos de Turbopack con el entry ESM de sharp.
    const require = createRequire(import.meta.url);
    return require("sharp") as SharpFactory;
  } catch (err) {
    console.error("[optimize-image] sharp no disponible:", err);
    return null;
  }
}

function passthrough(
  input: Buffer,
  mimeType: string,
  originalName: string
): OptimizedUpload {
  const originalBytes = input.byteLength;
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  return {
    buffer: input,
    mimeType,
    extension: ext,
    originalBytes,
    optimizedBytes: originalBytes,
    width: null,
    height: null,
    optimized: false,
    displayName: originalName,
  };
}

/**
 * Redimensiona (máx. 1920px), convierte a WebP y quita metadatos.
 * Si sharp no carga o falla, sube el original (no bloquea el upload).
 */
export async function optimizeUpload(
  input: Buffer,
  mimeType: string,
  originalName: string
): Promise<OptimizedUpload> {
  if (!IMAGE_MIME.has(mimeType)) {
    return passthrough(input, mimeType, originalName);
  }

  const sharp = loadSharp();
  if (!sharp) {
    return passthrough(input, mimeType, originalName);
  }

  const originalBytes = input.byteLength;

  try {
    const image = sharp(input, { failOn: "none" }).rotate();
    const meta = await image.metadata();

    const optimized = await image
      .resize({
        width: MAX_IMAGE_EDGE,
        height: MAX_IMAGE_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    const optimizedBytes = optimized.data.byteLength;

    const preferOriginal =
      mimeType === "image/webp" &&
      optimizedBytes >= originalBytes * 0.95 &&
      (meta.width ?? 0) <= MAX_IMAGE_EDGE &&
      (meta.height ?? 0) <= MAX_IMAGE_EDGE;

    if (preferOriginal) {
      return {
        buffer: input,
        mimeType: "image/webp",
        extension: "webp",
        originalBytes,
        optimizedBytes: originalBytes,
        width: meta.width ?? null,
        height: meta.height ?? null,
        optimized: false,
        displayName: originalName,
      };
    }

    const base =
      originalName.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-") ||
      "image";

    return {
      buffer: Buffer.from(optimized.data),
      mimeType: "image/webp",
      extension: "webp",
      originalBytes,
      optimizedBytes,
      width: optimized.info.width,
      height: optimized.info.height,
      optimized: true,
      displayName: `${base}.webp`,
    };
  } catch (err) {
    console.error("[optimize-image] fallo al optimizar, se usa original:", err);
    return passthrough(input, mimeType, originalName);
  }
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

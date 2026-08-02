import type { Metadata } from "next";

const SITE = "LCS — Luque Construcción y Servicios";
const DEFAULT_DESC =
  "Construcción, infraestructura y mantenimiento con calidad, seguridad y compromiso en el Perú.";

export function publicPageMetadata(opts: {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
}): Metadata {
  const description = opts.description?.trim() || DEFAULT_DESC;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = new URL(opts.path, siteUrl).toString();
  const images = opts.image
    ? [{ url: opts.image, alt: opts.title }]
    : undefined;

  return {
    title: opts.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: SITE,
      title: `${opts.title} | LCS`,
      description,
      url,
      images,
    },
    twitter: {
      card: opts.image ? "summary_large_image" : "summary",
      title: `${opts.title} | LCS`,
      description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

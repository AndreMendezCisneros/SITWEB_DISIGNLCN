import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types/database";

/**
 * Cabecera de páginas internas. Si hay banner del slot, lo muestra;
 * si no, usa el fallback (eyebrow + título + descripción) sin romper el layout.
 * En tono oscuro no usa borde duro: un degradado inferior evita el corte feo
 * sobre fondos negros continuos.
 */
export function PageHero({
  banner,
  eyebrow,
  fallbackTitle,
  fallbackDescription,
  children,
  tone = "dark",
}: {
  banner: Banner | null;
  eyebrow: string;
  fallbackTitle: string;
  fallbackDescription?: React.ReactNode;
  children?: React.ReactNode;
  tone?: "dark" | "light";
}) {
  if (banner) {
    const hasPhoto = Boolean(banner.image_url);
    return (
      <section className="relative overflow-hidden bg-lcs-black pt-16 text-lcs-white">
        {hasPhoto ? (
          <Image
            src={banner.image_url!}
            alt=""
            fill
            className="object-cover opacity-45"
            sizes="100vw"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl uppercase md:text-6xl">
            {banner.title}
          </h1>
          {banner.subtitle ? (
            <p className="mt-5 max-w-3xl text-lg text-lcs-white/85">
              {banner.subtitle}
            </p>
          ) : null}
          {banner.cta_label ? (
            <div className="mt-6">
              <Link
                href={banner.cta_href || "/contacto"}
                className="inline-block bg-lcs-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-lcs-black transition hover:bg-lcs-gold-soft"
              >
                {banner.cta_label}
              </Link>
            </div>
          ) : null}
          {children}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/40"
        />
      </section>
    );
  }

  if (tone === "light") {
    return (
      <section className="relative bg-lcs-white pt-16 text-lcs-black">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl uppercase">{fallbackTitle}</h1>
          {fallbackDescription ? (
            <div className="mt-5 max-w-3xl text-base text-neutral-600">
              {fallbackDescription}
            </div>
          ) : null}
          {children}
        </div>
        <div
          aria-hidden
          className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
        />
      </section>
    );
  }

  return (
    <section className="relative bg-lcs-black pt-16 text-lcs-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-5xl uppercase md:text-6xl">
          {fallbackTitle}
        </h1>
        {fallbackDescription ? (
          <div className="mt-5 max-w-3xl text-lg text-lcs-white/85">
            {fallbackDescription}
          </div>
        ) : null}
        {children}
      </div>
      {/* Separador suave: no corta el negro con una raya gris */}
      <div
        aria-hidden
        className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types/database";

const DEFAULT_HOME_TITLE = (
  <>
    Construimos <span className="text-lcs-gold">soluciones</span>, creamos{" "}
    <span className="text-lcs-gold">futuro</span>.
  </>
);

export function Hero({ banner }: { banner: Banner | null }) {
  if (!banner) return null;

  const hasPhoto = Boolean(banner.image_url);
  const title = banner.title?.trim();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-lcs-black">
      {hasPhoto ? (
        <Image
          src={banner.image_url!}
          alt=""
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(201,162,39,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(201,162,39,0.08), transparent 50%), linear-gradient(160deg, #0a0a0a 0%, #141414 45%, #0a0a0a 100%)",
          }}
        />
      )}
      {!hasPhoto ? (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,162,39,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.35) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to right, black 0%, transparent 70%), linear-gradient(to bottom, transparent 10%, black 40%, black 100%)",
          }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
      <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-7xl items-center px-4 pb-24 pt-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-lcs-gold">
            Luque Construcción y Servicios
          </p>
          <h1 className="font-display text-5xl uppercase leading-[0.95] text-lcs-white md:text-7xl">
            {title || DEFAULT_HOME_TITLE}
          </h1>
          {banner.subtitle ? (
            <p className="mt-6 max-w-xl text-base text-lcs-white/85 md:text-lg">
              {banner.subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={banner.cta_href || "/nosotros"}
              className="bg-lcs-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black transition hover:bg-lcs-gold-soft"
            >
              {banner.cta_label || "Conoce más"}
            </Link>
            <Link
              href="/servicios"
              className="border border-lcs-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-gold transition hover:bg-lcs-gold hover:text-lcs-black"
            >
              Nuestros servicios
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

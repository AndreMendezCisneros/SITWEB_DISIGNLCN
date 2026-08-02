import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/public/image-slot";
import { PageHero } from "@/components/public/page-hero";
import { pillars } from "@/lib/seed/fallback";
import { publicPageMetadata } from "@/lib/seo";
import {
  getAboutSections,
  getBannerByPlacement,
  getCoverageRegions,
  getSiteSettings,
} from "@/services/content";

export const metadata: Metadata = publicPageMetadata({
  title: "Nosotros",
  description:
    "Conoce a Luque Construcción y Servicios: historia, misión, visión, valores y cobertura en el Perú.",
  path: "/nosotros",
});

export default async function NosotrosPage() {
  const [sections, regions, settings, banner] = await Promise.all([
    getAboutSections(),
    getCoverageRegions(),
    getSiteSettings(),
    getBannerByPlacement("nosotros.hero"),
  ]);

  const historia = sections.find((s) => s.key === "historia");

  return (
    <main className="bg-lcs-white text-lcs-black">
      <PageHero
        banner={banner}
        eyebrow="Nosotros"
        fallbackTitle={settings.company_name}
        fallbackDescription={
          <>
            Empresa peruana de construcción e infraestructura. Optimizamos
            procesos constructivos para entregar obras confiables que impulsan el
            desarrollo del país.
          </>
        }
      >
        <p className="mt-4 text-sm text-lcs-muted">
          Gerente General:{" "}
          <span className="text-lcs-gold">{settings.general_manager}</span>
        </p>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            Nuestra historia
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase">
            Construimos confianza, entregamos resultados
          </h2>
          <div className="mt-6 space-y-4 text-neutral-600 leading-relaxed whitespace-pre-line">
            {historia?.body}
          </div>
          <p className="mt-6 text-neutral-600 leading-relaxed">
            Operamos en un entorno competitivo que exige adaptarse a retos y
            oportunidades de un sector dinámico. Por eso priorizamos calidad,
            sostenibilidad y compromiso en cada contrato.
          </p>
        </div>
        <ImageSlot
          src={historia?.image_url}
          alt="Historia LCS"
          label="Admin → Nosotros · imagen de la sección historia"
          aspect="aspect-[4/3]"
        />
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-display text-4xl uppercase">Misión, visión y valores</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Los principios que guían nuestra forma de planificar, ejecutar y
            entregar cada proyecto.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sections
              .filter((s) => s.key !== "historia")
              .map((section) => (
                <article key={section.id} className="border border-neutral-200 bg-white p-6">
                  <h3 className="font-display text-2xl uppercase">{section.title}</h3>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                    {section.body}
                  </p>
                </article>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-lcs-black text-lcs-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-display text-4xl uppercase">Cómo trabajamos</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {pillars.map((item) => (
              <div key={item.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lcs-gold">
                  {item.title}
                </p>
                <p className="mt-3 text-sm text-lcs-white/80">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="font-display text-4xl uppercase">Cobertura regional</h2>
        <p className="mt-3 max-w-2xl text-neutral-600 leading-relaxed">
          LCS es una firma que fusiona creatividad y funcionalidad para
          redefinir la excelencia en la construcción. Contamos con presencia en
          provincias clave del Perú.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {regions.map((region) => (
            <div
              key={region.id}
              className="border border-neutral-200 bg-neutral-50 px-4 py-5"
            >
              <p className="text-sm font-semibold">{region.name}</p>
              {region.province ? (
                <p className="mt-1 text-xs uppercase tracking-wide text-lcs-gold">
                  {region.province}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-display text-3xl uppercase">Hablemos de tu obra</p>
            <p className="mt-2 text-sm text-neutral-600">
              {settings.address} · {settings.email} · {settings.phone}
            </p>
          </div>
          <Link
            href="/contacto"
            className="bg-lcs-black px-5 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-white"
          >
            Ir a contacto
          </Link>
        </div>
      </section>
    </main>
  );
}

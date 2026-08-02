import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/public/image-slot";
import { PageHero } from "@/components/public/page-hero";
import { publicPageMetadata } from "@/lib/seo";
import { getBannerByPlacement, getServices } from "@/services/content";

export const metadata: Metadata = publicPageMetadata({
  title: "Servicios",
  description:
    "Obras de edificación, saneamiento, vías, contratos municipales, hidráulicas e hidroenergéticas, suministro y consultoría.",
  path: "/servicios",
});

export default async function ServiciosPage() {
  const [services, banner] = await Promise.all([
    getServices(),
    getBannerByPlacement("servicios.hero"),
  ]);
  return (
    <main className="bg-lcs-black">
      <PageHero
        banner={banner}
        eyebrow="Servicios"
        fallbackTitle="Ejecución de obras y consultoría"
        fallbackDescription={
          <>
            <p className="text-base leading-relaxed text-lcs-muted">
              Como en las mejores constructoras del mercado, organizamos nuestra
              oferta por especialidades claras. En LCS cubrimos edificación,
              sistemas urbanos, vías, contratos municipales, saneamiento, obras
              hidráulicas e hidroenergéticas, además de suministro y consultoría.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-lcs-white/70">
              Cada servicio se ejecuta con enfoque en calidad, seguridad y
              cumplimiento de plazos, brindando soluciones confiables en cada
              etapa del proyecto —desde la planificación hasta la entrega.
            </p>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {services.length === 0 ? (
            <p className="col-span-full text-sm text-lcs-muted">
              Pronto publicaremos nuestros servicios.
            </p>
          ) : null}
          {services.map((service) => (
            <article
              key={service.id}
              className="border border-white/10 transition hover:border-lcs-gold"
            >
              <ImageSlot
                src={service.image_url}
                alt={service.title}
                label="Admin → Servicios · URL imagen"
                aspect="aspect-[16/10]"
                className="border-0 bg-lcs-charcoal"
              />
              <div className="p-6">
                <h2 className="text-xl text-lcs-white">{service.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-lcs-muted">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 border border-lcs-gold/40 bg-lcs-gold/10 p-8 text-center">
          <p className="font-display text-2xl uppercase text-lcs-white">
            ¿Necesitas una cotización?
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-block bg-lcs-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </main>
  );
}

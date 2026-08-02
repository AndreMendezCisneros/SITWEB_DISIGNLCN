import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { OfficeMap } from "@/components/public/office-map";
import { PageHero } from "@/components/public/page-hero";
import { publicPageMetadata } from "@/lib/seo";
import { getBannerByPlacement, getSiteSettings } from "@/services/content";

export const metadata: Metadata = publicPageMetadata({
  title: "Contacto",
  description:
    "Cotiza tu proyecto con LCS. Escríbenos para obras de edificación, infraestructura, saneamiento o contratos municipales.",
  path: "/contacto",
});

export default async function ContactoPage() {
  const [settings, banner] = await Promise.all([
    getSiteSettings(),
    getBannerByPlacement("contacto.hero"),
  ]);
  return (
    <main className="bg-lcs-charcoal">
      <PageHero
        banner={banner}
        eyebrow="Contáctanos"
        fallbackTitle="Cotiza tu proyecto"
        fallbackDescription={
          <>
            <p className="text-base leading-relaxed text-lcs-muted">
              Ejecutamos proyectos de construcción con enfoque en calidad,
              seguridad y cumplimiento de plazos. Cuéntanos el alcance de tu obra
              y te responderemos con una orientación clara.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-lcs-white/75">
              También puedes escribirnos para consultas sobre infraestructura
              educativa, vial, deportiva, saneamiento o contratos municipales.
            </p>
          </>
        }
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 md:grid-cols-2 md:px-8">
        <div className="space-y-5 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-lcs-gold">
              Oficina
            </p>
            <p className="mt-1 text-lcs-white/90">{settings.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-lcs-gold">
              Correo
            </p>
            <p className="mt-1 text-lcs-white/90">{settings.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-lcs-gold">
              Teléfono
            </p>
            <p className="mt-1 text-lcs-white/90">{settings.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-lcs-gold">Web</p>
            <p className="mt-1 text-lcs-white/90">{settings.website}</p>
          </div>
        </div>
        <ContactForm />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <OfficeMap address={settings.address} />
      </div>
    </main>
  );
}

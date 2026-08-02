import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { publicPageMetadata } from "@/lib/seo";
import { getBannerByPlacement, getCertifications } from "@/services/content";

export const metadata: Metadata = publicPageMetadata({
  title: "Certificaciones",
  description:
    "Estándares y certificaciones que respaldan la calidad y seguridad del trabajo de LCS.",
  path: "/certificaciones",
});

export default async function CertificacionesPage() {
  const [items, banner] = await Promise.all([
    getCertifications(),
    getBannerByPlacement("certificaciones.hero"),
  ]);
  return (
    <main className="bg-lcs-black">
      <PageHero
        banner={banner}
        eyebrow="Certificaciones"
        fallbackTitle="Estándares que respaldan nuestro trabajo"
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="border border-white/10 p-6">
              <h2 className="text-xl text-lcs-white">{item.name}</h2>
              {item.issuer ? (
                <p className="mt-2 text-sm text-lcs-muted">
                  Emisor: {item.issuer}
                </p>
              ) : null}
              {item.valid_until ? (
                <p className="mt-1 text-sm text-lcs-muted">
                  Vigencia: {item.valid_until}
                </p>
              ) : null}
              {item.document_url ? (
                <a
                  href={item.document_url}
                  className="mt-4 inline-block text-sm text-lcs-gold"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver documento
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

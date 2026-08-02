import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { publicPageMetadata } from "@/lib/seo";
import { getBannerByPlacement, getClients } from "@/services/content";

export const metadata: Metadata = publicPageMetadata({
  title: "Clientes",
  description:
    "Municipalidades, gobierno regional y empresas que confían en LCS para ejecutar infraestructura con calidad.",
  path: "/clientes",
});

export default async function ClientesPage() {
  const [clients, banner] = await Promise.all([
    getClients(),
    getBannerByPlacement("clientes.hero"),
  ]);
  return (
    <main className="bg-lcs-white text-lcs-black">
      <PageHero
        banner={banner}
        tone="light"
        eyebrow="Clientes"
        fallbackTitle="Aliados en el desarrollo"
        fallbackDescription={
          <>
            <p className="leading-relaxed text-neutral-600">
              Líderes y entidades públicas que participan en sectores clave para
              la sociedad confían en LCS para ejecutar infraestructura con
              calidad y responsabilidad. Nuestro portafolio incluye
              municipalidades, gobierno regional y empresas estratégicas.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              Puedes cargar el logo de cada cliente desde el panel de
              administración (Admin → Clientes → Logo URL / Multimedia). Mientras
              no haya logo, se muestra el nombre institucional.
            </p>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex flex-col gap-4 border border-neutral-200 p-6"
            >
              <div className="flex h-20 items-center justify-center border border-dashed border-neutral-300 bg-neutral-50">
                {client.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs uppercase tracking-wide text-neutral-400">
                    Logo editable
                  </span>
                )}
              </div>
              <div>
                <p className="text-lg font-medium">{client.name}</p>
                {client.website ? (
                  <a
                    href={client.website}
                    className="mt-2 inline-block text-sm text-lcs-gold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sitio web
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-neutral-400">
                    Sitio web opcional desde Admin
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-lcs-black p-8 text-lcs-white">
          <h2 className="font-display text-3xl uppercase">
            ¿Quieres sumar tu organización?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-lcs-muted">
            Conversemos sobre tu próximo proyecto de infraestructura o
            edificación.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex bg-lcs-gold px-5 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black"
          >
            Contactar a LCS
          </Link>
        </div>
      </div>
    </main>
  );
}

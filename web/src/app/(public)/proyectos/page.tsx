import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/public/image-slot";
import { PageHero } from "@/components/public/page-hero";
import { publicPageMetadata } from "@/lib/seo";
import { getBannerByPlacement, getProjects } from "@/services/content";

export const metadata: Metadata = publicPageMetadata({
  title: "Proyectos",
  description:
    "Portafolio de obras públicas y privadas ejecutadas por LCS: educación, mercados, vías, saneamiento y más.",
  path: "/proyectos",
});

export default async function ProyectosPage() {
  const [projects, banner] = await Promise.all([
    getProjects(),
    getBannerByPlacement("proyectos.hero"),
  ]);
  return (
    <main className="bg-lcs-black">
      <PageHero
        banner={banner}
        eyebrow="Proyectos"
        fallbackTitle="Obras que impulsan el país"
        fallbackDescription={
          <p className="text-base leading-relaxed text-lcs-muted">
            Portafolio de proyectos públicos y privados ejecutados por LCS:
            educación, mercados, vías, prevención de riesgos, deporte y
            saneamiento. Cada ficha incluye ubicación, entidad, plazo y condición
            de la obra.
          </p>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.length === 0 ? (
            <p className="col-span-full text-sm text-lcs-muted">
              Aún no hay proyectos publicados.
            </p>
          ) : null}
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/proyectos/${project.slug}`}
              className="group border border-white/10 transition hover:border-lcs-gold"
            >
              <ImageSlot
                src={project.image_url}
                alt={project.name}
                label="Admin → Proyectos · imagen principal (+ galería)"
                aspect="aspect-[16/9]"
                className="border-0 bg-lcs-charcoal"
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-lcs-gold">
                  {project.category} {project.year ? `· ${project.year}` : ""}
                </p>
                <h2 className="mt-3 text-2xl text-lcs-white group-hover:text-lcs-gold">
                  {project.name}
                </h2>
                <p className="mt-2 text-sm text-lcs-muted">{project.location}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-lcs-white/75">
                  {project.description}
                </p>
                <p className="mt-4 text-sm text-lcs-gold">Ver ficha completa →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

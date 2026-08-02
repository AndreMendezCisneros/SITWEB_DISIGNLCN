import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageSlot } from "@/components/public/image-slot";
import { publicPageMetadata } from "@/lib/seo";
import { formatCurrencyPEN } from "@/lib/utils";
import { getProjectBySlug, getProjects } from "@/services/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return publicPageMetadata({
      title: "Proyecto",
      path: `/proyectos/${slug}`,
    });
  }
  return publicPageMetadata({
    title: project.name,
    description:
      project.description?.slice(0, 160) ||
      `Proyecto ${project.name} ejecutado por LCS.`,
    path: `/proyectos/${project.slug}`,
    image: project.image_url,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const facts = [
    ["Ubicación", project.location],
    ["Entidad", project.entity],
    ["Cliente", project.client_name],
    ["Categoría", project.category],
    ["Año", project.year?.toString()],
    ["Monto contratado", formatCurrencyPEN(project.amount)],
    ["Plazo", project.duration_days ? `${project.duration_days} días calendario` : null],
    ["Condición", project.condition],
  ].filter(([, v]) => Boolean(v));

  return (
    <main className="bg-lcs-white pt-16 text-lcs-black">
      <div className="mx-auto max-w-5xl px-4 pb-20 md:px-8">
        <Link href="/proyectos" className="text-sm text-lcs-gold hover:underline">
          ← Volver a proyectos
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
          {project.category}
        </p>
        <h1 className="mt-3 font-display text-5xl uppercase">{project.name}</h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-600">
          {project.description}
        </p>

        <div className="mt-10">
          <ImageSlot
            src={project.image_url}
            alt={project.name}
            label="Admin → Proyectos · imagen principal. Galería adicional en project_images"
            aspect="aspect-[21/9]"
          />
        </div>

        <h2 className="mt-12 font-display text-3xl uppercase">Ficha técnica</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Datos del expediente / contrato según portafolio LCS 2025.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label} className="border border-neutral-200 p-4">
              <dt className="text-xs uppercase tracking-wide text-lcs-gold">
                {label}
              </dt>
              <dd className="mt-2 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 bg-lcs-black p-6 text-lcs-white">
          <p className="font-display text-2xl uppercase">
            ¿Tienes un proyecto similar?
          </p>
          <p className="mt-2 text-sm text-lcs-muted">
            Conversemos sobre alcance, plazos y ejecución.
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-flex bg-lcs-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-lcs-black"
          >
            Cotizar
          </Link>
        </div>
      </div>
    </main>
  );
}

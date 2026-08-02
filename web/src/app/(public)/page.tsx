import Link from "next/link";
import { Hero } from "@/components/public/hero";
import { ImageSlot } from "@/components/public/image-slot";
import { pillars, workHighlights } from "@/lib/seed/fallback";
import {
  getAboutSections,
  getBannerByPlacement,
  getClients,
  getHomeStats,
  getProjects,
  getServices,
} from "@/services/content";

export default async function HomePage() {
  const [banner, stats, services, projects, clients, about] = await Promise.all([
    getBannerByPlacement("home.hero"),
    getHomeStats(),
    getServices(),
    getProjects(true),
    getClients(),
    getAboutSections(),
  ]);

  const historia = about.find((s) => s.key === "historia");

  return (
    <>
      <Hero banner={banner} />

      <section className="bg-lcs-charcoal">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-4 md:px-8">
          {pillars.map((item) => (
            <div key={item.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-lcs-white/80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lcs-white text-lcs-black">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
              Sobre LCS
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase md:text-5xl">
              Construimos con confianza
            </h2>
            <p className="mt-5 text-neutral-600 leading-relaxed">
              {historia?.body?.split("\n\n")[0] ??
                "Luque Construcción y Servicios ejecuta proyectos con enfoque en calidad, seguridad y cumplimiento de plazos."}
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Transformamos visión en realidad: desde infraestructura educativa y
              deportiva hasta saneamiento, vías y contratos municipales, con un
              firme compromiso en excelencia operativa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/nosotros"
                className="inline-flex bg-lcs-black px-5 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-white"
              >
                Conoce nuestra empresa
              </Link>
              <Link
                href="/contacto"
                className="inline-flex border border-lcs-black px-5 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black"
              >
                Cotiza tu proyecto
              </Link>
            </div>
          </div>
          <ImageSlot
            src={historia?.image_url}
            alt="Sobre LCS"
            label="Admin → Nosotros (sección historia) · campo imagen"
          />
        </div>
      </section>

      <section className="bg-lcs-black">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            Resultados
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase text-lcs-white md:text-5xl">
            Más de 10 años construyendo futuro
          </h2>
          <p className="mt-4 max-w-3xl text-lcs-muted">
            Capacidad demostrada en obras públicas y privadas a lo largo del
            Perú. Estos indicadores resumen nuestro alcance operativo.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="border border-white/10 p-6">
                <p className="font-display text-3xl text-lcs-gold">{stat.value}</p>
                <p className="mt-2 text-sm text-lcs-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {workHighlights.map((item) => (
              <div key={item.label} className="bg-lcs-charcoal p-4">
                <p className="text-xs uppercase tracking-wide text-lcs-gold">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-lcs-white/85">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lcs-charcoal">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
                Proyectos destacados
              </p>
              <h2 className="mt-2 font-display text-4xl uppercase text-lcs-white">
                Obras que impulsan el desarrollo
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-lcs-muted">
                Selección de intervenciones recientes en educación, equipamiento
                urbano, deporte, vialidad y saneamiento.
              </p>
            </div>
            <Link href="/proyectos" className="text-sm text-lcs-gold hover:underline">
              Ver todos los proyectos →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/proyectos/${project.slug}`}
                className="group border border-white/10 transition hover:border-lcs-gold"
              >
                <ImageSlot
                  src={project.image_url}
                  alt={project.name}
                  label="Admin → Proyectos · imagen principal"
                  aspect="aspect-[16/9]"
                  className="border-0"
                />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-lcs-gold">
                    {project.category}
                    {project.year ? ` · ${project.year}` : ""}
                  </p>
                  <h3 className="mt-2 text-lg text-lcs-white group-hover:text-lcs-gold">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-lcs-muted">{project.location}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-lcs-white/70">
                    {project.description}
                  </p>
                  <p className="mt-4 text-sm text-lcs-gold">Ver proyecto →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lcs-white text-lcs-black">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            Nuestros servicios
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase">
            Soluciones integrales de construcción
          </h2>
          <p className="mt-4 max-w-3xl text-neutral-600">
            Ejecución de obras, prestación de servicios, suministro de bienes y
            consultoría. Acompañamos cada fase del proyecto con gestión técnica
            y foco en plazos.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="border border-neutral-200">
                <ImageSlot
                  src={service.image_url}
                  alt={service.title}
                  label="Admin → Servicios · imagen"
                  aspect="aspect-[16/9]"
                  className="border-0 border-b border-neutral-200"
                />
                <div className="p-5">
                  <h3 className="text-lg font-medium">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <Link
            href="/servicios"
            className="mt-10 inline-flex text-sm font-semibold uppercase tracking-wider text-lcs-gold"
          >
            Ver detalle de servicios →
          </Link>
        </div>
      </section>

      <section className="bg-lcs-black">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            Nuestros clientes
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase text-lcs-white">
            Entidades que confían en LCS
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-lcs-muted">
            Trabajamos con municipalidades, gobiernos regionales y empresas
            estratégicas en proyectos que generan impacto social y económico.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-4 border border-white/10 p-4"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-lcs-charcoal">
                  {client.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={client.logo_url}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-lcs-gold">
                      LOGO
                    </span>
                  )}
                </div>
                <p className="text-sm text-lcs-white/90">{client.name}</p>
              </div>
            ))}
          </div>
          <Link
            href="/clientes"
            className="mt-8 inline-block text-sm text-lcs-gold hover:underline"
          >
            Ver todos los clientes →
          </Link>
        </div>
      </section>

      <section className="bg-lcs-gold">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center md:px-8">
          <div>
            <h2 className="font-display text-4xl uppercase text-lcs-black">
              ¿Listo para iniciar tu proyecto?
            </h2>
            <p className="mt-3 max-w-xl text-sm text-lcs-black/80">
              Cuéntanos el alcance de tu obra. Nuestro equipo te orientará con
              una propuesta técnica y comercial clara.
            </p>
          </div>
          <Link
            href="/contacto"
            className="bg-lcs-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-white"
          >
            Cotiza tu proyecto
          </Link>
        </div>
      </section>
    </>
  );
}

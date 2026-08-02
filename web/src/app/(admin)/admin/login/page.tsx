import { Suspense } from "react";
import { AdminLoginForm } from "@/components/cms/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen bg-[#f7f7f5] text-neutral-900">
      {/* Panel marca — desktop */}
      <aside
        className="relative hidden w-[48%] overflow-hidden bg-lcs-black lg:flex lg:flex-col lg:justify-center"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 40% 45%, rgba(201,162,39,0.28), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(201,162,39,0.12), transparent 50%), linear-gradient(155deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,162,39,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* Onda hacia el formulario */}
        <svg
          className="absolute bottom-0 right-0 top-0 h-full w-24 translate-x-1/2 text-[#f7f7f5]"
          viewBox="0 0 80 800"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M40 0C55 80 10 160 40 240C70 320 15 400 40 480C65 560 20 640 40 720C50 760 45 780 40 800H80V0H40Z" />
        </svg>
        <div className="relative z-10 px-12 xl:px-16">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-lcs-gold">
            Luque Construcción y Servicios
          </p>
          <p className="mt-8 font-display text-6xl uppercase leading-none tracking-[0.12em] text-lcs-white xl:text-7xl">
            Welcome
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Panel CMS — administración de contenido, proyectos y multimedia.
          </p>
        </div>
      </aside>

      {/* Formulario */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="mb-10 text-center lg:hidden">
          <p className="font-display text-2xl text-lcs-gold">LCS</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutral-500">
            Welcome
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-neutral-500">Cargando…</p>}>
          <AdminLoginForm />
        </Suspense>
      </main>
    </div>
  );
}

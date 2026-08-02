import Link from "next/link";
import type { SiteSettings } from "@/types/database";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-white/10 bg-lcs-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-2xl tracking-wide text-lcs-gold">
            {settings.company_short}
          </p>
          <p className="mt-3 max-w-sm text-sm text-lcs-muted">
            {settings.company_name}. Transformamos visión en realidad con
            calidad, seguridad y compromiso.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lcs-gold">
            Empresa
          </p>
          <ul className="mt-4 space-y-2 text-sm text-lcs-white/80">
            <li>
              <Link href="/nosotros" className="hover:text-lcs-gold">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="hover:text-lcs-gold">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/proyectos" className="hover:text-lcs-gold">
                Proyectos
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-lcs-gold">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lcs-gold">
            Contacto
          </p>
          <ul className="mt-4 space-y-2 text-sm text-lcs-white/80">
            <li>{settings.address}</li>
            <li>{settings.email}</li>
            <li>{settings.phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-lcs-muted">
        © {new Date().getFullYear()} {settings.company_name}. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}

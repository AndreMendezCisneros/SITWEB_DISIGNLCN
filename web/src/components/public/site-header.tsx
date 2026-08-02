import Image from "next/image";
import Link from "next/link";
import { BackhoeScroll } from "@/components/public/backhoe-scroll";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/clientes", label: "Clientes" },
  { href: "/certificaciones", label: "Certificaciones" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-lcs-black/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo-lcs.jpeg"
            alt="LCS — Luque Construcción y Servicios"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className="text-xs font-semibold uppercase tracking-[0.18em] text-lcs-white/90 transition hover:text-lcs-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/contacto"
            className="border border-lcs-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-lcs-gold transition hover:bg-lcs-gold hover:text-lcs-black"
          >
            Cotizar
          </Link>
          <BackhoeScroll />
        </div>
      </div>
    </header>
  );
}

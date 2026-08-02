import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-lcs-black px-4 text-center text-lcs-white">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
        404
      </p>
      <h1 className="mt-3 font-display text-5xl uppercase">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-sm text-lcs-muted">
        El enlace no existe o el contenido ya no está publicado.
      </p>
      <Link
        href="/"
        className="mt-8 bg-lcs-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black"
      >
        Volver al inicio
      </Link>
    </main>
  );
}

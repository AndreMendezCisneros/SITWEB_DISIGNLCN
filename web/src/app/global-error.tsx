"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-lcs-black text-lcs-white">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            Error
          </p>
          <h1 className="mt-3 font-display text-4xl uppercase">
            Algo salió mal
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/70">
            No pudimos cargar esta página. Puedes reintentar o volver al inicio.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="bg-lcs-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black"
            >
              Reintentar
            </button>
            <Link
              href="/"
              className="border border-lcs-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-gold"
            >
              Inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

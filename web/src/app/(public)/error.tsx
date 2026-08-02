"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicError({
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
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-lcs-black px-4 py-20 text-center text-lcs-white">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
        Error
      </p>
      <h1 className="mt-3 font-display text-4xl uppercase">
        No pudimos cargar el contenido
      </h1>
      <p className="mt-4 max-w-md text-sm text-lcs-muted">
        Intenta de nuevo en unos segundos. Si el problema continúa, vuelve más
        tarde.
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
  );
}

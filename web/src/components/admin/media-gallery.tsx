"use client";

import { useState } from "react";
import { ModalPortal } from "@/components/admin/modal-portal";
import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/types/database";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime: string) {
  return mime.startsWith("image/");
}

export function MediaGallery({ items }: { items: MediaAsset[] }) {
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!items.length) {
    return (
      <div className="cms-card px-6 py-12 text-center text-sm text-neutral-500">
        Aún no hay archivos. Sube una imagen para verla aquí.
      </div>
    );
  }

  return (
    <>
      <div className="cms-card p-4 md:p-5">
        <p className="mb-4 text-sm text-neutral-500">
          Elige una imagen para ver sus características
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => {
            const image = isImage(item.mime_type);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCopied(false);
                    setSelected(item);
                  }}
                  className="group w-full overflow-hidden rounded-2xl bg-[#f0f0f0] text-left ring-1 ring-black/[0.04] transition hover:ring-lcs-gold/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcs-gold"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-200">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.public_url}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-neutral-800 text-white/80">
                        <span className="text-2xl font-semibold">PDF</span>
                        <span className="px-2 text-center text-[10px] uppercase tracking-wide text-white/50">
                          Documento
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="truncate px-2.5 py-2 text-xs text-neutral-600 group-hover:text-neutral-900">
                    {item.name}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {selected ? (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelected(null)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="media-detail-title"
              className="relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"
            >
              <div className="flex min-h-[220px] items-center justify-center bg-neutral-100 p-4 md:min-h-[360px]">
                {isImage(selected.mime_type) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.public_url}
                    alt={selected.name}
                    className="max-h-[50vh] max-w-full object-contain md:max-h-[70vh]"
                  />
                ) : (
                  <div className="rounded-2xl bg-neutral-800 px-8 py-10 text-center text-white">
                    <p className="text-3xl font-semibold">PDF</p>
                    <p className="mt-2 text-sm text-white/60">{selected.name}</p>
                  </div>
                )}
              </div>

              <div className="flex max-h-[90vh] flex-col overflow-y-auto p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2
                      id="media-detail-title"
                      className="truncate text-lg font-semibold text-neutral-900"
                    >
                      {selected.name}
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      {new Date(selected.created_at).toLocaleString("es-PE")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-sm text-neutral-500 hover:text-neutral-900"
                    onClick={() => setSelected(null)}
                  >
                    Cerrar
                  </button>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      Tipo
                    </dt>
                    <dd className="mt-0.5 text-neutral-900">
                      {selected.mime_type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      Tamaño
                    </dt>
                    <dd className="mt-0.5 text-neutral-900">
                      {formatBytes(selected.size_bytes)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      URL
                    </dt>
                    <dd className="mt-0.5 break-all text-xs text-neutral-600">
                      {selected.public_url}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <a
                    href={selected.public_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-lcs-gold px-5 py-2.5 text-sm font-medium text-lcs-black hover:bg-lcs-gold-soft"
                  >
                    Abrir
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => void copyUrl(selected.public_url)}
                  >
                    {copied ? "Copiado" : "Copiar URL"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-neutral-700"
                    onClick={() => setSelected(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}
    </>
  );
}

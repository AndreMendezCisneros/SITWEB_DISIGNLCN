"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/types/database";

type MediaItem = Pick<
  MediaAsset,
  "id" | "name" | "public_url" | "mime_type" | "size_bytes" | "created_at"
>;

export function MediaPicker({
  open,
  onClose,
  onSelect,
  title = "Biblioteca de medios",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, asset: MediaItem) => void;
  title?: string;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const load = useCallback(async (query = "") => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ images: "1" });
    if (query) params.set("q", query);
    const res = await fetch(`/api/admin/media?${params}`);
    setLoading(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(body?.error ?? "No se pudo cargar la biblioteca");
      return;
    }
    const body = (await res.json()) as { items: MediaItem[] };
    setItems(body.items ?? []);
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setQ("");
    void load("");
  }, [open, load]);

  async function onUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/media/upload", {
      method: "POST",
      body,
    });
    setUploading(false);
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(json?.error ?? "Error al subir");
      return;
    }
    const json = (await res.json()) as { asset?: MediaItem };
    await load(q);
    if (json.asset) setSelected(json.asset);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-xs text-neutral-500">
              Elige una imagen o súbela aquí (se optimiza a WebP automáticamente)
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-neutral-500 hover:text-neutral-900"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 px-5 py-3">
          <input
            className="min-w-[180px] flex-1 border border-neutral-300 px-3 py-2 text-sm"
            placeholder="Buscar por nombre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void load(q);
              }
            }}
          />
          <Button type="button" size="sm" variant="outline" onClick={() => void load(q)}>
            Buscar
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-2 border border-neutral-300 px-3 py-2 text-sm hover:border-lcs-gold">
            <span>{uploading ? "Optimizando…" : "Subir imagen"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                void onUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-neutral-500">Cargando biblioteca…</p>
          ) : null}
          {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
          {!loading && items.length === 0 ? (
            <div className="border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              No hay imágenes. Súbelas aquí o en Multimedia y vuelve a abrir el
              selector.
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => {
                const active = selected?.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className={`w-full border p-2 text-left transition ${
                        active
                          ? "border-lcs-gold ring-2 ring-lcs-gold/40"
                          : "border-neutral-200 hover:border-lcs-gold/60"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.public_url}
                        alt={item.name}
                        className="aspect-square w-full object-cover bg-neutral-100"
                      />
                      <p className="mt-2 truncate text-xs text-neutral-700">
                        {item.name}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-4">
          <p className="truncate text-xs text-neutral-500">
            {selected
              ? `Seleccionada: ${selected.name}`
              : "Selecciona una imagen de la cuadrícula"}
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-neutral-700"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                onSelect(selected.public_url, selected);
                onClose();
              }}
            >
              Usar imagen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

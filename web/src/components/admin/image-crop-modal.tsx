"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Button } from "@/components/ui/button";
import {
  getCroppedFile,
  loadImageSource,
  type PixelCrop,
} from "@/lib/media/crop-image";

export const ASPECT_PRESETS = [
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "free", label: "Libre", value: undefined },
] as const;

export type AspectPresetId = (typeof ASPECT_PRESETS)[number]["id"];

function presetFromAspect(aspect?: number): AspectPresetId {
  if (aspect == null) return "free";
  if (Math.abs(aspect - 1) < 0.01) return "1:1";
  if (Math.abs(aspect - 4 / 3) < 0.01) return "4:3";
  if (Math.abs(aspect - 16 / 9) < 0.01) return "16:9";
  return "free";
}

export function ImageCropModal({
  open,
  src,
  defaultAspect,
  onCancel,
  onSkip,
  onCropped,
}: {
  open: boolean;
  src: string;
  defaultAspect?: number;
  onCancel: () => void;
  onSkip: () => void;
  onCropped: (file: File) => Promise<void> | void;
}) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [presetId, setPresetId] = useState<AspectPresetId>(() =>
    presetFromAspect(defaultAspect)
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const aspect =
    ASPECT_PRESETS.find((p) => p.id === presetId)?.value ?? undefined;

  useEffect(() => {
    if (!open || !src) return;
    let revoke: (() => void) | undefined;
    let cancelled = false;
    setLoadError("");
    setDisplaySrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setPresetId(presetFromAspect(defaultAspect));
    setCroppedAreaPixels(null);
    setError("");

    void loadImageSource(src)
      .then((loaded) => {
        if (cancelled) {
          loaded.revoke();
          return;
        }
        revoke = loaded.revoke;
        setDisplaySrc(loaded.objectUrl);
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "No se pudo cargar la imagen"
          );
        }
      });

    return () => {
      cancelled = true;
      revoke?.();
    };
  }, [open, src, defaultAspect]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function applyCrop() {
    if (!displaySrc || !croppedAreaPixels) return;
    setBusy(true);
    setError("");
    try {
      const file = await getCroppedFile(displaySrc, croppedAreaPixels, "crop");
      await onCropped(file);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo aplicar el recorte"
      );
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recortar imagen"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Recortar imagen</h2>
            <p className="text-xs text-neutral-500">
              Arrastra para encuadrar · usa el zoom · elige la proporción
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-neutral-500 hover:text-neutral-900"
            onClick={onCancel}
            disabled={busy}
          >
            Cancelar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-5 py-3">
          <span className="text-xs text-neutral-500">Proporción</span>
          {ASPECT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              className={`border px-2.5 py-1 text-xs ${
                presetId === p.id
                  ? "border-lcs-gold bg-lcs-gold/15 text-neutral-900"
                  : "border-neutral-300 text-neutral-600 hover:border-lcs-gold"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative h-[360px] w-full bg-neutral-900 sm:h-[420px]">
          {loadError ? (
            <p className="p-6 text-sm text-red-300">{loadError}</p>
          ) : displaySrc ? (
            <Cropper
              image={displaySrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
              showGrid
            />
          ) : (
            <p className="p-6 text-sm text-neutral-300">Cargando imagen…</p>
          )}
        </div>

        <div className="space-y-3 border-t border-neutral-200 px-5 py-4">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-12 shrink-0 text-neutral-500">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
              disabled={!displaySrc || busy}
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-neutral-700"
              onClick={onCancel}
              disabled={busy}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              disabled={busy || Boolean(loadError)}
            >
              Usar sin recortar
            </Button>
            <Button
              type="button"
              onClick={() => void applyCrop()}
              disabled={busy || !croppedAreaPixels || Boolean(loadError)}
            >
              {busy ? "Aplicando…" : "Aplicar recorte"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

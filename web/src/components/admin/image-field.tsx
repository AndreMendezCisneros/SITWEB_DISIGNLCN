"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageCropModal } from "@/components/admin/image-crop-modal";
import { MediaPicker } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";

export function ImageField({
  label,
  value,
  onChange,
  aspect,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Proporción por defecto del crop (ej. 16/9, 4/3, 1). */
  aspect?: number;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploadingCrop, setUploadingCrop] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [status, setStatus] = useState("");
  const hasImage = Boolean(value);

  async function uploadCropped(file: File) {
    setUploadingCrop(true);
    setStatus("Subiendo recorte…");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body,
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(json?.error ?? "Error al subir el recorte");
      }
      const json = (await res.json()) as {
        asset?: { public_url?: string };
      };
      const url = json.asset?.public_url;
      if (!url) throw new Error("No se recibió URL del recorte");
      onChange(url);
      setCropSrc(null);
      setStatus("Recorte aplicado.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error al subir el recorte");
      throw e;
    } finally {
      setUploadingCrop(false);
    }
  }

  return (
    <div className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <div className="flex flex-col gap-3 rounded-2xl bg-[#f6f6f6] p-3 ring-1 ring-black/[0.04]">
        {hasImage ? (
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-24 w-24 shrink-0 object-cover bg-white"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-neutral-500">{value}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPickerOpen(true)}
                  disabled={uploadingCrop}
                >
                  Cambiar imagen
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setCropSrc(value)}
                  disabled={uploadingCrop}
                >
                  Recortar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => setConfirmClear(true)}
                  disabled={uploadingCrop}
                >
                  Quitar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => setPickerOpen(true)}
              disabled={uploadingCrop}
            >
              Elegir de la biblioteca
            </Button>
            <span className="text-xs text-neutral-500">
              Luego puedes recortar la zona visible (tipo foto de perfil)
            </span>
          </div>
        )}
        <label className="block">
          <span className="mb-1 block text-xs text-neutral-500">
            URL (opcional, avanzada)
          </span>
          <input
            className="w-full border border-neutral-300 bg-white px-3 py-2 text-xs"
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            disabled={uploadingCrop}
          />
        </label>
        {status ? (
          <p className="text-xs text-neutral-600">{status}</p>
        ) : null}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setPickerOpen(false);
          setCropSrc(url);
        }}
        title={`Elegir imagen — ${label}`}
      />

      <ImageCropModal
        open={Boolean(cropSrc)}
        src={cropSrc ?? ""}
        defaultAspect={aspect}
        onCancel={() => setCropSrc(null)}
        onSkip={() => {
          if (cropSrc) onChange(cropSrc);
          setCropSrc(null);
          setStatus("");
        }}
        onCropped={uploadCropped}
      />

      <ConfirmDialog
        open={confirmClear}
        title="¿Quitar la imagen?"
        message={`Se quitará la imagen de «${label}». El archivo seguirá en Multimedia, pero este registro quedará sin imagen hasta que elijas otra.`}
        confirmLabel="Sí, quitar"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          onChange("");
          setConfirmClear(false);
          setStatus("");
        }}
      />
    </div>
  );
}

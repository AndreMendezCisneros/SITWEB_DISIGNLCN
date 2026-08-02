"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type OptimizationInfo = {
  optimized: boolean;
  savedPercent: number;
  originalLabel: string;
  optimizedLabel: string;
};

export function MediaUpload() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function onChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("Optimizando y subiendo…");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/media/upload", {
      method: "POST",
      body,
    });
    setBusy(false);
    if (res.status === 429) {
      setStatus("Rate limit de uploads. Intenta más tarde.");
      return;
    }
    if (!res.ok) {
      const text = await res.text();
      let message = "Error al subir";
      try {
        const json = JSON.parse(text) as { error?: string };
        if (json.error) message = json.error;
      } catch {
        if (res.status === 500) {
          message =
            "Error del servidor al subir. Reinicia `npm run dev` e intenta de nuevo.";
        }
      }
      setStatus(message);
      return;
    }
    const json = (await res.json()) as {
      optimization?: OptimizationInfo;
    };
    const opt = json.optimization;
    if (opt?.optimized && opt.savedPercent > 0) {
      setStatus(
        `Subido y optimizado: ${opt.originalLabel} → ${opt.optimizedLabel} (−${opt.savedPercent}%).`
      );
    } else {
      setStatus("Archivo subido y auditado.");
    }
    router.refresh();
  }

  return (
    <div className="cms-card p-5">
      <p className="text-sm font-semibold">Subir archivo</p>
      <p className="mt-1 text-xs text-neutral-500">
        JPEG, PNG, WebP o PDF · máx. 10 MB · las imágenes se convierten a WebP,
        se redimensionan (máx. 1920px) y se comprimen automáticamente
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          className="text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          disabled={busy}
          onChange={(e) => onChange(e.target.files)}
        />
        <Button type="button" disabled>
          {busy ? "Procesando…" : "Subir"}
        </Button>
      </div>
      {status ? <p className="mt-2 text-sm text-neutral-600">{status}</p> : null}
    </div>
  );
}

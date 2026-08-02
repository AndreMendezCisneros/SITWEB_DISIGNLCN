"use client";

import { Button } from "@/components/ui/button";
import { ModalPortal } from "@/components/admin/modal-portal";

export function ConfirmDialog({
  open,
  title = "Confirmar eliminación",
  message,
  confirmLabel = "Sí, eliminar",
  cancelLabel = "Cancelar",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Capa oscura a pantalla completa (incluye header/sidebar) */}
        <button
          type="button"
          aria-label="Cerrar"
          className="absolute inset-0 bg-black/60"
          onClick={pending ? undefined : onCancel}
        />
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-desc"
          className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl"
        >
          <h2 id="confirm-dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <p id="confirm-dialog-desc" className="mt-2 text-sm text-neutral-600">
            {message}
          </p>
          <p className="mt-2 text-xs text-amber-700">
            Esta acción no se puede deshacer.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-neutral-700"
              onClick={onCancel}
              disabled={pending}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={onConfirm}
              disabled={pending}
            >
              {pending ? "Eliminando…" : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

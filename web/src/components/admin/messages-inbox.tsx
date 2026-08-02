"use client";

import { useState, useTransition } from "react";
import { markMessageReadAction } from "@/app/(admin)/admin/actions-messages";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import type { ContactMessage } from "@/types/database";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-neutral-900 whitespace-pre-wrap break-words">
        {value || "—"}
      </dd>
    </div>
  );
}

export function MessagesInbox({
  rows: initialRows,
  canWrite,
}: {
  rows: ContactMessage[];
  canWrite: boolean;
}) {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [pending, startTransition] = useTransition();

  function openMessage(row: ContactMessage) {
    setSelected(row);
    if (canWrite && !row.is_read) {
      startTransition(async () => {
        try {
          await markMessageReadAction(row.id, true);
          setRows((prev) =>
            prev.map((m) => (m.id === row.id ? { ...m, is_read: true } : m))
          );
          setSelected((prev) =>
            prev && prev.id === row.id ? { ...prev, is_read: true } : prev
          );
        } catch {
          // El detalle sigue visible aunque no se marque leído.
        }
      });
    }
  }

  return (
    <>
      <DataTable
        rows={rows}
        empty="No hay mensajes todavía."
        columns={[
          { key: "name", header: "Nombre", cell: (r) => r.name },
          { key: "email", header: "Email", cell: (r) => r.email },
          {
            key: "message",
            header: "Mensaje",
            cell: (r) => (
              <span className="line-clamp-2 max-w-xs">{r.message}</span>
            ),
          },
          {
            key: "created",
            header: "Fecha",
            cell: (r) => new Date(r.created_at).toLocaleString("es-PE"),
          },
          {
            key: "read",
            header: "Leído",
            cell: (r) => (r.is_read ? "Sí" : "No"),
          },
          {
            key: "actions",
            header: "Acciones",
            cell: (r) => (
              <button
                type="button"
                className="rounded-full bg-[#f3f3f3] px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-lcs-black hover:text-lcs-gold"
                onClick={() => openMessage(r)}
              >
                Abrir
              </button>
            ),
          },
        ]}
      />

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-dialog-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="message-dialog-title"
                  className="text-lg font-semibold"
                >
                  Mensaje de contacto
                </h2>
                <p className="text-xs text-neutral-500">
                  {new Date(selected.created_at).toLocaleString("es-PE")}
                  {pending ? " · marcando como leído…" : null}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-neutral-500 hover:text-neutral-900"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </div>

            <dl className="mt-5 space-y-4">
              <Field label="Nombre" value={selected.name} />
              <Field label="Empresa" value={selected.company} />
              <Field
                label="Correo"
                value={
                  <a
                    className="text-lcs-gold hover:underline"
                    href={`mailto:${selected.email}`}
                  >
                    {selected.email}
                  </a>
                }
              />
              <Field
                label="Teléfono"
                value={
                  selected.phone ? (
                    <a
                      className="text-lcs-gold hover:underline"
                      href={`tel:${selected.phone}`}
                    >
                      {selected.phone}
                    </a>
                  ) : null
                }
              />
              <Field label="Mensaje" value={selected.message} />
              <Field
                label="Estado"
                value={`${selected.is_read ? "Leído" : "No leído"}${
                  selected.is_archived ? " · Archivado" : ""
                }`}
              />
            </dl>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                className="text-neutral-700"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </Button>
              <a
                className="inline-flex items-center justify-center bg-lcs-gold px-5 py-2.5 text-sm font-medium text-lcs-black hover:bg-lcs-gold-soft"
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  "Re: Contacto LCS"
                )}`}
              >
                Responder
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

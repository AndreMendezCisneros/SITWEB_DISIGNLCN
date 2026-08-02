"use client";

import { useState, useTransition } from "react";
import { deleteEntityAction, saveEntityAction } from "@/app/(admin)/admin/actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageField } from "@/components/admin/image-field";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "image";
  options?: { label: string; value: string }[];
  /** Aspecto por defecto del recorte (solo type image). */
  aspect?: number;
  /** Texto de ayuda bajo el campo. */
  helperText?: string;
};

export function SimpleCrud({
  table,
  title,
  fields,
  rows,
  revalidatePath,
  readOnly = false,
  hideTitle = false,
}: {
  table: string;
  title: string;
  fields: CrudField[];
  rows: Array<Record<string, unknown> & { id: string }>;
  revalidatePath: string;
  readOnly?: boolean;
  hideTitle?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<
    (Record<string, unknown> & { id: string }) | null
  >(null);
  const [error, setError] = useState("");

  function labelForRow(row: Record<string, unknown>) {
    for (const key of ["title", "name", "label", "key"]) {
      const val = row[key];
      if (typeof val === "string" && val.trim()) return val;
    }
    return "este registro";
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    startTransition(async () => {
      try {
        await deleteEntityAction(table, row.id, revalidatePath);
        setPendingDelete(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al eliminar");
        setPendingDelete(null);
      }
    });
  }

  function openCreate() {
    if (readOnly) return;
    const blank: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "number") {
        blank[f.name] = 0;
      } else if (f.name === "status") {
        blank[f.name] = "draft";
      } else if (f.name === "featured") {
        blank[f.name] = "false";
      } else if (f.type === "select" && f.options?.[0]) {
        blank[f.name] = f.options[0].value;
      } else {
        blank[f.name] = "";
      }
    });
    setEditing(blank);
  }

  function onSave() {
    if (!editing) return;
    setError("");
    startTransition(async () => {
      try {
        const id = typeof editing.id === "string" ? editing.id : undefined;
        const payload = { ...editing };
        delete payload.id;
        await saveEntityAction(table, payload, id, revalidatePath);
        setEditing(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar");
      }
    });
  }

  const imageFields = fields.filter((f) => f.type === "image");
  const textFields = fields
    .filter((f) => f.type !== "image" && f.name !== "status")
    .slice(0, 2);
  const tableFields = [...textFields, ...imageFields];

  function renderCell(
    f: CrudField,
    row: Record<string, unknown> & { id: string }
  ) {
    const val = row[f.name];
    if (f.type === "image") {
      if (typeof val === "string" && val) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={val}
            alt=""
            className="h-12 w-12 object-cover bg-neutral-100"
          />
        );
      }
      return (
        <span className="inline-flex h-12 w-12 items-center justify-center border border-dashed border-neutral-300 text-[10px] text-neutral-400">
          Sin img
        </span>
      );
    }
    const text = String(val ?? "—");
    if (f.type === "select" && f.options?.length) {
      const opt = f.options.find((o) => o.value === text);
      return opt?.label ?? text;
    }
    if (f.type === "textarea" && text.length > 80) {
      return <span className="line-clamp-2 max-w-xs">{text}</span>;
    }
    return text;
  }

  const columns = [
    ...tableFields.map((f) => ({
      key: f.name,
      header: f.label,
      cell: (row: Record<string, unknown> & { id: string }) =>
        renderCell(f, row),
    })),
    ...(readOnly
      ? []
      : [
          {
            key: "actions",
            header: "Acciones",
            cell: (row: Record<string, unknown> & { id: string }) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full bg-[#f3f3f3] px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-lcs-black hover:text-lcs-gold"
                  onClick={() => setEditing(row)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                  onClick={() => {
                    setError("");
                    setPendingDelete(row);
                  }}
                >
                  Eliminar
                </button>
              </div>
            ),
          },
        ]),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {!hideTitle && title ? (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          ) : title && hideTitle ? (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          ) : null}
          {!hideTitle && readOnly ? (
            <p className="cms-pill mt-2 bg-amber-50 text-amber-800 ring-1 ring-amber-200/60">
              Solo lectura
            </p>
          ) : null}
        </div>
        {!readOnly ? (
          <Button
            type="button"
            className="rounded-full px-5 shadow-sm"
            onClick={openCreate}
          >
            Nuevo
          </Button>
        ) : null}
      </div>

      {error && !editing ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <DataTable rows={rows} columns={columns} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar este registro?"
        message={
          pendingDelete
            ? `Vas a eliminar «${labelForRow(pendingDelete)}». Si continúas, dejará de mostrarse en el sitio y en el panel.`
            : ""
        }
        pending={pending && Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold tracking-tight">
              {editing.id ? "Editar" : "Crear"}
            </h2>
            <div className="mt-4 space-y-3">
              {fields.map((field) =>
                field.type === "image" ? (
                  <ImageField
                    key={field.name}
                    label={field.label}
                    value={String(editing[field.name] ?? "")}
                    aspect={field.aspect}
                    onChange={(url) =>
                      setEditing({ ...editing, [field.name]: url })
                    }
                  />
                ) : (
                  <label key={field.name} className="block text-sm">
                    <span className="mb-1 block font-medium">{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full border border-neutral-300 px-3 py-2"
                        value={String(editing[field.name] ?? "")}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.name]: e.target.value,
                          })
                        }
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="w-full border border-neutral-300 px-3 py-2"
                        value={String(editing[field.name] ?? "")}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.name]: e.target.value,
                          })
                        }
                      >
                        {(field.options ?? []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="w-full border border-neutral-300 px-3 py-2"
                        type={field.type === "number" ? "number" : "text"}
                        value={String(editing[field.name] ?? "")}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.name]:
                              field.type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                      />
                    )}
                    {field.helperText ? (
                      <span className="mt-1 block text-xs text-neutral-500">
                        {field.helperText}
                      </span>
                    ) : null}
                  </label>
                )
              )}
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                className="text-neutral-700"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={onSave} disabled={pending}>
                {pending ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const statusField = {
  name: "status",
  label: "Estado",
  type: "select" as const,
  options: [
    { label: "Borrador", value: "draft" },
    { label: "Publicado", value: "published" },
    { label: "Archivado", value: "archived" },
  ],
};

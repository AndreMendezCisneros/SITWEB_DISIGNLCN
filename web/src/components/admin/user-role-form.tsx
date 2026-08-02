"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function UserRoleForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_180px_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setMsg("");
          const res = await fetch("/api/admin/users/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role }),
          });
          const body = (await res.json().catch(() => null)) as {
            error?: string;
            ok?: boolean;
          } | null;
          if (!res.ok) {
            setMsg(body?.error ?? "No se pudo invitar");
            return;
          }
          setMsg("Invitación enviada");
          setEmail("");
        });
      }}
    >
      <input
        className="border border-neutral-300 px-3 py-2 text-sm"
        placeholder="correo@empresa.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select
        className="border border-neutral-300 px-3 py-2 text-sm"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Administrador</option>
        <option value="editor">Editor</option>
        <option value="marketing">Marketing</option>
        <option value="viewer">Visualizador</option>
        <option value="super_admin">Super Administrador</option>
      </select>
      <Button type="submit" disabled={pending}>
        Invitar
      </Button>
      {msg ? (
        <p className="md:col-span-3 text-sm text-neutral-600">{msg}</p>
      ) : null}
    </form>
  );
}

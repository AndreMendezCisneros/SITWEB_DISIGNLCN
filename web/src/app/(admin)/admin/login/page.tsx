"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = (await res.json().catch(() => null)) as {
      error?: string;
      home?: string;
    } | null;
    setLoading(false);
    if (res.status === 429) {
      setError("Demasiados intentos. Espera e intenta de nuevo.");
      return;
    }
    if (!res.ok) {
      setError(body?.error ?? "No se pudo iniciar sesión");
      return;
    }
    router.push(body?.home ?? "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-lcs-black px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-white/10 bg-lcs-charcoal p-8"
      >
        <p className="font-display text-3xl text-lcs-gold">LCS</p>
        <p className="mt-2 text-sm text-lcs-muted">
          Acceso al panel según tu rol (Admin, Editor, Marketing o Consulta)
        </p>
        <label className="mt-8 block text-sm text-lcs-white">
          Correo
          <input
            className="mt-1 w-full border border-white/20 bg-lcs-black px-3 py-2 text-lcs-white"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="mt-4 block text-sm text-lcs-white">
          Contraseña
          <input
            className="mt-1 w-full border border-white/20 bg-lcs-black px-3 py-2 text-lcs-white"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}

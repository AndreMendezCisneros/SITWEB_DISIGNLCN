"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "forgot";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const reasonMessage = useMemo(() => {
    const reason = searchParams.get("reason");
    if (reason === "idle") {
      return "Tu sesión se cerró por inactividad (15 minutos).";
    }
    if (reason === "jwt") {
      return "Tu sesión no es válida. Inicia sesión de nuevo.";
    }
    return "";
  }, [searchParams]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
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

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = (await res.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;
    setLoading(false);
    if (res.status === 429) {
      setError("Demasiados intentos. Espera e intenta de nuevo.");
      return;
    }
    if (!res.ok) {
      setError(body?.error ?? "No se pudo enviar el correo");
      return;
    }
    setInfo(
      body?.message ??
        "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña.",
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col">
      <h1 className="text-center font-display text-4xl tracking-tight text-neutral-900">
        {mode === "login" ? "Login" : "Recuperar"}
      </h1>
      <p className="mt-2 text-center text-sm text-neutral-500">
        {mode === "login"
          ? "Acceso al CMS según tu rol"
          : "Te enviaremos un enlace si el correo existe"}
      </p>

      {reasonMessage ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm text-amber-800">
          {reasonMessage}
        </p>
      ) : null}

      {mode === "login" ? (
        <form onSubmit={onLogin} className="mt-10 space-y-8">
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-lcs-gold"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <div>
            <div className="mb-1 flex justify-end">
              <button
                type="button"
                className="text-xs text-neutral-500 transition hover:text-lcs-gold"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setInfo("");
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <label className="block">
              <span className="sr-only">Password</span>
              <input
                className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-lcs-gold"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
              />
            </label>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="mx-auto block w-full max-w-[220px] rounded-full bg-lcs-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-lcs-white transition hover:bg-lcs-gold hover:text-lcs-black disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={onForgot} className="mt-10 space-y-8">
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-lcs-gold"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-700">{info}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="mx-auto block w-full max-w-[220px] rounded-full bg-lcs-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-lcs-white transition hover:bg-lcs-gold hover:text-lcs-black disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Enviar enlace"}
          </button>
          <button
            type="button"
            className="mx-auto block text-sm text-neutral-500 hover:text-lcs-gold"
            onClick={() => {
              setMode("login");
              setError("");
              setInfo("");
            }}
          >
            Volver al login
          </button>
        </form>
      )}

      <p className="mt-12 text-center text-sm text-neutral-500">
        Acceso solo por invitación.{" "}
        <span className="text-neutral-400">Sin registro público.</span>
      </p>
    </div>
  );
}

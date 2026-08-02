"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validators/contact";
import { Button } from "@/components/ui/button";
import {
  TurnstileWidget,
  resetTurnstile,
} from "@/components/public/turnstile-widget";

const fieldClass =
  "w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-lcs-black focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-lcs-gold";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "ok" | "ok_partial" | "error" | "limited"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      website: "",
      startedAt: Date.now(),
      turnstileToken: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setStatus("idle");
    setErrorMsg("");

    if (siteKey && !turnstileToken) {
      setErrorMsg("Completa la verificación anti-robot antes de enviar.");
      setStatus("error");
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        turnstileToken: turnstileToken || values.turnstileToken || "",
      }),
    });
    if (res.status === 429) {
      setStatus("limited");
      resetTurnstile();
      setTurnstileToken("");
      return;
    }
    const body = (await res.json().catch(() => null)) as {
      error?: string;
      ok?: boolean;
      emailSent?: boolean;
    } | null;
    if (!res.ok) {
      setErrorMsg(body?.error ?? "No se pudo enviar el mensaje.");
      setStatus("error");
      resetTurnstile();
      setTurnstileToken("");
      return;
    }
    setStatus(body?.emailSent === false ? "ok_partial" : "ok");
    setTurnstileToken("");
    resetTurnstile();
    form.reset({
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      website: "",
      startedAt: Date.now(),
      turnstileToken: "",
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 text-lcs-black md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Nombre</span>
          <input className={fieldClass} {...form.register("name")} />
          {form.formState.errors.name ? (
            <span className="mt-1 block text-xs text-red-600">
              {form.formState.errors.name.message}
            </span>
          ) : null}
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Empresa</span>
          <input className={fieldClass} {...form.register("company")} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Correo</span>
          <input
            className={fieldClass}
            type="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <span className="mt-1 block text-xs text-red-600">
              {form.formState.errors.email.message}
            </span>
          ) : null}
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Teléfono</span>
          <input className={fieldClass} {...form.register("phone")} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Mensaje</span>
        <textarea
          className={`${fieldClass} min-h-32`}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <span className="mt-1 block text-xs text-red-600">
            {form.formState.errors.message.message}
          </span>
        ) : null}
      </label>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        {...form.register("website")}
      />

      {siteKey ? (
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">Verificación de seguridad</p>
          <TurnstileWidget
            siteKey={siteKey}
            onToken={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
          />
        </div>
      ) : (
        <p className="text-xs text-neutral-400">
          Anti-robot desactivado en este entorno (falta
          NEXT_PUBLIC_TURNSTILE_SITE_KEY).
        </p>
      )}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Enviando…" : "Enviar mensaje"}
      </Button>
      {status === "ok" ? (
        <p className="text-sm text-emerald-700">
          Mensaje enviado correctamente. Te contactaremos pronto.
        </p>
      ) : null}
      {status === "ok_partial" ? (
        <p className="text-sm text-amber-800">
          Recibimos tu mensaje en nuestro sistema, pero el aviso por correo no
          pudo enviarse ahora. Si es urgente, llama o escribe directamente a
          contactenos@lcs.pe.
        </p>
      ) : null}
      {status === "limited" ? (
        <p className="text-sm text-amber-700">
          Demasiados intentos. Intenta de nuevo más tarde.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-700">{errorMsg}</p>
      ) : null}
    </form>
  );
}

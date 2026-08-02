/**
 * Cloudflare Turnstile — verificación server-side.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export type TurnstileVerifyResult = {
  ok: boolean;
  errorCodes?: string[];
  /** true si se omitió la verificación (solo dev sin keys) */
  skipped?: boolean;
};

export function isTurnstileConfigured() {
  const site = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  return Boolean(site && secret);
}

/**
 * En producción Turnstile es obligatorio.
 * En desarrollo sin keys se puede omitir (log de aviso).
 */
export function isTurnstileRequired() {
  if (isTurnstileConfigured()) return true;
  return process.env.NODE_ENV === "production";
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteip?: string
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, errorCodes: ["missing-secret"] };
    }
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY ausente — verificación omitida en desarrollo"
    );
    return { ok: true, skipped: true };
  }

  const response = typeof token === "string" ? token.trim() : "";
  if (!response) {
    return { ok: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response,
    });
    if (remoteip && remoteip !== "unknown") {
      body.set("remoteip", remoteip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (data.success === true) {
      return { ok: true };
    }
    return {
      ok: false,
      errorCodes: data["error-codes"] ?? ["verification-failed"],
    };
  } catch (e) {
    console.error("[turnstile] siteverify error", e);
    return { ok: false, errorCodes: ["network-error"] };
  }
}

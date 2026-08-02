import { jwtVerify, type JWTPayload } from "jose";
import { isSupabaseConfigured } from "@/lib/env";

function looksConfigured(value: string | undefined) {
  if (!value) return false;
  const v = value.trim();
  return v.length >= 16 && !v.toLowerCase().includes("your_");
}

export function getJwtSecret(): string | null {
  const secret = process.env.SUPABASE_JWT_SECRET;
  return looksConfigured(secret) ? secret!.trim() : null;
}

export type JwtVerifyResult =
  | { ok: true; payload: JWTPayload; skipped?: false }
  | { ok: true; skipped: true; payload?: undefined }
  | { ok: false; error: "missing_jwt_secret" | "invalid_token" };

/**
 * Verifica el access token de Supabase Auth (HS256) con SUPABASE_JWT_SECRET.
 * En desarrollo sin secret: warning y skip (getUser() sigue siendo la fuente de verdad).
 * En producción con Supabase: el secret es obligatorio.
 */
export async function verifyAccessToken(
  token: string,
): Promise<JwtVerifyResult> {
  const secret = getJwtSecret();
  if (!secret) {
    if (process.env.NODE_ENV === "production" && isSupabaseConfigured()) {
      return { ok: false, error: "missing_jwt_secret" };
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[auth] SUPABASE_JWT_SECRET ausente; se omite verificación local JWT",
      );
    }
    return { ok: true, skipped: true };
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        algorithms: ["HS256"],
        ...(url ? { issuer: `${url}/auth/v1` } : {}),
      },
    );
    return { ok: true, payload };
  } catch {
    // Reintento sin issuer por si el proyecto usa claim distinto.
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
        { algorithms: ["HS256"] },
      );
      return { ok: true, payload };
    } catch {
      return { ok: false, error: "invalid_token" };
    }
  }
}

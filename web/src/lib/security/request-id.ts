import { headers } from "next/headers";

export function createRequestId() {
  return crypto.randomUUID();
}

export async function getRequestIdFromHeaders() {
  const h = await headers();
  return h.get("x-request-id") ?? createRequestId();
}

export function getClientIp(h: Headers) {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

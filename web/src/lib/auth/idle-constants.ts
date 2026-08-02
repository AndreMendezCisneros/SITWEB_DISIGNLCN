export const IDLE_COOKIE = "lcs_last_active";
export const IDLE_MS = 15 * 60 * 1000;
/** Max Age de la cookie (1 día); el idle real lo impone IDLE_MS. */
export const IDLE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24;

export function isIdleExpired(
  value: string | undefined | null,
  now = Date.now(),
): boolean {
  if (!value) return true;
  const ts = Number(value);
  if (!Number.isFinite(ts)) return true;
  return now - ts > IDLE_MS;
}

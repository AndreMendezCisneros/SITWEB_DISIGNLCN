import type { NextResponse } from "next/server";
import {
  IDLE_COOKIE,
  IDLE_COOKIE_MAX_AGE_SEC,
  isIdleExpired,
} from "@/lib/auth/idle-constants";

export {
  IDLE_COOKIE,
  IDLE_COOKIE_MAX_AGE_SEC,
  IDLE_MS,
  isIdleExpired,
} from "@/lib/auth/idle-constants";

export function idleCookieOptions(maxAge = IDLE_COOKIE_MAX_AGE_SEC) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function setIdleCookie(response: NextResponse, now = Date.now()) {
  response.cookies.set(IDLE_COOKIE, String(now), idleCookieOptions());
}

export function clearIdleCookie(response: NextResponse) {
  response.cookies.set(IDLE_COOKIE, "", idleCookieOptions(0));
}

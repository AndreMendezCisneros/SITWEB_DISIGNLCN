"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IDLE_MS } from "@/lib/auth/idle-constants";

const PING_THROTTLE_MS = 30_000;

/**
 * Cierra sesión tras 15 min sin actividad (cliente).
 * El middleware también valida la cookie httpOnly `lcs_last_active`.
 */
export function IdleLogout() {
  const router = useRouter();
  const lastPing = useRef(0);
  const deadline = useRef(Date.now() + IDLE_MS);

  useEffect(() => {
    let cancelled = false;

    const logoutIdle = async () => {
      if (cancelled) return;
      try {
        await fetch("/api/auth/logout?reason=idle", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } catch {
        // ignore
      }
      router.replace("/admin/login?reason=idle");
      router.refresh();
    };

    const ping = () => {
      const now = Date.now();
      deadline.current = now + IDLE_MS;
      if (now - lastPing.current < PING_THROTTLE_MS) return;
      lastPing.current = now;
      void fetch("/api/auth/activity", { method: "POST" }).catch(() => null);
    };

    const onActivity = () => ping();

    const windowEvents: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
    ];
    for (const ev of windowEvents) {
      window.addEventListener(ev, onActivity, { passive: true });
    }
    document.addEventListener("visibilitychange", onActivity);

    ping();

    const timer = window.setInterval(() => {
      if (Date.now() >= deadline.current) {
        void logoutIdle();
      }
    }, 15_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      for (const ev of windowEvents) {
        window.removeEventListener(ev, onActivity);
      }
      document.removeEventListener("visibilitychange", onActivity);
    };
  }, [router]);

  return null;
}

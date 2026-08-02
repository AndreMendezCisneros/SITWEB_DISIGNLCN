"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Monta children en document.body para que el overlay cubra todo el viewport. */
export function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

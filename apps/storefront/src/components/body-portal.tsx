"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Portals its children to <body>.
 *
 * The sticky header uses backdrop-blur, which makes it the containing block
 * for position:fixed descendants. Overlays rendered inside the header would
 * therefore be clipped to the header's box instead of the viewport.
 */
export function BodyPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(children, document.body);
}

"use client";

import { useEffect, useState } from "react";
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/lib/theme-context";

// FFIE Toaster host (sonner)
// =============================================================================
// Single instance mounted in the root layout. Wraps `sonner`, which gives us
// stacked toasts with a built-in dismiss timer, swipe-to-dismiss, pause-on-hover,
// and pause-when-the-tab-is-hidden out of the box (sonner v2 defaults — no
// prop needed). See Toast.md §6.
//
// Toasts are rendered via `toast.custom(...)` in @/components/ui/Toast.tsx —
// the host is responsible only for positioning, theme, and stack behavior.
//
// Spec: project/design-system/components/Toast.md §3 (position policy),
//       Toast.md §6 (stacking + pause behavior).
//
// Position policy:
//   - < md (phone, Julien's worksite) → top-center (thumb-reachable)
//   - ≥ md (desktop, Sylvie's back-office)     → bottom-right
//
// The position is set per the FFIE viewport at mount time and re-evaluated
// on resize. We deliberately re-mount the SonnerToaster on position change
// (via key) since sonner reads position only on mount.

const MD_BREAKPOINT = 768;

type Position = "top-center" | "bottom-right";

function pickPosition(): Position {
  if (typeof window === "undefined") return "top-center";
  return window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`).matches
    ? "bottom-right"
    : "top-center";
}

export function Toaster() {
  const { themeName } = useTheme();
  // sonner accepts "light" | "dark" | "system". sunlight reuses light styling.
  const sonnerTheme = themeName === "dark" ? "dark" : "light";

  const [position, setPosition] = useState<Position>("top-center");

  useEffect(() => {
    setPosition(pickPosition());
    const mq = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const handler = () => setPosition(pickPosition());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <SonnerToaster
      key={position}
      theme={sonnerTheme}
      position={position}
      visibleToasts={3}
      expand
      gap={8}
      offset={16}
    />
  );
}

"use client";

import { forwardRef, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  RefreshCw,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import { primitives, themes, type ThemeName } from "@tokens";

// ---------------------------------------------------------------------------
// Types — mirrors project/design-system/components/StatusPill.md §4.
// ---------------------------------------------------------------------------

export type StatusName =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "offline"
  | "syncing"
  | "stale"
  | "fresh";

export type StatusPillVariant = "filled" | "subtle";
export type StatusPillSize = "sm" | "md" | "lg";

type Base = {
  name: StatusName;
  variant?: StatusPillVariant;
  children?: ReactNode;
  icon?: LucideIcon;
  live?: boolean;
  pulse?: boolean;
  themeName?: ThemeName;
  ariaLabel?: string;
};

// Discriminated invariant: onPress only valid when size="lg".
type Tappable =
  | { size: "lg"; onPress?: () => void }
  | { size?: "sm" | "md"; onPress?: never };

export type StatusPillProps = Base & Tappable;

// ---------------------------------------------------------------------------
// Default icon mapping (StatusPill.md §4) — the colour-independence backbone.
// ---------------------------------------------------------------------------

const ICON_BY_NAME: Record<StatusName, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  offline: WifiOff,
  syncing: RefreshCw,
  stale: Clock,
  fresh: CheckCircle2,
};

// Default labels — FR (canonical for FFIE) per spec §4.
const LABEL_BY_NAME: Record<StatusName, string> = {
  success: "Réussi",
  warning: "Attention",
  danger: "Erreur",
  info: "Info",
  offline: "Hors-ligne",
  syncing: "Sync…",
  stale: "Périmé",
  fresh: "À jour",
};

// `fresh` resolves to the success palette per spec §3.
function resolveFeedbackName(name: StatusName): Exclude<StatusName, "fresh"> {
  return name === "fresh" ? "success" : name;
}

// ---------------------------------------------------------------------------
// Size table — StatusPill.md §3.
// ---------------------------------------------------------------------------

const SIZE_TABLE: Record<StatusPillSize, { height: number; iconSize: number; textStyle: keyof typeof primitives.textStyles; padX: number }> = {
  sm: { height: 20, iconSize: 12, textStyle: "caption", padX: 6 },
  md: { height: 24, iconSize: 14, textStyle: "label.sm", padX: primitives.space[2] }, // 8
  lg: { height: 32, iconSize: 16, textStyle: "label.md", padX: primitives.space[3] }, // 12
};

// ---------------------------------------------------------------------------
// Color resolver — pulls fg/bg/border per variant per theme per name.
// ---------------------------------------------------------------------------

type Resolved = { bg: string; fg: string; border: string | "none"; bgPressed: string };

function resolveColors(name: StatusName, variant: StatusPillVariant, themeName: ThemeName): Resolved {
  const t = themes[themeName];
  const feedbackName = resolveFeedbackName(name);
  if (variant === "filled") {
    const bg = t.feedback[feedbackName];
    return {
      bg,
      fg: t.text.inverse,
      border: "none",
      // Pressed: shift one ramp step using known anchors. For simplicity
      // we use a 10% black overlay via rgba — works across themes.
      bgPressed: shadeMix(bg, themeName === "dark" ? "lighten" : "darken", 0.12),
    };
  }
  // subtle
  const sub = t.feedback.subtle[feedbackName];
  return {
    bg: sub.bg,
    fg: sub.fg,
    border: sub.border,
    bgPressed: shadeMix(sub.bg, themeName === "dark" ? "lighten" : "darken", 0.08),
  };
}

// Tiny client-side color mixer — used only to derive a pressed-state delta.
function shadeMix(hex: string, dir: "lighten" | "darken", amount: number): string {
  // Fast-path for non-hex (transparent / "white" etc) — just return.
  if (!hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) return hex;
  const full = hex.length === 4
    ? "#" + [...hex.slice(1)].map((c) => c + c).join("")
    : hex;
  const r = parseInt(full.slice(1, 3), 16);
  const g = parseInt(full.slice(3, 5), 16);
  const b = parseInt(full.slice(5, 7), 16);
  const adj = (c: number) =>
    Math.round(dir === "darken" ? c * (1 - amount) : c + (255 - c) * amount);
  const rr = adj(r).toString(16).padStart(2, "0");
  const gg = adj(g).toString(16).padStart(2, "0");
  const bb = adj(b).toString(16).padStart(2, "0");
  return `#${rr}${gg}${bb}`;
}

// ---------------------------------------------------------------------------
// StatusPill
// ---------------------------------------------------------------------------

export const StatusPill = forwardRef<HTMLElement, StatusPillProps>(function StatusPill(props, ref) {
  const {
    name,
    variant = "filled",
    size = "md",
    children,
    icon,
    live = false,
    pulse,
    themeName = "light",
    ariaLabel,
    onPress,
  } = props as StatusPillProps & { size: StatusPillSize; onPress?: () => void };

  const colors = resolveColors(name, variant, themeName);
  const sz = SIZE_TABLE[size];
  const text = primitives.textStyles[sz.textStyle];
  const Icon = icon ?? ICON_BY_NAME[name];
  const isTappable = size === "lg" && typeof onPress === "function";
  const isSyncing = name === "syncing";

  // `pulse` defaults to true for syncing (per spec §5).
  const shouldPulse = pulse ?? isSyncing;

  // prefers-reduced-motion: drop pulse; keep rotation (the affordance).
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // `fresh` auto-fades after 3s per spec §5 (caller can cancel by unmounting).
  const [freshVisible, setFreshVisible] = useState(true);
  useEffect(() => {
    if (name !== "fresh") return;
    const id = window.setTimeout(() => setFreshVisible(false), 3000);
    return () => window.clearTimeout(id);
  }, [name]);

  // Tappable press feedback (lg only).
  const [isPressed, setIsPressed] = useState(false);

  const t = themes[themeName];
  const labelText = children ?? LABEL_BY_NAME[name];

  const containerStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    columnGap: primitives.space[1], // inline.tight = 4
    height: sz.height,
    paddingLeft: sz.padX,
    paddingRight: sz.padX,
    backgroundColor: isPressed ? colors.bgPressed : colors.bg,
    color: colors.fg,
    border: colors.border === "none" ? "none" : `1px solid ${colors.border}`,
    borderRadius: primitives.radii.full,
    fontFamily: text.fontFamily,
    fontSize: text.fontSize,
    lineHeight: 1, // pill keeps height fixed; line-height doesn't matter
    fontWeight: text.fontWeight,
    letterSpacing: `${text.letterSpacing}em`,
    cursor: isTappable ? "pointer" : "default",
    userSelect: "none",
    transform: isPressed && !reducedMotion ? "scale(0.97)" : undefined,
    transition: reducedMotion
      ? `background-color ${primitives.motion.duration.fast}ms ${primitives.motion.easing.standard}`
      : `background-color ${primitives.motion.duration.fast}ms ${primitives.motion.easing.standard}, transform ${primitives.motion.duration.fast}ms ${primitives.motion.easing.standard}, opacity ${primitives.motion.duration.slow}ms ease`,
    opacity: name === "fresh" && !freshVisible ? 0 : 1,
    ["--btn-focus-color" as never]: t.border.focus,
    animation: shouldPulse && !reducedMotion ? `ffie-pulse ${primitives.motion.duration.loop}ms ease-in-out infinite` : undefined,
    // Hit-slop for lg+tappable — visible 32 + 6+6 padding = 44pt target.
    boxSizing: "border-box",
  };

  const iconClass = isSyncing ? "ffie-spin" : undefined;

  // Common children element.
  const inner = (
    <>
      <Icon size={sz.iconSize} className={iconClass} aria-hidden="true" />
      <span>{labelText}</span>
    </>
  );

  // Tappable variant — render as <button> with hit-slop wrapper.
  if (isTappable) {
    return (
      <span
        style={{ display: "inline-flex", paddingTop: 6, paddingBottom: 6, marginTop: -6, marginBottom: -6 }}
      >
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className="ffie-button"
          style={containerStyle}
          onClick={onPress}
          onPointerDown={() => setIsPressed(true)}
          onPointerUp={() => setIsPressed(false)}
          onPointerLeave={() => setIsPressed(false)}
          onPointerCancel={() => setIsPressed(false)}
          aria-label={ariaLabel}
          aria-live={live ? "polite" : undefined}
          aria-atomic={live ? "true" : undefined}
        >
          {inner}
        </button>
      </span>
    );
  }

  return (
    <span
      ref={ref}
      role="status"
      style={containerStyle}
      aria-label={ariaLabel}
      aria-live={live ? "polite" : undefined}
      aria-atomic={live ? "true" : undefined}
    >
      {inner}
    </span>
  );
});

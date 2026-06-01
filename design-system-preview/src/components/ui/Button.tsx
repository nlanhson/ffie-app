"use client";

import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { primitives, semantics, themes, withDensity, type DensityMode, type ThemeName } from "@tokens";

// ---------------------------------------------------------------------------
// Types — mirrors project/design-system/components/Button.md §4.
// ---------------------------------------------------------------------------

export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ConfirmMode = "undo" | "hold";

type Base = {
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  density?: DensityMode;
  themeName?: ThemeName;
  iconLeading?: LucideIcon;
  iconTrailing?: LucideIcon;
  onPress: () => void;
  ariaDescribedBy?: string;
};

type ContentVariant =
  | { iconOnly: true; ariaLabel: string; children?: never }
  | { iconOnly?: false; ariaLabel?: string; children: ReactNode };

type ConfirmVariant =
  | { variant?: "primary" | "secondary" | "ghost"; confirm?: never }
  | { variant: "destructive"; confirm: ConfirmMode };

export type ButtonProps = Base & ContentVariant & ConfirmVariant;

// ---------------------------------------------------------------------------
// Size table — see Button.md §3.
// ---------------------------------------------------------------------------

const SIZE_TABLE: Record<ButtonSize, { height: number; iconSize: number; textStyle: keyof typeof primitives.textStyles }> = {
  sm: { height: 40, iconSize: primitives.sizes.icon.sm, textStyle: "label.md" },
  md: { height: 48, iconSize: primitives.sizes.icon.md, textStyle: "label.lg" },
  lg: { height: 56, iconSize: primitives.sizes.icon.lg, textStyle: "label.lg" },
};

// ---------------------------------------------------------------------------
// Variant resolver — pulls bg / bgHover / bgPressed / fg / border per theme.
// ---------------------------------------------------------------------------

type VariantColors = {
  bg: string;
  bgHover: string;
  bgPressed: string;
  fg: string;
  border: string | "none";
};

function resolveVariant(variant: ButtonVariant, themeName: ThemeName): VariantColors {
  const t = themes[themeName];
  switch (variant) {
    case "primary":
      return {
        bg: t.action.primary.bg,
        bgHover: t.action.primary.bgHover,
        bgPressed: t.action.primary.bgPressed,
        fg: t.action.primary.fg,
        border: "none",
      };
    case "secondary":
      return {
        bg: t.action.secondary.bg,
        bgHover: t.action.secondary.bgHover,
        bgPressed: t.action.secondary.bgPressed,
        fg: t.action.secondary.fg,
        border: t.action.secondary.border,
      };
    case "destructive":
      return {
        bg: t.action.destructive.bg,
        bgHover: t.action.destructive.bgHover,
        bgPressed: t.action.destructive.bgPressed,
        fg: t.action.destructive.fg,
        border: "none",
      };
    case "ghost":
      return {
        bg: "transparent",
        bgHover: t.surface.subtle,
        bgPressed: t.border.subtle,
        fg: t.text.muted,
        border: "none",
      };
  }
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    density = "comfortable",
    themeName = "light",
    iconLeading,
    iconTrailing,
    iconOnly = false,
    ariaLabel,
    ariaDescribedBy,
    onPress,
    children,
    confirm,
  } = props as ButtonProps & { variant?: ButtonVariant; confirm?: ConfirmMode };

  const colors = resolveVariant(variant, themeName);
  const sz = SIZE_TABLE[size];
  const text = primitives.textStyles[sz.textStyle];
  const t = themes[themeName];

  // Density-aware horizontal padding. Height stays fixed to size floor.
  const padX = withDensity("inset", "default", density);

  // Visual state: hover (pointer only), pressed.
  const [isHover, setIsHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Hold-confirm progress (0 → 1). Only used when variant=destructive + confirm=hold.
  const [holdProgress, setHoldProgress] = useState(0);
  const holdRafRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const holdFiredRef = useRef(false);

  // prefers-reduced-motion — skip scale anim. Hold arc still fills (safety mechanic).
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Cleanup hold RAF on unmount.
  useEffect(() => () => {
    if (holdRafRef.current != null) cancelAnimationFrame(holdRafRef.current);
  }, []);

  const isInteractive = !disabled && !loading;
  const isHoldVariant = variant === "destructive" && confirm === "hold";

  // Background resolution with state precedence: pressed > hover > default.
  // While hold is in flight, treat as pressed visual.
  const inHoldFlight = isHoldVariant && holdProgress > 0 && holdProgress < 1;
  const bgColor = !isInteractive
    ? colors.bg
    : isPressed || inHoldFlight
      ? colors.bgPressed
      : isHover
        ? colors.bgHover
        : colors.bg;

  // Hold press handlers.
  const beginHold = () => {
    if (!isHoldVariant || !isInteractive) return;
    holdStartRef.current = performance.now();
    holdFiredRef.current = false;
    const dur = primitives.motion.duration.confirm;
    const tick = (now: number) => {
      if (holdStartRef.current == null) return;
      const elapsed = now - holdStartRef.current;
      const p = Math.min(1, elapsed / dur);
      setHoldProgress(p);
      if (p >= 1 && !holdFiredRef.current) {
        holdFiredRef.current = true;
        onPress();
        // Brief success state, then reset.
        window.setTimeout(() => setHoldProgress(0), 240);
        return;
      }
      holdRafRef.current = requestAnimationFrame(tick);
    };
    holdRafRef.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (!isHoldVariant) return;
    if (holdRafRef.current != null) cancelAnimationFrame(holdRafRef.current);
    holdStartRef.current = null;
    if (!holdFiredRef.current) setHoldProgress(0);
  };

  const handlePointerDown = () => {
    if (!isInteractive) return;
    setIsPressed(true);
    beginHold();
  };

  const handlePointerUp = () => {
    if (!isInteractive) return;
    setIsPressed(false);
    cancelHold();
  };

  const handlePointerCancel = () => {
    setIsPressed(false);
    cancelHold();
  };

  const handleClick = () => {
    if (!isInteractive) return;
    // Hold variant fires from beginHold completion, not click.
    if (isHoldVariant) return;
    onPress();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isHoldVariant && e.key === "Escape") cancelHold();
  };

  // Geometry.
  const containerStyle: CSSProperties = {
    height: iconOnly ? sz.height : sz.height,
    minWidth: iconOnly ? sz.height : 80,
    width: iconOnly ? sz.height : fullWidth ? "100%" : undefined,
    paddingLeft: iconOnly ? 0 : padX,
    paddingRight: iconOnly ? 0 : padX,
    backgroundColor: bgColor,
    color: colors.fg,
    borderRadius: primitives.radii.md,
    border: colors.border === "none" ? "none" : `1px solid ${colors.border}`,
    fontFamily: text.fontFamily,
    fontSize: text.fontSize,
    lineHeight: text.lineHeight,
    fontWeight: text.fontWeight,
    letterSpacing: `${text.letterSpacing}em`,
    transform: isPressed && !reducedMotion ? "scale(0.97)" : "scale(1)",
    transition: reducedMotion
      ? `background-color ${primitives.motion.duration.fast}ms ${primitives.motion.easing.standard}`
      : `background-color ${primitives.motion.duration.fast}ms ${primitives.motion.easing.standard}, transform ${primitives.motion.duration.fast}ms ${primitives.motion.easing.standard}`,
    opacity: disabled ? primitives.opacity.disabled : 1,
    cursor: disabled ? "not-allowed" : loading ? "wait" : "pointer",
    // Focus ring color is set via CSS var so :focus-visible can pick it up.
    ["--btn-focus-color" as never]: t.border.focus,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: semantics.spacing.inline.tight,
  };

  const LeadingIcon = loading ? Loader2 : iconLeading;
  const TrailingIcon = iconTrailing;
  const labelOpacity = loading ? primitives.opacity.disabled : 1;

  return (
    <button
      ref={ref}
      type="button"
      className="ffie-button"
      style={containerStyle}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      aria-label={iconOnly ? ariaLabel : undefined}
      aria-describedby={ariaDescribedBy}
      // Keep focusable when disabled per §7 — SR announces "dimmed".
      tabIndex={0}
    >
      {LeadingIcon ? (
        <LeadingIcon
          size={sz.iconSize}
          className={loading ? "ffie-spin" : undefined}
          aria-hidden="true"
        />
      ) : null}
      {!iconOnly ? (
        <span style={{ opacity: labelOpacity, transition: `opacity ${primitives.motion.duration.fast}ms` }}>
          {children}
        </span>
      ) : null}
      {TrailingIcon && !loading ? <TrailingIcon size={sz.iconSize} aria-hidden="true" /> : null}
      {isHoldVariant && holdProgress > 0 ? (
        <HoldArc
          progress={holdProgress}
          color={colors.fg}
          height={sz.height}
        />
      ) : null}
    </button>
  );
});

// ---------------------------------------------------------------------------
// HoldArc — radial-fill stroke that wraps the label during confirm="hold".
// ---------------------------------------------------------------------------

function HoldArc({
  progress,
  color,
  height,
}: {
  progress: number;
  color: string;
  height: number;
}) {
  const radius = (height - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
    >
      <rect
        x={1}
        y={1}
        width={98}
        height={height - 2}
        rx={primitives.radii.md - 1}
        ry={primitives.radii.md - 1}
        fill="none"
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={2}
        strokeDasharray={2 * (98 + (height - 2))}
        strokeDashoffset={2 * (98 + (height - 2)) * (1 - progress)}
        pathLength={1}
      />
    </svg>
  );
}

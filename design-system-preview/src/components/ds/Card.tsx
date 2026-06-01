"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

import { primitives, semantics, themes, type DensityMode, type ThemeName } from "@tokens";

// FFIE Card · v1.0
// =============================================================================
// Spec: project/design-system/components/Card.md
//
// Card is the composition primitive for any row-like or block-like surface:
// news feed item (member-facing P1), document library row (member-facing P2),
// back-office data row (Sylvie P5 density=compact), public landing block (P7
// density=spacious). The sub-components below describe regions, not layout —
// callers compose the regions in whatever order their semantic content needs.
//
// FFIE-specific contracts the Card owns:
//   - stale={true} dims content to opacity.stale (P2 — cached but old)
//   - density-aware padding (P5 — Sylvie's tables) without compressing
//     interactive primitives (Button, Input keep their own size contracts)
//   - hover lift (elevation.sm → elevation.md, 120ms motion.fast)
//   - sunlight theme: shadows drop to none; border carries elevation
//
// Token recipe (per Card.md §6).

export type CardVariant = "default" | "raised" | "outlined" | "flat";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  density?: DensityMode;
  stale?: boolean;
  /** Adds hover lift + cursor: pointer. Wrap in <a> or <button> for real interactivity. */
  interactive?: boolean;
  /** Overrides themeName from context (rare — use only for cross-theme cards). */
  themeName?: ThemeName;
};

function buildPadding(density: DensityMode): number {
  if (density === "compact") return semantics.spacing.inset.compact;
  if (density === "spacious") return semantics.spacing.inset.comfortable;
  return semantics.spacing.inset.default;
}

function buildElevation(variant: CardVariant, themeName: ThemeName): string {
  if (themeName === "sunlight") return "none"; // borders carry elevation
  if (variant === "raised") return primitives.elevation.md.web;
  if (variant === "flat") return "none";
  return primitives.elevation.sm.web;
}

function buildSurface(
  variant: CardVariant,
  theme: (typeof themes)[ThemeName]
): string {
  if (variant === "raised") return theme.surface.raised;
  if (variant === "flat") return theme.surface.subtle;
  return theme.surface.default;
}

function buildBorder(
  variant: CardVariant,
  theme: (typeof themes)[ThemeName]
): string {
  if (variant === "outlined") return theme.border.strong;
  return theme.border.default;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "default",
    density = "comfortable",
    stale = false,
    interactive = false,
    themeName: explicitTheme,
    className,
    style,
    children,
    ...rest
  },
  ref
) {
  // We support either an explicit themeName (rare — cross-theme demos) or
  // inherit via CSS variables from `<html data-theme>`. The default below
  // uses the light tokens but the rendered colors come from the CSS bridge.
  const themeName = explicitTheme ?? "light";
  const t = themes[themeName];
  const padding = buildPadding(density);

  const baseStyle: CSSProperties = {
    background: explicitTheme ? buildSurface(variant, t) : undefined,
    border: `1px solid ${explicitTheme ? buildBorder(variant, t) : "hsl(var(--border))"}`,
    borderRadius: primitives.radii.lg,
    padding,
    boxShadow: explicitTheme
      ? buildElevation(variant, themeName)
      : variant === "flat"
        ? "none"
        : variant === "raised"
          ? primitives.elevation.md.web
          : primitives.elevation.sm.web,
    color: explicitTheme ? t.text.body : undefined,
    transition:
      "box-shadow 120ms cubic-bezier(0.4,0,0.2,1), border-color 120ms",
    cursor: interactive ? "pointer" : undefined,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={baseStyle}
      data-interactive={interactive || undefined}
      data-stale={stale || undefined}
      {...rest}
    >
      <div
        style={{
          opacity: stale ? primitives.opacity.stale : 1,
          transition: "opacity 200ms",
        }}
      >
        {children}
      </div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// Sub-components — semantic regions. Composition rules in Card.md §4.

export function CardHeader({
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: semantics.spacing.stack.tight,
        ...style,
      }}
      {...rest}
    />
  );
}

export function CardEyebrow({
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const eyebrow = primitives.textStyles.eyebrow;
  return (
    <div
      style={{
        fontFamily: "var(--font-brand)",
        fontSize: eyebrow.fontSize,
        fontWeight: eyebrow.fontWeight,
        lineHeight: eyebrow.lineHeight,
        letterSpacing: `${eyebrow.letterSpacing}em`,
        textTransform: eyebrow.textTransform,
        color: "hsl(var(--muted-foreground))",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  const h3 = primitives.textStyles["heading.h3"];
  return (
    <h3
      style={{
        margin: 0,
        fontFamily: "var(--font-display)",
        fontSize: h3.fontSize,
        fontWeight: h3.fontWeight,
        lineHeight: h3.lineHeight,
        letterSpacing: `${h3.letterSpacing}em`,
        color: "hsl(var(--foreground))",
        ...style,
      }}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  const body = primitives.textStyles["body.md"];
  return (
    <p
      style={{
        margin: 0,
        fontFamily: "var(--font-brand)",
        fontSize: body.fontSize,
        fontWeight: body.fontWeight,
        lineHeight: body.lineHeight,
        color: "hsl(var(--muted-foreground))",
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
}

export function CardMeta({
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const caption = primitives.textStyles.caption;
  return (
    <div
      style={{
        fontFamily: "var(--font-brand)",
        fontSize: caption.fontSize,
        fontWeight: caption.fontWeight,
        lineHeight: caption.lineHeight,
        color: "hsl(var(--muted-foreground))",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        marginTop: semantics.spacing.stack.default,
        color: "hsl(var(--foreground))",
        ...style,
      }}
      {...rest}
    />
  );
}

export function CardFooter({
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        marginTop: semantics.spacing.stack.default,
        display: "flex",
        alignItems: "center",
        gap: semantics.spacing.inline.default,
        flexWrap: "wrap",
        ...style,
      }}
      {...rest}
    />
  );
}

export function CardActions({
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: semantics.spacing.inline.snug,
        marginLeft: "auto",
        ...style,
      }}
      {...rest}
    />
  );
}

export function CardMedia({
  children,
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div
      className={className}
      style={{
        marginBottom: semantics.spacing.stack.default,
        borderRadius: primitives.radii.md,
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// Row layout — a horizontal Card that puts CardMedia + CardHeader on one line.
// Used for the document library row and the back-office compact table row.
export function CardRow({
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: semantics.spacing.inline.default,
        ...style,
      }}
      {...rest}
    />
  );
}

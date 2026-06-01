"use client";

import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff, Search, X } from "lucide-react";
import { semantics, primitives, type DensityMode } from "@tokens";
import { useTheme } from "@/lib/theme-context";

// FFIE Input · v1.0
// =============================================================================
// Spec: project/design-system/components/Input.md
//
// Token consumption recipe:
//   - background       → theme.surface.default
//   - border (idle)    → theme.border.strong          (3:1+ against surface)
//   - border (focus)   → theme.border.focus           (brand-aligned ring)
//   - border (error)   → theme.feedback.danger
//   - text             → theme.text.body
//   - placeholder      → theme.text.placeholder
//   - label / helper   → theme.text.muted
//   - error message    → theme.feedback.danger
//   - vertical inset   → custom per density (see HEIGHTS below)
//   - horizontal inset → inset.default (16) — inset.compact (8) in compact
//   - icon→text gap    → inline.snug (8)
//   - label→field gap  → stack.tight (4)
//   - field→helper gap → stack.tight (4)
//
// Height contract — total height is fixed so two adjacent inputs always
// align. Padding flexes to fill the difference.
//   comfortable  → 48pt  (matches sizes.touchTarget.primary, P1 default)
//   compact      → 40pt  (back-office only — mouse/keyboard primary)
//   spacious     → 56pt  (matches sizes.touchTarget.comfortable, hero CTAs)
//
// Accessibility:
//   - Label rendered as a real <label> element; never relies on placeholder.
//   - Required state communicated by aria-required AND a visible "*" marker.
//   - Error sets aria-invalid + aria-describedby pointing at the error node.
//   - Focus ring is 2pt solid with 2pt offset; meets WCAG 1.4.11 (3:1).
//   - allowFontScaling: web inputs scale with OS; on RN the corresponding
//     component MUST NOT pass allowFontScaling={false}. See Input.md §A11y.

export type InputDensity = DensityMode;
export type InputVariant = "text" | "search" | "password" | "email";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  density?: InputDensity;
  variant?: InputVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onClear?: () => void;
};

const HEIGHTS: Record<InputDensity, number> = {
  comfortable: 48,
  compact: 40,
  spacious: 56,
};

const FONT_SIZE_BY_DENSITY: Record<InputDensity, number> = {
  comfortable: primitives.fontSizes.base, // 16
  compact: primitives.fontSizes.sm, // 14
  spacious: primitives.fontSizes.lg, // 20
};

// Icon size pegged to primitives.sizes.icon — 18 for inputs (between sm/md).

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    required,
    density = "comfortable",
    variant = "text",
    leadingIcon,
    trailingIcon,
    onClear,
    id,
    disabled,
    value,
    onChange,
    placeholder,
    className,
    style,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();
  const reactId = useId();
  const inputId = id ?? `ffie-input-${reactId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = Boolean(error);
  const hasValue = value !== undefined && value !== "" && value !== null;

  // Pick the effective HTML input type.
  const htmlType = useMemo(() => {
    if (variant === "password") return showPassword ? "text" : "password";
    if (variant === "email") return "email";
    if (variant === "search") return "search";
    return "text";
  }, [variant, showPassword]);

  // Default leading icon for the search variant.
  const resolvedLeading =
    leadingIcon ??
    (variant === "search" ? (
      <Search size={18} color={theme.text.muted} aria-hidden="true" />
    ) : null);

  // Default trailing for password (eye toggle) and search (clear button).
  const resolvedTrailing =
    trailingIcon ??
    (variant === "password" ? (
      <button
        type="button"
        onClick={() => setShowPassword((s) => !s)}
        className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ color: theme.text.muted, display: "flex" }}
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
      >
        {showPassword ? (
          <Eye size={18} aria-hidden="true" />
        ) : (
          <EyeOff size={18} aria-hidden="true" />
        )}
      </button>
    ) : variant === "search" && hasValue && onClear ? (
      <button
        type="button"
        onClick={onClear}
        className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ color: theme.text.muted, display: "flex" }}
        aria-label="Clear search"
      >
        <X size={16} aria-hidden="true" />
      </button>
    ) : null);

  const height = HEIGHTS[density];
  const fontSize = FONT_SIZE_BY_DENSITY[density];
  const horizontalInset =
    density === "compact"
      ? semantics.spacing.inset.compact
      : semantics.spacing.inset.default;
  const iconGap = semantics.spacing.inline.snug;
  const labelGap = semantics.spacing.stack.tight;

  const borderColor = hasError
    ? theme.feedback.danger
    : focused
      ? theme.border.focus
      : theme.border.strong;

  const ringColor = hasError ? theme.feedback.danger : theme.border.focus;

  const fieldStyle: CSSProperties = {
    height,
    borderRadius: primitives.radii.md,
    background: disabled ? theme.surface.subtle : theme.surface.default,
    border: `1px solid ${borderColor}`,
    paddingInline: horizontalInset,
    color: theme.text.body,
    fontSize,
    fontFamily: "var(--font-brand)",
    boxShadow: focused
      ? `0 0 0 2px ${theme.surface.default}, 0 0 0 4px ${ringColor}`
      : "none",
    opacity: disabled ? primitives.opacity.disabled : 1,
    transition: "border-color 120ms, box-shadow 120ms",
    display: "flex",
    alignItems: "center",
    gap: iconGap,
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    background: "transparent",
    border: 0,
    outline: "none",
    color: "inherit",
    fontSize: "inherit",
    fontFamily: "inherit",
    padding: 0,
    margin: 0,
  };

  return (
    <div className={className} style={style}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: "block",
            marginBottom: labelGap,
            color: theme.text.muted,
            fontSize: primitives.fontSizes.sm,
            fontWeight: primitives.fontWeights.medium,
            fontFamily: "var(--font-brand)",
          }}
        >
          {label}
          {required && (
            <span
              style={{ color: theme.feedback.danger, marginLeft: 4 }}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}
      <div style={fieldStyle}>
        {resolvedLeading && <span style={{ display: "flex" }}>{resolvedLeading}</span>}
        <input
          ref={ref}
          id={inputId}
          type={htmlType}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={inputStyle}
          {...rest}
        />
        {resolvedTrailing && <span style={{ display: "flex" }}>{resolvedTrailing}</span>}
      </div>
      {hasError ? (
        <div
          id={errorId}
          role="alert"
          style={{
            marginTop: labelGap,
            color: theme.feedback.danger,
            fontSize: primitives.fontSizes.sm,
            fontFamily: "var(--font-brand)",
          }}
        >
          {error}
        </div>
      ) : helperText ? (
        <div
          id={helperId}
          style={{
            marginTop: labelGap,
            color: theme.text.muted,
            fontSize: primitives.fontSizes.sm,
            fontFamily: "var(--font-brand)",
          }}
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
});

"use client";

import { X } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import type { CSSProperties } from "react";

import { primitives, themes, type ThemeName } from "@tokens";
import { StatusPill, type StatusName } from "@/components/ui/StatusPill";

// ---------------------------------------------------------------------------
// Types — mirrors project/design-system/components/Toast.md §4.
// ---------------------------------------------------------------------------

export type ToastId = string | number;

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  description?: string;
  action?: ToastAction;
  duration?: number;
  id?: ToastId;
  themeName?: ThemeName;
};

export type UndoOptions = {
  onUndo: () => void;
  undoLabel?: string;
  description?: string;
  duration?: number;
  name?: "info" | "success";
  themeName?: ThemeName;
};

// ---------------------------------------------------------------------------
// Default duration per status — Toast.md §3.
// danger + syncing stay open until manually dismissed (Infinity).
// ---------------------------------------------------------------------------

const DEFAULT_DURATION: Record<StatusName, number> = {
  success: 4000,
  warning: 6000,
  danger: Number.POSITIVE_INFINITY,
  info: 4000,
  offline: 6000,
  syncing: Number.POSITIVE_INFINITY,
  stale: 4000,
  fresh: 3000,
};

// danger uses role=alert + aria-live=assertive. Everything else: role=status + polite.
function isAssertive(name: StatusName): boolean {
  return name === "danger";
}

// ---------------------------------------------------------------------------
// ToastRow — the custom-rendered toast surface.
// ---------------------------------------------------------------------------

type RowProps = {
  toastId: ToastId;
  name: StatusName;
  title: string;
  description?: string;
  action?: ToastAction;
  themeName: ThemeName;
};

function ToastRow({ toastId, name, title, description, action, themeName }: RowProps) {
  const t = themes[themeName];
  const text = primitives.textStyles["label.md"];
  const descText = primitives.textStyles["body.sm"] ?? primitives.textStyles["label.sm"];
  const assertive = isAssertive(name);

  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    columnGap: primitives.space[2], // inline.snug = 8
    padding: primitives.space[3], // 12 — inset.compact; tightened from 16 to honor 360px min width
    minWidth: 280,
    maxWidth: 440,
    width: "100%",
    backgroundColor: t.surface.raised,
    color: t.text.body,
    border: `1px solid ${t.border.subtle}`,
    borderRadius: primitives.radii.lg,
    boxShadow: primitives.elevation.lg.web,
    fontFamily: text.fontFamily,
  };

  const titleStyle: CSSProperties = {
    fontSize: text.fontSize,
    lineHeight: text.lineHeight,
    fontWeight: text.fontWeight,
    letterSpacing: `${text.letterSpacing}em`,
    color: t.text.body,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const descStyle: CSSProperties = {
    marginTop: primitives.space[1], // 4
    fontSize: descText.fontSize,
    lineHeight: descText.lineHeight,
    fontWeight: descText.fontWeight,
    letterSpacing: `${descText.letterSpacing}em`,
    color: t.text.muted,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const actionBtnStyle: CSSProperties = {
    flexShrink: 0,
    height: 32,
    minWidth: 44,
    paddingInline: primitives.space[2],
    borderRadius: primitives.radii.md,
    border: "none",
    background: "transparent",
    color: t.action.primary.bg,
    fontFamily: text.fontFamily,
    fontSize: primitives.textStyles["label.sm"].fontSize,
    fontWeight: 600,
    letterSpacing: `${primitives.textStyles["label.sm"].letterSpacing}em`,
    cursor: "pointer",
    ["--btn-focus-color" as never]: t.border.focus,
  };

  const dismissBtnStyle: CSSProperties = {
    flexShrink: 0,
    height: 32,
    width: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: primitives.radii.md,
    border: "none",
    background: "transparent",
    color: t.text.muted,
    cursor: "pointer",
    padding: 0,
    ["--btn-focus-color" as never]: t.border.focus,
  };

  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      style={containerStyle}
      title={title}
    >
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <StatusPill name={name} variant="filled" size="md" themeName={themeName} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={titleStyle}>{title}</p>
        {description ? <p style={descStyle}>{description}</p> : null}
      </div>
      {action ? (
        <button
          type="button"
          className="ffie-button"
          style={actionBtnStyle}
          onClick={() => {
            action.onClick();
            sonnerToast.dismiss(toastId);
          }}
        >
          {action.label}
        </button>
      ) : null}
      <button
        type="button"
        className="ffie-button"
        style={dismissBtnStyle}
        aria-label="Dismiss"
        onClick={() => sonnerToast.dismiss(toastId)}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Render dispatcher
// ---------------------------------------------------------------------------

type ShowArgs = {
  name: StatusName;
  message: string;
  options?: ToastOptions;
};

function show({ name, message, options }: ShowArgs): ToastId {
  const themeName = options?.themeName ?? getActiveThemeName();
  const duration = options?.duration ?? DEFAULT_DURATION[name];

  return sonnerToast.custom(
    (id) => (
      <ToastRow
        toastId={id}
        name={name}
        title={message}
        description={options?.description}
        action={options?.action}
        themeName={themeName}
      />
    ),
    {
      duration,
      id: options?.id,
    },
  );
}

// Theme lookup for non-React callers (`toast.success(...)` from event handlers).
// Reads the document attribute set by ThemeProvider; falls back to "light".
function getActiveThemeName(): ThemeName {
  if (typeof document === "undefined") return "light";
  const v = document.documentElement.getAttribute("data-theme");
  if (v === "dark" || v === "sunlight") return v;
  return "light";
}

// ---------------------------------------------------------------------------
// Public API — Toast.md §4.
// ---------------------------------------------------------------------------

export const toast = {
  success: (message: string, options?: ToastOptions) => show({ name: "success", message, options }),
  warning: (message: string, options?: ToastOptions) => show({ name: "warning", message, options }),
  danger:  (message: string, options?: ToastOptions) => show({ name: "danger",  message, options }),
  info:    (message: string, options?: ToastOptions) => show({ name: "info",    message, options }),
  offline: (message: string, options?: ToastOptions) => show({ name: "offline", message, options }),
  syncing: (message: string, options?: ToastOptions) => show({ name: "syncing", message, options }),
  stale:   (message: string, options?: ToastOptions) => show({ name: "stale",   message, options }),
  fresh:   (message: string, options?: ToastOptions) => show({ name: "fresh",   message, options }),

  // P5 — the parent half of Button confirm="undo". Default 60s window.
  undo: (message: string, options: UndoOptions): ToastId =>
    show({
      name: options.name ?? "info",
      message,
      options: {
        description: options.description,
        duration: options.duration ?? primitives.motion.duration.undo,
        themeName: options.themeName,
        action: {
          label: options.undoLabel ?? "Annuler",
          onClick: options.onUndo,
        },
      },
    }),

  dismiss: (id?: ToastId) => sonnerToast.dismiss(id),
} as const;

export type { StatusName } from "@/components/ui/StatusPill";

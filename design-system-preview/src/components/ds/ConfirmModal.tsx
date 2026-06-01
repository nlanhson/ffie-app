"use client";

import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ds/Modal";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/theme-context";

// FFIE ConfirmModal · v1.0
// =============================================================================
// Spec: project/design-system/components/Modal.md §3
//
// The Modal IS the confirmation step. P5 — forgive the editor — is honored
// by closing the modal immediately on confirm and letting the parent fire
// the 60s undo toast (sonner) with the optimistic-applied change and an
// "Undo" action. The destructive Button inside this modal uses `confirm="undo"`
// which fires onPress immediately (no inline hold delay) — the modal already
// provided the explicit confirm step.
//
// For an EXTRA-cautious destructive surface (irreversible action — e.g.
// permanent account deletion), the parent can opt into hold-to-confirm by
// using the composable Modal primitives directly with `<Button confirm="hold">`.
// That is reserved for cases where undo is not technically possible.

export type ConfirmVariant = "info" | "confirm" | "destructive";

const VARIANT_ICON = {
  info: Info,
  confirm: CheckCircle2,
  destructive: AlertTriangle,
} as const;

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ConfirmVariant;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  /** Extra content (e.g. a list of affected items) between description + footer. */
  children?: ReactNode;
  /** Block close-via-outside-click and Esc. Reserved for blocking errors only. */
  modal?: boolean;
};

export function ConfirmModal({
  open,
  onOpenChange,
  variant = "confirm",
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
  modal = false,
}: ConfirmModalProps) {
  const t = useTranslations("Modal");
  const { themeName, theme } = useTheme();
  const Icon = VARIANT_ICON[variant];

  // Color of the variant icon — matches the action color it implies.
  const iconColor =
    variant === "destructive"
      ? theme.feedback.danger
      : variant === "info"
        ? theme.feedback.info
        : theme.feedback.success;

  function handleConfirm() {
    onConfirm();
    onOpenChange(false);
  }

  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        // For blocking modals (rare), suppress Radix's outside-click + Esc.
        onPointerDownOutside={(e) => {
          if (modal) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (modal) e.preventDefault();
        }}
      >
        <ModalHeader>
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `${iconColor}1F`, // ~12% alpha tint
                color: iconColor,
              }}
              aria-hidden="true"
            >
              <Icon size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <ModalTitle>{title}</ModalTitle>
              {description && (
                <ModalDescription>{description}</ModalDescription>
              )}
            </div>
          </div>
        </ModalHeader>

        {children && <div className="text-sm text-foreground">{children}</div>}

        <ModalFooter>
          <Button
            variant="ghost"
            size="md"
            themeName={themeName}
            onPress={handleCancel}
          >
            {cancelLabel ?? t("cancel")}
          </Button>
          {variant === "destructive" ? (
            <Button
              variant="destructive"
              size="md"
              themeName={themeName}
              confirm="undo"
              iconLeading={<AlertTriangle size={16} />}
              onPress={handleConfirm}
            >
              {confirmLabel ?? t("delete")}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              themeName={themeName}
              onPress={handleConfirm}
            >
              {confirmLabel ??
                (variant === "info" ? t("acknowledge") : t("confirm"))}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

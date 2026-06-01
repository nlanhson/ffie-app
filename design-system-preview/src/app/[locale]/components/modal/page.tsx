"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ds/ConfirmModal";
import { useTheme } from "@/lib/theme-context";
import type { ThemeName } from "@tokens";

const themeOrder: ThemeName[] = ["light", "dark", "sunlight"];

export default function ModalPreviewPage() {
  const t = useTranslations("ModalPreview");
  const tCommon = useTranslations("Modal");
  const { themeName, setThemeName, theme } = useTheme();

  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);

  // Optimistic doc state — for the destructive flow demo.
  const [docDeleted, setDocDeleted] = useState(false);

  function handleDestructiveConfirm() {
    // 1. Apply the change optimistically.
    setDocDeleted(true);
    // 2. Fire the 60s undo toast (sonner).
    toast(t("destructive.undoToast"), {
      duration: 60_000,
      action: {
        label: t("destructive.undoAction"),
        onClick: () => {
          setDocDeleted(false);
          toast.success(t("destructive.undoConfirmed"));
        },
      },
    });
  }

  function handleConfirm() {
    toast.success(t("confirm.confirmed"));
  }

  return (
    <div style={{ color: theme.text.body }}>
      <PageHeader
        eyebrow="Component · v1.0"
        title="Modal"
        lede="The Modal is the confirmation step. For destructive actions, clicking Delete closes the modal immediately and fires a 60-second undo toast (sonner). For non-destructive confirms, Cancel preserves the editor's draft. Built on Radix Dialog via the shadcn bridge — focus trap, Esc-to-close, and inert background scroll are handled by the primitive layer."
      >
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Theme
          </div>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {themeOrder.map((name) => {
              const active = name === themeName;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setThemeName(name)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </PageHeader>

      <div
        className="rounded-2xl p-8 space-y-6 border"
        style={{
          background: theme.surface.default,
          borderColor: theme.border.default,
        }}
      >
        <Variant
          eyebrow={t("info.title")}
          description={t("info.description")}
        >
          <Button
            variant="secondary"
            themeName={themeName}
            onPress={() => setInfoOpen(true)}
          >
            {t("info.trigger")}
          </Button>
        </Variant>

        <Variant
          eyebrow={t("confirm.title")}
          description={t("confirm.description")}
        >
          <Button
            variant="primary"
            themeName={themeName}
            onPress={() => setConfirmOpen(true)}
          >
            {t("confirm.trigger")}
          </Button>
        </Variant>

        <Variant
          eyebrow={t("destructive.title")}
          description={t("destructive.description")}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              themeName={themeName}
              onPress={() => {
                setDocDeleted(false);
                setDestructiveOpen(true);
              }}
            >
              {t("destructive.trigger")}
            </Button>
            <div
              className="rounded border px-3 py-1.5 text-xs font-mono"
              style={{
                borderColor: theme.border.subtle,
                background: theme.surface.subtle,
                color: theme.text.muted,
                opacity: docDeleted ? 0.6 : 1,
                textDecoration: docDeleted ? "line-through" : "none",
              }}
            >
              NF C 15-100 §7.2 — Cable management
            </div>
          </div>
        </Variant>
      </div>

      <SectionHeading title="P5 contract — what this component is committing to" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          {
            label: "The modal IS the confirmation",
            body:
              "We don't compound a modal with a hold-arc inside it — that would be a third step. For irreversible actions (no undo possible), the composable primitives + Button confirm='hold' inside are still available.",
          },
          {
            label: "Optimistic apply + 60s undo toast",
            body:
              "On confirm, the modal closes immediately. The parent calls its action and fires a sonner toast with duration: motion.duration.undo (60000ms) and an Undo action button.",
          },
          {
            label: "Initial focus on Cancel",
            body:
              "Radix Dialog auto-focuses the first focusable element — Cancel comes before the destructive action in DOM order so an accidental Enter doesn't fire the dangerous path.",
          },
          {
            label: "Esc cancels",
            body:
              "Default Radix behavior. Inside a destructive modal, Esc dismisses without firing — the same as clicking Cancel. The hold-confirm contract for Esc lives in Button, not here.",
          },
          {
            label: "Theme-aware in portals",
            body:
              "Radix renders to a portal at the body root. Our globals.css sets shadcn CSS variables under [data-theme] on <html>, so the portal inherits the active theme automatically — dialog, overlay, and the toast.",
          },
          {
            label: "i18n-aware",
            body:
              "All labels come from messages/{fr,en}.json. The Modal component uses the Modal namespace; per-usage strings (title, description, action labels) come from the page's namespace.",
          },
        ].map((card) => (
          <li
            key={card.label}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="text-sm font-semibold text-gray-900">
              {card.label}
            </div>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {card.body}
            </p>
          </li>
        ))}
      </ul>

      <SectionHeading title="Composable primitives" />
      <pre
        className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs"
        style={{ fontFamily: "var(--font-mono)" }}
      >{`import {
  Modal, ModalTrigger, ModalContent,
  ModalHeader, ModalTitle, ModalDescription,
  ModalFooter, ModalClose,
} from "@/components/ds/Modal";

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>...</ModalTitle>
      <ModalDescription>...</ModalDescription>
    </ModalHeader>
    {/* Custom body */}
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="ghost" themeName={themeName}>${tCommon("cancel")}</Button>
      </ModalClose>
      <Button variant="primary" themeName={themeName} onPress={onConfirm}>
        ${tCommon("confirm")}
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>`}</pre>

      {/* Modals — rendered last so the portal stacks above content */}
      <ConfirmModal
        open={infoOpen}
        onOpenChange={setInfoOpen}
        variant="info"
        title={t("info.modalTitle")}
        description={t("info.modalDescription")}
        onConfirm={() => {}}
      />
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="confirm"
        title={t("confirm.modalTitle")}
        description={t("confirm.modalDescription")}
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        open={destructiveOpen}
        onOpenChange={setDestructiveOpen}
        variant="destructive"
        title={t("destructive.modalTitle")}
        description={t("destructive.modalDescription")}
        onConfirm={handleDestructiveConfirm}
      />
    </div>
  );
}

function Variant({
  eyebrow,
  description,
  children,
}: {
  eyebrow: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-mono">
        {eyebrow}
      </div>
      <p className="text-sm text-gray-600 mb-3 max-w-2xl">{description}</p>
      {children}
    </div>
  );
}

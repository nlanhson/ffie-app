"use client";

// FFIE Modal · v1.0
// =============================================================================
// Spec: project/design-system/components/Modal.md
//
// Modal is the FFIE-aliased re-export of the shadcn Dialog primitives
// (which sit on top of @radix-ui/react-dialog). The primitive layer adds no
// behavior of its own — the FFIE value lives in ConfirmModal alongside this
// file, which encodes the P5 forgive-the-editor contract (modal IS the
// confirmation step; parent fires optimistic action + 60s undo toast).
//
// Use the primitives below when you need a non-confirm Modal (info,
// onboarding splash, multi-step wizard surface). For destructive or
// single-question confirm flows, prefer ConfirmModal.

export {
  Dialog as Modal,
  DialogTrigger as ModalTrigger,
  DialogPortal as ModalPortal,
  DialogOverlay as ModalOverlay,
  DialogClose as ModalClose,
  DialogContent as ModalContent,
  DialogHeader as ModalHeader,
  DialogFooter as ModalFooter,
  DialogTitle as ModalTitle,
  DialogDescription as ModalDescription,
} from "@/components/ui/dialog";

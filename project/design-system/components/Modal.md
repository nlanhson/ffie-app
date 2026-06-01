# Modal

**Version:** 1.0 (matches `tokens.ts` v0.6)
**Status:** Spec — reference implementations in [`design-system-preview/src/components/ds/Modal.tsx`](../../../design-system-preview/src/components/ds/Modal.tsx) and [`ConfirmModal.tsx`](../../../design-system-preview/src/components/ds/ConfirmModal.tsx)
**Skill of record:** `design-systems--component-spec`
**Live preview:** [`/components/modal`](http://localhost:3001/components/modal)

---

## 1. Purpose

Modal is the FFIE confirmation surface — the component that encodes **P5 (forgive the editor) end-to-end**. It is the place where Sylvie pauses before publishing news, removing documents, or pushing notifications to 7,300 members. The single rule that drives every choice below: **the modal IS the confirmation step**. We never compound a modal with a second confirm gesture inside it (a hold-arc on the Delete button, a typed confirmation, a second pop-up). One question, one decision, then an undoable apply.

Built on Radix UI Dialog primitives via the [shadcn bridge](../SHADCN_INTEGRATION.md). The primitive layer handles focus trap, Esc-to-close, `aria-modal`, inert background scroll, and portal rendering. FFIE adds the confirm contract on top.

## 2. Layers

The component ships in two layers — use the right one for the job.

| Layer | File | Use when |
|---|---|---|
| **Primitives** — `Modal`, `ModalContent`, `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalFooter`, `ModalClose`, `ModalTrigger`, `ModalPortal`, `ModalOverlay` | [`src/components/ds/Modal.tsx`](../../../design-system-preview/src/components/ds/Modal.tsx) (re-exports the shadcn Dialog) | Custom body content (a form, an embedded image, a multi-step wizard surface), or when you need to compose pieces yourself. |
| **ConfirmModal** | [`src/components/ds/ConfirmModal.tsx`](../../../design-system-preview/src/components/ds/ConfirmModal.tsx) | The 80% case — single-question confirmation with title, description, Cancel, Confirm. |

## 3. ConfirmModal variants

Three semantic variants, picked by `variant` prop. Each carries a matching icon (lucide-react) and feedback color from the active theme.

| Variant | Icon | Feedback color | Button variant | Use case |
|---|---|---|---|---|
| `info` | `Info` | `theme.feedback.info` | primary (label defaults to "Got it") | One-way announcement. No destructive path. e.g. scheduled maintenance, system notice. |
| `confirm` | `CheckCircle2` | `theme.feedback.success` | primary (label defaults to "Confirm") | Non-destructive but consequential. Publish, send, validate. Cancel returns to draft. |
| `destructive` | `AlertTriangle` | `theme.feedback.danger` | **destructive + `confirm="undo"`** | Reversible-within-60s removal. Modal closes immediately on Delete; parent fires the undo toast. |

### Why no `destructive + hold` mode in ConfirmModal

ConfirmModal's destructive variant uses `confirm="undo"` on the Button. Adding a hold-arc inside a modal that itself is the confirm step is a third gesture — excessive. For truly irreversible actions (no undo possible — e.g. account deletion, password reset), use the composable primitives with `<Button variant="destructive" confirm="hold">` inside the footer. Document the irreversibility in the description.

## 4. The P5 destructive flow

```
1. User invokes destructive action
   → parent opens <ConfirmModal variant="destructive" open={...} />

2. User clicks Delete
   → Button (confirm="undo") fires onPress immediately
   → ConfirmModal calls onConfirm()
   → ConfirmModal calls onOpenChange(false) → modal closes

3. Parent (in onConfirm):
   a. Apply the change optimistically (setDocDeleted(true), splice the list, ...)
   b. Fire a sonner toast with:
      - duration: motion.duration.undo (60_000ms)
      - action: { label: "Undo", onClick: revert + toast.success }

4. If the user clicks Undo:
   → parent reverts the change
   → parent fires a confirmation toast ("Deletion undone.")
   → no server call has happened (the optimistic apply hasn't been persisted
     server-side until the toast expires)

5. If the toast auto-dismisses at 60s:
   → parent persists the change server-side (this is the actual deletion)
```

**Server-side write does not happen on confirm.** It happens at toast dismiss (or first interaction with the document on the next screen, whichever the parent flow dictates). The 60s window is for *real* undo, not optimistic UI with rollback.

## 5. Anatomy

```
  ┌────────────────────────────────────────────┐
  │  ╳                                         │  ← close button (Radix DialogClose)
  │                                            │
  │  ┌──┐                                      │
  │  │⚠│  Delete this document?                │  ← icon (38px tinted circle) + Title
  │  └──┘  "NF C 15-100 §7.2…" will be         │     + Description
  │        removed from the federation library │
  │                                            │
  │  [optional children — list, form, …]       │
  │                                            │
  │                  [Cancel] [⚠ Delete]       │  ← Footer — buttons right-aligned on
  │                                            │     desktop, column-reverse on mobile
  └────────────────────────────────────────────┘
        ↑           ↑              ↑
    inset.        Cancel is        Destructive Button
    comfortable   first in DOM     uses confirm="undo"
    (24pt P5)     so Enter cancels
```

## 6. Token recipe

| Slot | Token |
|---|---|
| overlay | `theme.text.body / opacity.overlay (0.6)` → `bg-foreground/60` with `backdrop-blur-[1px]` |
| dialog background | `theme.surface.default` → `bg-background` |
| dialog border | `theme.border.default` → `border-border` |
| dialog padding | `inset.comfortable` (24pt — P5 spacing contract) → `p-6` |
| dialog corner radius | `radii.lg` (12pt) → `sm:rounded-lg` |
| dialog max width | `max-w-lg` (32rem) — caps on desktop; full-bleed under `sm` |
| title | `textStyles.heading.h2` — Montserrat 24/1.2 semibold tight |
| description | `text-sm leading-normal` on `theme.text.muted` (`text-muted-foreground`) |
| icon size | 20pt (between `sizes.icon.md` and `lg`), 36pt tinted circle around it |
| icon tint background | `theme.feedback.{info|success|danger}` at ~12% alpha |
| close button (x) | top-right, focus ring `theme.border.focus` |
| footer gap | `gap.default` (12pt) → `gap-3` |
| footer direction | column-reverse on mobile (destructive closer to thumb), row on `sm+` |
| enter motion | `motion.duration.slow` (320ms), `easing.decelerate` |
| exit motion | `motion.duration.slow`, `easing.accelerate` |
| reduced motion | `motion-reduce:animate-none` on overlay + content |

## 7. Accessibility

- **`role="dialog"` + `aria-modal="true"`** — Radix sets these automatically.
- **Focus trap** — Radix Dialog traps Tab focus inside the modal while open.
- **Initial focus on Cancel** — Cancel is the first focusable element in the footer DOM order. Pressing Enter when the modal opens dismisses the safe path, never the destructive one.
- **`aria-labelledby`** — Radix links `aria-labelledby` to the `ModalTitle` automatically.
- **`aria-describedby`** — links to the `ModalDescription` if present.
- **Esc-to-close** — default Radix behavior. For blocking modals (rare — only when a decision must be made before any other UI interaction), pass `modal={true}` to ConfirmModal which suppresses outside-click and Esc.
- **Background scroll lock** — Radix sets `overflow: hidden` on `<body>` while open.
- **Background inert** — Radix uses the [inert attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert) on the rest of the tree so screen-reader users can't tab out of the modal accidentally.
- **Reduced motion** — `motion-reduce:animate-none` neutralizes the enter/exit transitions. The dialog still appears; the slide+fade is skipped.

## 8. Theme behavior

Because the Modal renders into a portal at the document body, it inherits theme tokens through the **`<html data-theme="…">`** attribute set by ThemeProvider — not through the React tree. All Tailwind utilities used (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`) resolve to the active theme's HSL values automatically. The Button inside still takes an explicit `themeName` prop because Button consumes tokens via inline styles (not CSS variables) — ConfirmModal reads `useTheme()` and passes `themeName` to its inner Buttons.

### Sunlight notes

In sunlight, the dialog renders with `border: black` and effectively no shadow (the `shadow-lg` class still emits but the box reads as an outlined card). Acceptable for v1.0; if field-testing on Julien's phone shows the shadow muddies the outline, suppress it under `data-theme="sunlight"` in a future iteration.

## 9. i18n

ConfirmModal labels come from the `Modal` namespace in `messages/{fr,en}.json`:

| Key | French | English |
|---|---|---|
| `cancel` | Annuler | Cancel |
| `confirm` | Confirmer | Confirm |
| `delete` | Supprimer | Delete |
| `acknowledge` | J'ai compris | Got it |

Per-usage strings (title, description, `confirmLabel`, `cancelLabel`) are passed in as props from the caller's namespace — e.g. the preview page reads `ModalPreview.destructive.modalTitle`.

The destructive flow's undo toast is also bilingual. Both French and English use `motion.duration.undo` (60s) — locale doesn't change the contract.

## 10. Do · Don't

| Do | Don't |
|---|---|
| Use `ConfirmModal variant="destructive"` for any reversible-within-60s removal. | Wrap an `<input type="confirm-text" value="DELETE">` inside a modal as a second-layer gate. The modal IS the gate. |
| Let the parent own the optimistic apply + the toast. | Persist the change to the server inside `onConfirm`. Defer to the toast dismiss. |
| Use the composable primitives for multi-step wizards or custom bodies. | Use ConfirmModal to render a form. Forms get their own surface. |
| Show one ConfirmModal at a time. | Stack modals. If a confirm leads to another decision, close the first, then open the second. |
| Use `modal={true}` only for blocking errors. | Use `modal={true}` to "encourage" attention. Esc + outside-click are standard escape hatches. |
| Localize titles + descriptions through `messages/{fr,en}.json`. | Hardcode strings. |

## 11. React Native parity notes

When the RN sibling lands (Stage 3):

- Use `@gorhom/react-native-bottom-sheet` or `react-native-reanimated`'s `Modal` rather than Radix (Radix is web-only).
- Honor the same token recipe — `theme.surface.default`, `inset.comfortable`, `motion.duration.slow`.
- The destructive flow needs an equivalent of sonner — `react-native-toast-message` or a custom toast that supports actions + 60s duration is the pick.
- Background scroll lock + focus trap are built into the native Modal primitive on iOS/Android.
- `accessibilityViewIsModal` (iOS) / `accessibilityLiveRegion` (Android) cover what `aria-modal` does on web.

## 12. Open items

- **Sheet variant** for mobile-only flows (slide-up from bottom, supports content scrolling). Reserved for the back-office mobile views — not in v1.0.
- **Multi-step wizard surface** — pending until a flow demands it. Likely a new `WizardModal` wrapping the primitives with step state.
- **Per-theme shadow drop in sunlight** — see §8 sunlight note.
- **Real-device focus-ring + portal test** on Julien's phone bundled with the sunlight + spacing field-tests.
- **`onAutoFocus` override** — ConfirmModal currently relies on DOM order for initial focus. Consider explicitly passing `onOpenAutoFocus` to lock initial focus on Cancel regardless of children reordering.

## 13. References

- Radix UI Dialog — https://www.radix-ui.com/primitives/docs/components/dialog
- sonner — https://sonner.emilkowal.ski/
- WCAG 2.2 SC 2.4.3 (Focus Order)
- WCAG 2.2 SC 2.1.2 (No Keyboard Trap) — focus trap is allowed when there's a clear way out (Esc / Cancel)
- FFIE design principles P5 (forgive the editor), P4 (accessibility floor)
- [SHADCN_INTEGRATION.md](../SHADCN_INTEGRATION.md)
- [I18N.md](../I18N.md)

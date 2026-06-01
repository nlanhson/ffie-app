# Toast

**Status:** v1.0 — fourth FFIE component (after Input + Button + StatusPill).
**Owner skill:** `design-systems--component-spec` (with `inclusive-interaction--feedback-and-status` + `inclusive-interaction--motion-sensitivity`).
**Tokens:** [tokens.ts](../tokens.ts) v0.6 — `themes[*].surface.raised`, `themes[*].text.{default, muted}`, `themes[*].border.subtle`, `themes[*].feedback.*` (via StatusPill), `motion.duration.{undo, slow, fast, loop}`, `motion.easing.{decelerate, accelerate}`, `elevation.lg`, `radii.lg`, `semantics.spacing.inset.default`.
**Preview:** [/components/toast](http://localhost:3001/components/toast) — every status × undo × syncing-promotion × theme.
**Principles touched:** P5 (forgive the editor — closes the parent half of Button `confirm="undo"`), P2 (offline-first — `offline` / `syncing` / `stale` / `fresh` toasts pair with the StatusPill quartet), P4 (a11y — `aria-live="polite"`, focus-return, swipe + keyboard dismiss, reduced motion).

---

## 1. Overview

The Toast is a transient, non-blocking notification that surfaces over content. It is the **parent half of the Button `confirm="undo"` contract** — when a destructive Button fires with `confirm="undo"`, the parent surface MUST raise a Toast with an **Undo** action for `motion.duration.undo` (60 000 ms).

The Toast does not block the user. It does not steal focus. It can be ignored. It dismisses itself.

### When to use

- After an action completes — **"News published"**, **"Document saved offline"**, **"12 documents archived"**.
- After a destructive `confirm="undo"` Button fires — **"News unpublished — Undo (60s)"**.
- To report a transient state change the user should know about but does NOT need to act on — **"Connection restored"**, **"Sauvegarde en cours…"**.
- To surface a non-blocking error from a background task — **"Failed to sync 1 document — Retry"**.

### When NOT to use

- For a decision the user MUST make → use **Modal** (future) or **AlertDialog**. Toasts are dismissable; required decisions are not.
- For persistent state on a single item → use **StatusPill** inline.
- For an inline form validation error → use **Input** `error` state.
- For a confirmation immediately tied to a tap on a single control → consider the control's own affordance first (e.g. a "Saved" pulse on the Button) before reaching for a Toast.

### Cross-platform parity

This spec is the contract for both the React Native (Expo) mobile app and the Next.js back-office. The web preview is the canonical reference; the RN implementation will use `react-native-toast-message` or a custom Reanimated layer at Stage 3, mirroring the same prop API, status set, and a11y commitments. The toast IS the surface where Julien sees "Sauvegardé hors-ligne" as he taps Save Offline on a worksite phone — sunlight-legible, top-of-screen (thumb-reachable), 60s dismiss timer (P5 undo window).

---

## 2. Anatomy

```
┌──────────────────────────────────────────────────────────────────┐
│  [▣ StatusPill]   Title text                          [Action]  [✕]│  ← container (surface.raised, border, radii.lg, elevation.lg)
│                   Description text (optional, muted)               │
└──────────────────────────────────────────────────────────────────┘
   ↑                ↑                                    ↑       ↑
   inline.snug (8)  inline.snug (8) gap to right cluster  ↑       inset.tight (4)
                                                          inset.compact (8) between buttons
```

| Element | Required | Notes |
|---|---|---|
| Container | ✓ | `<li role="status">` mounted in the sonner viewport. Holds bg, border, radius, elevation. |
| StatusPill (leading) | ✓ | `size="md"` `variant="filled"` per `name`. The shape+icon+label trio carries the load — color is the third signal. |
| Title | ✓ | Single line. `textStyles.label.md`. Truncates with `…` past container width. |
| Description | optional | 1–2 lines, wraps. `textStyles.body.sm` `color: text.muted`. |
| Action button | optional | Right-side. Inverse-style "ghost" button — label only, brand-accent fg on the toast surface. Triggers the action AND dismisses. |
| Dismiss button | ✓ | `X` icon, 44pt touch target via 6pt hit-slop. `aria-label="Dismiss"`. |
| Live region | implicit | The container itself is `role="status"` + `aria-live="polite"`. `danger` toasts use `role="alert"` + `aria-live="assertive"`. |

---

## 3. Variants

### Status (`name` prop)

The same 8 status names as **StatusPill** — `success` · `warning` · `danger` · `info` · `offline` · `syncing` · `stale` · `fresh`. The leading StatusPill IS rendered inside the toast — Toast is StatusPill's bigger sibling for transient surface communication.

| Status | Default `aria-live` | Default duration | Use |
|---|---|---|---|
| `success` | `polite` | 4 000 ms | Action confirmation. "News published", "Document saved." |
| `warning` | `polite` | 6 000 ms | Non-blocking caution. "Going offline soon." |
| `danger` | `assertive` (`role="alert"`) | **Infinity** until dismissed | Blocking error reported from a background task. "Failed to sync 2 documents." |
| `info` | `polite` | 4 000 ms | Neutral notification. The default for `toast.undo()`. |
| `offline` | `polite` | 6 000 ms | "Hors-ligne — modifications enregistrées localement." |
| `syncing` | `polite` | **Infinity** until promoted | "Sauvegarde en cours…". Caller promotes to `success`/`danger` when the operation completes. |
| `stale` | `polite` | 4 000 ms | "Cache obsolète — tirez pour rafraîchir." |
| `fresh` | `polite` | 3 000 ms | Brief "À jour" pulse after successful sync. |

### `toast.undo` — the P5 variant

A dedicated helper. Mounts an `info` toast (override via `name`) with a required **Undo** action and `duration: motion.duration.undo` (60 000 ms). This is the parent half of Button `confirm="undo"`.

```ts
toast.undo("Article retiré du fil", {
  onUndo: () => republishArticle(id),
});
// → "Article retiré du fil  [Annuler]  ✕"  visible for 60 s
```

### Size

A single size. Toasts have one job — surface a transient message — and a single visual weight keeps the stack predictable. Width adapts:

| Viewport | Width |
|---|---|
| `< md` (phone — Julien's worksite) | `100% − 2 × inset.default` (full width minus 16pt margins) |
| `≥ md` (back-office desktop — Sylvie) | `360px` minimum, `420px` maximum |

Height grows with description / action wrap.

### Position

| Viewport | Position |
|---|---|
| `< md` (phone) | **top-center** — reachable with thumb, doesn't collide with iOS bottom tab bar or the system home indicator |
| `≥ md` (desktop) | **bottom-right** — outside the reading center, matches the back-office convention |

Set on the `<Toaster />` host in the root layout; not per-toast.

---

## 4. Props / API

The Toast is invoked imperatively via a singleton `toast` API (mirrors `sonner`'s shape, types FFIE-specific):

```ts
import { toast } from "@/components/ui/Toast";

// Identity (one per status)
toast.success(message: string, opts?: ToastOptions): ToastId;
toast.warning(message: string, opts?: ToastOptions): ToastId;
toast.danger (message: string, opts?: ToastOptions): ToastId;
toast.info   (message: string, opts?: ToastOptions): ToastId;
toast.offline(message: string, opts?: ToastOptions): ToastId;
toast.syncing(message: string, opts?: ToastOptions): ToastId;  // duration defaults to Infinity
toast.stale  (message: string, opts?: ToastOptions): ToastId;
toast.fresh  (message: string, opts?: ToastOptions): ToastId;

// P5 — undo (closes the Button confirm="undo" contract)
toast.undo(message: string, opts: UndoOptions): ToastId;

// Lifecycle
toast.dismiss(id?: ToastId): void;  // omit id to dismiss all

type ToastOptions = {
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;          // defaults per status (see §3); pass Infinity to require manual dismiss
  id?: ToastId;               // pass a stable id to promote an existing toast (e.g. syncing → success)
  themeName?: ThemeName;
};

type UndoOptions = {
  onUndo: () => void;         // REQUIRED — the P5 contract
  undoLabel?: string;         // default "Annuler" (FR canonical); EN fallback "Undo"
  description?: string;
  duration?: number;          // default motion.duration.undo (60_000ms)
  name?: "info" | "success";  // default "info"
  themeName?: ThemeName;
};

type ToastId = string | number;
```

### Discriminated invariants

The TS API enforces at compile time:
- `toast.undo` REQUIRES `onUndo` — no overload without it.
- `toast.syncing` returns an id; the caller is expected to either `dismiss(id)` or pass `{ id }` to a follow-up `toast.success(...)` to promote in place.
- `toast(message)` (positional, untyped) is **not exported** — every toast carries a status name. There is no "type-less" toast.

### Defaults the consumer rarely overrides

- `duration` defaults per status (§3). The 60s undo window is the load-bearing P5 default — don't shorten it for "speed".
- `position` is controlled by the `<Toaster />` host, never per-toast.
- `id` is auto-generated. Pass one only when you intend to promote/replace an existing toast.

---

## 5. States

| State | Visual change | Tokens | Notes |
|---|---|---|---|
| **enter** | Slide in from edge (top on phone, right on desktop), opacity 0 → 1 | `motion.duration.slow` (320ms) `decelerate` | GPU `transform` + `opacity`. Skipped via opacity-only fade on `prefers-reduced-motion`. |
| **idle** | Static. Dismiss timer running. | — | Pause on pointer hover (desktop) and on focus (keyboard). Resume on leave/blur. |
| **action hover** (desktop) | Action button bg → `surface.subtle` overlay | `motion.duration.fast` (120ms) | — |
| **action pressed** | Action button scale(0.97) | `motion.duration.fast` (120ms) | Skipped on `prefers-reduced-motion`. |
| **dismiss** | Slide out, opacity 1 → 0 | `motion.duration.base` (200ms) `accelerate` | Skipped via opacity-only fade on `prefers-reduced-motion`. Swipe-to-dismiss uses the gesture's own velocity. |
| **promote** (syncing → success) | In-place content cross-fade | `motion.duration.fast` (120ms) | When `toast.success("Saved", { id: syncingId })` is called, the row content cross-fades; the container stays put. |
| **stacked** | Up to 3 toasts visible; older ones expand on hover | `motion.duration.slow` (320ms) `standard` | sonner's default behavior. 4th and later sit in the queue until older ones dismiss. |

### Focus ring contract (P4)

Action and Dismiss buttons follow the **Button focus ring contract** verbatim — 2pt solid outline, 2pt offset, `theme.border.focus` color, never suppressed.

### Pause-on-hover / pause-on-focus

- Desktop: pointer enters any toast → ALL toasts in the stack pause their dismiss timers.
- Keyboard: focus enters any toast (Tab into the action or dismiss button) → ALL toasts pause.
- On pointer leave / focus blur: timers resume from where they paused.

This is non-negotiable for the P5 undo toast: a user who Tabs to the **Undo** button at second 58 must not see the toast vanish at second 60 mid-decision.

---

## 6. Behavior

### Lifecycle

1. Caller invokes `toast.success("News published")`.
2. Toast mounts in the `<Toaster />` viewport, slides in (320ms `decelerate`).
3. `aria-live="polite"` region announces the message to assistive technology.
4. Dismiss timer starts. User may:
   - Wait for the timer (default 4000ms for success) → auto-dismiss.
   - Tap **Undo** / **Action** → fire `onClick`, dismiss immediately.
   - Tap **✕** → dismiss immediately.
   - Swipe (touch) / drag (mouse) the toast off-screen → dismiss.
   - Hover (desktop) or Tab into (keyboard) → pause timer.
5. Toast slides out (200ms `accelerate`). DOM unmounts after animation.

### Promote pattern (syncing → success/danger)

The canonical pattern for a long-running action:

```ts
const id = toast.syncing("Sauvegarde…");
try {
  await save();
  toast.success("Sauvegardé", { id });   // replaces the syncing toast in place
} catch (e) {
  toast.danger("Échec de la sauvegarde", { id, description: e.message });
}
```

The container stays put; the StatusPill + title swap with a 120ms cross-fade. The dismiss timer resets to the new status's default duration on promote.

### P5 undo contract — the load-bearing piece

A destructive Button with `confirm="undo"` MUST be paired with `toast.undo(...)`. The contract:

| Promise | Where enforced |
|---|---|
| The toast appears within one `motion.duration.fast` (120ms) of `onPress` firing | `toast.undo()` synchronously schedules the sonner mount |
| The toast survives for exactly `motion.duration.undo` (60 000 ms) unless dismissed | `duration` default in `UndoOptions` |
| Hovering / focusing the toast pauses its timer | sonner default + our `pauseWhenPageIsHidden: true` |
| Tapping **Undo** invokes `onUndo` AND dismisses the toast in the same frame | `toast.undo` implementation |
| The toast carries an `info` (or `success`) leading pill + the **Undo** action — never danger-red, never alert-styled | enforced by `UndoOptions.name` type |

Phrased plainly: a destructive Button with `confirm="undo"` and no parent `toast.undo()` is a bug, detectable at PR review.

### Stacking

- Up to **3 toasts** visible simultaneously (sonner `visibleToasts={3}`).
- Newer toasts push older ones down (top-center) or up (bottom-right).
- Hover expands the stack so each toast is independently visible + focusable.
- Excess toasts queue; they mount when an older one dismisses.
- Order: most recent at the "near" edge (top on phone — first thing seen; bottom on desktop — closest to where the user just acted).

### Swipe-to-dismiss

- Mobile + touch on web: horizontal swipe past 50% of container width → dismiss with the swipe's velocity.
- Mouse on web: drag past 50% → same.
- Keyboard / SR: `Esc` key while focus is inside any toast → dismiss the focused toast.

### Density

The Toast is **density-agnostic**. Worksite + back-office both render the same surface — the toast is a system notification, not a content surface, and shrinking it for `compact` would harm legibility. Width adapts to viewport (§3), padding stays at `inset.default` (16) regardless of `DensityContext`.

### Edge cases

| Case | Behavior |
|---|---|
| Long title that doesn't fit | Truncates with `…`; full title in `aria-label` of the row + `title` attribute. |
| Description with 4+ lines | Wraps; container height grows; stack reflows. Max 4 lines, then truncate. |
| `toast.undo` fires while a previous undo toast is still visible | Stack — both visible. Each has its own 60s timer and its own `onUndo`. |
| User taps Undo, network fails | Caller's responsibility — usually surface a new `toast.danger("Undo failed — Retry")`. |
| `prefers-reduced-motion: reduce` | Slide in/out replaced with opacity-only fade. Action button scale animation dropped. Timer behavior unchanged. |
| Tab + Shift+Tab through the stack | Each toast's [action, dismiss] enter the tab order. Tab does not loop inside the stack — it exits to the page after the last toast. |
| `aria-live="assertive"` for `danger` while user is typing | Acceptable — danger toasts are surfaced because the user needs to know now. They're rare by design. |
| Multiple back-to-back `toast.success` in quick succession (e.g. batch action) | Each mounts independently; consider calling once with a counted message instead ("12 documents archivés") rather than 12 separate toasts. Caller's responsibility. |
| Page navigated away while toasts are open | `pauseWhenPageIsHidden: true` — timers pause when the tab is hidden, resume on return. |
| User backgrounds the app (RN) | Timers pause via `AppState` watcher (RN parity at Stage 3). |

---

## 7. Accessibility

### Semantic markup

- Web: each toast is a `<li>` inside an `<ol role="region" aria-label="Notifications">` mounted by sonner. The `<li>` carries `role="status"` (default) or `role="alert"` (danger only).
- RN (Stage 3): `<View accessibilityRole="alert">` for danger, `accessibilityLiveRegion="polite"` otherwise.

### Live region semantics

| Status | `role` | `aria-live` | When to announce |
|---|---|---|---|
| `danger` | `alert` | `assertive` | Interrupt — the user needs to know now. |
| All others | `status` | `polite` | Announce in the user's idle moments — never interrupt typing or a screen reader's current utterance. |

`aria-atomic="true"` is set so the full toast (title + description + action label) is announced as one block.

### Screen reader announcements

| State | Announcement |
|---|---|
| Toast mounts | "{status label}, {title}. {description?}. Action: {action label?}. Press Esc to dismiss." |
| Toast updates (promote) | The new content is re-announced via the same live region. |
| Toast dismisses by timer | No announcement (it just disappears — SR users get the original announcement). |
| Toast dismissed by user | No announcement (the dismiss action is the user's own — they know they did it). |
| Focus enters toast | "Toast region, {N} of {total}. Undo button." (sonner's default focus management with our labels). |

### Keyboard

| Key | Behavior |
|---|---|
| `Tab` / `Shift+Tab` | Move between [Action, Dismiss] in each toast; through the stack. |
| `Enter` / `Space` | Activate the focused button. |
| `Esc` (focus inside a toast) | Dismiss the focused toast. |
| `Esc` (focus inside the page, not a toast) | Does NOT dismiss toasts — Esc is reserved for modals + dropdowns. |

The toast region is reachable via a global skip-link **"Skip to notifications"** at the page top (added to layout at Stage 3 when nav lands).

### Touch targets

- Action button: 44×44pt minimum via 8pt inset (above WCAG 2.5.5 floor).
- Dismiss button: 44×44pt via 6pt hit-slop around the 16pt `X` icon.

### Focus return

Toasts NEVER steal focus on mount. When a user tabs into a toast and activates the action or dismiss, focus returns to the **element that originally fired the action that caused the toast** if it still exists, else to `document.body`.

### Motion sensitivity (P4 + motion-sensitivity)

- `prefers-reduced-motion: reduce`: slide-in/out replaced with opacity-only fade (200ms); action button press scale dropped.
- The `syncing` StatusPill icon inside the toast keeps rotating (per StatusPill spec §7 — rotation IS the affordance for in-progress state, motion isn't decorative here).
- No `fresh`-style pulse on the toast container — fresh status renders as a static toast that auto-dismisses after 3000ms.
- No autoplay video, no parallax, no horizontal scrolling text inside toasts. Toasts surface text; nothing else.

### Color independence (P4)

The toast's status is encoded in **THREE** dimensions: the leading StatusPill (which itself encodes color + shape + label), the action button styling, and the optional left border tint on dark theme. The StatusPill is the load-bearing colorblind mitigation — Toast piggybacks on it.

---

## 8. Usage guidelines

### Do

- Pair every destructive Button (`confirm="undo"`) with `toast.undo(...)`. The contract is non-negotiable.
- Use the `id`-promote pattern for long-running actions instead of stacking separate `syncing` → `success` toasts.
- Write toast titles like a Button label — verb + object, sentence case, no punctuation. "News published", "Document saved offline."
- Use `description` for **what changed**, not for instructions. "12 MB téléchargés" not "Vous pouvez maintenant ouvrir le document hors-ligne."
- Use `toast.danger` ONLY for non-blocking background errors. A blocking error needs a Modal.
- Test with VoiceOver / TalkBack to confirm announcements don't overlap.

### Don't

- Don't use a Toast for required decisions — use Modal.
- Don't fire more than one toast per action. Batch user feedback into one message.
- Don't shorten the 60s undo window. Even if it feels long. The spec is the contract — read [Button.md §6](./Button.md#destructive-confirm-modes-p5) for the rationale.
- Don't use color-only toast variants. The StatusPill icon is mandatory.
- Don't put two action buttons on one toast — pick the primary recovery action. (If the user needs to choose between two actions, that's a Modal.)
- Don't autoplay sound on toast mount.

### Content rules

- **Title length**: 1–6 words. 7 words is the soft cap.
- **Description length**: 1–2 short sentences. Truncates at 4 lines.
- **Action label**: 1 word ideally — "Annuler", "Réessayer", "Ouvrir". Same rules as Button labels.
- **French parity**: "Annuler" (Undo) is the default — short enough to fit comfortably. If the FR label runs >12 chars, drop the toast to icon-only on the action and surface the label via `aria-label`.

### Related components

- **Button** — `confirm="undo"` REQUIRES `toast.undo()`. Closing the other half of that contract IS the Toast's job.
- **StatusPill** — Toast renders one as the leading mark.
- **Modal** (future) — Use for required decisions, not transient feedback.
- **Snackbar** — Snackbar and Toast are the same thing in this design system. We use "Toast" everywhere.

---

## 9. Verification — what must hold at every release

| Check | How | Pass criterion |
|---|---|---|
| Every destructive Button `confirm="undo"` in the codebase pairs with `toast.undo(...)` | grep callsites at Stage 3+ | 100% paired |
| `toast.undo` default duration === `motion.duration.undo` (60 000ms) | unit test | Equals 60000 |
| Hover + Tab focus pause the dismiss timer | manual at [/components/toast](http://localhost:3001/components/toast); count seconds; tab away; observe resume | Timer pauses; resumes on leave/blur |
| `prefers-reduced-motion` swaps slide for opacity fade | DevTools emulate; observe | No `translate` transform on enter/exit |
| `danger` toast uses `role="alert"` + `aria-live="assertive"` | DevTools inspect; SR test | Both attributes present |
| Promote (`syncing` → `success` via `id`) cross-fades content, container stable | manual at preview | Container does not jump or remount |
| Action + Dismiss buttons hit ≥44pt touch target | DevTools measure | All ≥ 44 |
| French "Annuler" fits the action slot without truncating | Visual at fr-FR locale | Fits |
| Toast does NOT steal focus on mount | Tab from a known element; observe focus stays | Focus unchanged on mount |

---

## 10. Open follow-ups

- [ ] **RN implementation** — Stage 3, `apps/mobile`. Mirror this spec using `react-native-toast-message` or a Reanimated layer over `Animated.View`. Confirm `AppState` pause behavior + `accessibilityLiveRegion` parity.
- [ ] **Promote animation polish** — the 120ms cross-fade is functional but feels abrupt at the desktop sizes (360–420px). Consider a 200ms `standard` ease + a subtle StatusPill icon "morph" once we have Emil's animation pass.
- [ ] **Component-level token slots** — `component.toast.{width.min, width.max, action.fg, dismiss.fg, surface}` once we field-test in app screens and see the slots repeat.
- [ ] **Sound** — for now no audio. If field testing shows Julien misses toasts in glove + sunlight, evaluate an optional system-style "ping" gated by `prefers-reduced-motion` + a user setting.
- [ ] **Toast queue cap** — currently `visibleToasts={3}` + unlimited queue. Decide a queue cap (10? 20?) once we see real fire-and-forget batch flows.
- [ ] **`toast.promise(p, { loading, success, error })`** — promise wrapper. Defer to v1.1; the `syncing` + `id`-promote pattern covers the same ground today.
- [ ] **Folder convention** — Input lives at `src/components/ds/`, Button + StatusPill + Toast at `src/components/ui/`. Decide between `ds` and `ui` before the 5th component lands. (Carried forward from StatusPill.md.)

---

## 11. Changelog

| Date | Version | Change | Skill |
|---|---|---|---|
| 2026-05-28 | 1.0 | First version. 8 statuses + `toast.undo` (P5 — closes the Button `confirm="undo"` contract). Imperative `toast.{name}(message, opts)` API over `sonner`, custom-rendered to compose StatusPill `filled` `md` as the leading mark. Responsive position (top-center phone / bottom-right desktop). `role="alert"` for danger; `role="status"` + `aria-live="polite"` otherwise. Pause-on-hover, pause-on-focus, swipe-to-dismiss, keyboard Esc dismiss, focus return. `prefers-reduced-motion` swaps slide for opacity fade. | `design-systems--component-spec` + `inclusive-interaction--feedback-and-status` + `inclusive-interaction--motion-sensitivity` |

# Button

**Status:** v1.0 — first FFIE component spec.
**Owner skill:** `design-systems--component-spec`.
**Tokens:** [tokens.ts](../tokens.ts) v0.5 — `themes[*].action.{primary,secondary,destructive}`, `textStyles.label.*`, `semantics.spacing.inset.*`, `sizes.touchTarget.*`, `motion.duration.{fast,confirm,undo,loop}`, `themes[*].border.focus`.
**Preview:** [/components/button](http://localhost:3001/components/button) — every variant × state × size × theme × density.
**Principles touched:** P1 (field-ready / 48pt gloved-hand target), P4 (a11y floor — focus ring, screen reader, keyboard), P5 (forgive the editor — destructive two-step + undo).

---

## 1. Overview

The Button is the canonical trigger for an action. It is the first component every other component leans on (DocCard's "Open" action, SearchInput's "Search" submit, modal Confirm/Cancel pairs, news-management table row actions for Sylvie).

### When to use

- The user needs to take an immediate, concrete action: **Submit**, **Delete**, **Download**, **Publish**, **Save offline**.
- The action has a clear, named outcome — the label is a verb or verb phrase.

### When NOT to use

- For navigation between routes → use **Link** (visually styled differently to communicate "this takes you somewhere" vs "this does something").
- For binary state toggles → use **Toggle** or **Checkbox**.
- For selecting one of several items → use **SegmentedControl** or **RadioGroup**.
- For tertiary/repeated row-level commands in a dense list → use **IconButton** (single-icon, no label, 44pt touch target with offset hit-slop).

### Cross-platform parity

This spec is the contract for **both** the React Native (Expo) mobile app and the Next.js back-office. Implementation diverges (Pressable + Reanimated on RN; `<button>` + CSS transitions on web) but the prop API, sizes, states, and a11y commitments are identical. The preview at [/components/button](http://localhost:3001/components/button) is the web implementation; mobile parity is verified at Stage 3 with Storybook-on-device.

---

## 2. Anatomy

```
┌──────────────────────────────────────────────────────┐
│  [⨯ icon-leading]  Label text  [icon-trailing ⨯]    │  ← container (bg, border, radius)
└──────────────────────────────────────────────────────┘
   ↑                ↑               ↑
   inline.tight (4) inline.tight   inset.x (defaults to inset.default = 16)
   inset.y derives from height − label line-height, halved
```

| Element | Required | Notes |
|---|---|---|
| Container | ✓ | `<button>` (web) / `Pressable` (RN). Holds bg, border, radius, focus ring. |
| Label | ✓* | Text node. `*` Required unless `iconOnly` — see §3. |
| Leading icon | optional | `iconLeading` prop. Inline.tight (4) gap to label. |
| Trailing icon | optional | `iconTrailing` prop. Useful for chevrons, external-link marks, loading spinner. |
| Spinner | conditional | Replaces leading icon when `loading=true`. See §5 Loading. |
| Hold-progress arc | conditional | Wraps the label when `confirm="hold"` and a press is in flight. See §6 Confirm. |

---

## 3. Variants

### Style

| Variant | Token | Use |
|---|---|---|
| **primary** (default) | `action.primary.*` | The single most important action on a screen. Max one per modal/section. |
| **secondary** | `action.secondary.*` | Outlined. Co-equal alternatives ("Save draft" next to "Publish"); back-office secondary actions. |
| **destructive** | `action.destructive.*` | Removes / unpublishes / deletes. **Requires `confirm` prop** (P5). |
| **ghost** | `text.muted` fg, `surface.subtle` bgHover | Tertiary, row-level. No bg, no border. For dense back-office row actions ("Edit", "Move"). |

### Size

| Size | Height | Touch target | Used in |
|---|---|---|---|
| **sm** | 40 | ≥40 (above WCAG 2.5.5 floor of 44 only with hit-slop) | Back-office toolbars + dense tables under `density="compact"`. **Forbidden on mobile** — falls back to `md`. |
| **md** (default) | 48 | 48 (`sizes.touchTarget.primary`) | Mobile default. P1 floor. |
| **lg** | 56 | 56 (`sizes.touchTarget.comfortable`) | Hero CTAs on public landing; "Save offline" on doc detail for Julien. |

### Width

- **hug** (default) — content-width with `min-width: 80pt`.
- **fullWidth** — fills container. Mobile forms; bottom-of-modal CTAs.

### Icon-only

When `iconOnly=true`, render the leading icon centered, drop the label, force a **square** footprint at the chosen size. `aria-label` becomes **required** — type-checked.

---

## 4. Props / API

```ts
type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ConfirmMode = "none" | "undo" | "hold";

type ButtonProps = {
  // Identity
  variant?: ButtonVariant;          // default: "primary"
  size?: ButtonSize;                // default: "md"
  fullWidth?: boolean;              // default: false

  // Content
  children?: ReactNode;             // the label
  iconLeading?: LucideIcon;
  iconTrailing?: LucideIcon;
  iconOnly?: boolean;               // default: false; requires aria-label

  // Behavior
  onPress: () => void;              // RN naming; web aliases to onClick
  disabled?: boolean;               // default: false
  loading?: boolean;                // default: false. Disables interaction, shows spinner.
  confirm?: ConfirmMode;            // default: "none"; destructive variant requires "undo" | "hold"

  // Accessibility (web semantic & SR)
  ariaLabel?: string;               // required when iconOnly=true
  ariaDescribedBy?: string;         // points to a help-text id (e.g. "Deletes permanently")
};
```

### Discriminated invariants

The TS API rejects these at compile time:
- `iconOnly=true` without `ariaLabel`.
- `variant="destructive"` with `confirm="none"`.
- `children` and `iconOnly=true` together.

### Defaults the consumer rarely overrides
- `loading=true` ⇒ `aria-busy=true`, `disabled=true` (interaction blocked), keeps focus.
- `disabled=true` ⇒ `aria-disabled=true` (NOT the native `disabled` attribute alone — native disabled removes the element from the tab order on some browsers and breaks screen-reader announcements).

---

## 5. States

| State | Visual change | Tokens | Notes |
|---|---|---|---|
| **default** | `action.{variant}.bg` + `fg` | per variant | — |
| **hover** (pointer only) | bg → `bgHover` | `action.{variant}.bgHover` | Mobile/touch: skip entirely. `(hover: hover)` CSS query. |
| **focus** | 2pt outline, 2pt offset, color = `border.focus` | `border.focus` | Visible on keyboard focus AND tap focus (RN). NEVER suppressed via `outline: none`. |
| **pressed / active** | bg → `bgPressed`, scale(0.97) | `action.{variant}.bgPressed`, `motion.fast` (120ms) | Scale transform is GPU-cheap; same on web and RN (Reanimated). |
| **disabled** | `opacity.disabled` (0.4), `cursor: not-allowed` | `opacity.disabled` | `aria-disabled`. Focusable so SR users can hear the disabled state, but `onPress` is no-op. |
| **loading** | spinner replaces `iconLeading`, label dims to `opacity.disabled` only on the LABEL, not the spinner | `motion.duration.loop` (1000ms) | `aria-busy=true`. Interaction blocked. Width does NOT change (label is reserved-space, hidden via opacity 0 on the text only). |
| **hold-in-progress** (destructive + `confirm="hold"`) | radial-progress stroke fills around label over 600ms | `motion.duration.confirm` (600ms) | Release before 100% = cancel. Reach 100% = fire `onPress`, transition to a brief success pulse. |

### Focus ring contract (P4)

- **2pt solid** outline, **2pt offset** outside the container.
- Color = `theme.border.focus` (audited ≥3:1 vs every surface in [COLOR_SYSTEM.md §3](../COLOR_SYSTEM.md)).
- Visible on `:focus-visible` (web — keyboard) and always on RN (`accessible=true`).
- Survives in `forced-colors: active` (Windows High Contrast) — outline uses `CanvasText` color in that mode.

---

## 6. Behavior

### Press feedback
On press-down, in one `motion.fast` (120ms `standard` easing) transition:
- bg → `bgPressed`
- container → `scale(0.97)`

On release (within bounds): trigger `onPress` AND begin the 120ms reverse animation.
On release outside the bounds (cancel): reverse without firing.

### Loading

```
[normal]    [⚡ Save offline]
   ↓ loading=true
[loading]   [↻ Save offline]   ← spinner rotates motion.duration.loop (1000ms) linear
                                  label opacity = opacity.disabled (0.4)
                                  container interaction blocked
                                  width unchanged
```

### Destructive `confirm` modes (P5)

This is the load-bearing P5 implementation. A destructive Button MUST pick one:

#### `confirm="undo"` — optimistic + undo toast
Default for soft destructive (unpublish news, remove from favorites, hide from feed).
1. User taps. `onPress` fires immediately.
2. Parent surface MUST show a snackbar/toast with **Undo** action.
3. The toast remains for `motion.duration.undo` (60000ms = 60s) — the P5 contract.
4. If the user taps Undo within 60s, parent reverses the action.

The Button itself fires immediately and does no UI work for the toast — that is the parent's responsibility, declared by passing `confirm="undo"`. The spec is a contract: a destructive button with `confirm="undo"` without a parent toast is a bug.

#### `confirm="hold"` — press-and-hold to fire
For hard destructive (delete account, permanently remove a document version, kick a member).
1. User presses. Hold-progress arc begins filling around the label.
2. Visual: 2pt circular stroke wraps the label area, fills clockwise over `motion.duration.confirm` (600ms) at `standard` easing.
3. Release before 100% → arc retracts in 120ms (`motion.fast`), `onPress` does NOT fire.
4. Reach 100% → `onPress` fires, button pulses once (scale 1.0 → 1.04 → 1.0 over 240ms), label optionally swaps to a success state for 800ms.

Both modes are accessible — `confirm="hold"` exposes `aria-describedby` text "Press and hold for one second to confirm" the first time it appears in a session.

### Density behavior
Buttons honor the surrounding `DensityContext`:
- `compact` (Sylvie's back-office) → `inset.compact` (8) horizontal padding; size coerces to `sm` if mobile-allowed; vertical padding still respects target floor.
- `comfortable` (default) → spec values above.
- `spacious` (public landing) → `inset.comfortable` (24) horizontal padding; label uses `label.lg`.

The size floor at 48pt is NEVER violated by density. `compact` shrinks horizontal padding only.

### Responsive
- `fullWidth` defaults to **true** when rendered as the bottom action of a `BottomSheet` or full-screen `Modal`.
- On viewports `≥ md` (768) in a `<form>`, buttons hug content (`fullWidth=false`) unless explicitly overridden.

### Edge cases

| Case | Behavior |
|---|---|
| Label wraps to 2 lines | Vertical padding stays; height grows. min-height never falls below the size floor. |
| Long label on `sm` width-hugged | Label truncates with `…` at the container edge; full label exposed via `aria-label` AND `title`. |
| User taps then drags off before release | Cancel — no `onPress`. Container animates back to default in 120ms. |
| Network slow + `loading=true` for >5s | No visual escalation. The spinner just keeps spinning. Parent surface is responsible for a timeout-and-retry UI. |
| Double-tap (rapid) | Web: `:active` debounces visually but `onPress` fires twice. **Caller is responsible for idempotency.** Document this prominently. RN: same. |
| `confirm="hold"` interrupted by app backgrounding | Hold cancels on `AppState` change away from "active". |

---

## 7. Accessibility

### Semantic HTML / RN role
- Web: `<button type="button">`. NEVER `<div role="button">` or `<a>` styled as a button.
- RN: `Pressable` with `accessibilityRole="button"`.

### Keyboard (web)
| Key | Behavior |
|---|---|
| `Tab` / `Shift+Tab` | Enter and leave focus. Disabled buttons stay in the tab order (so SR users hear them); pressed disabled is no-op. |
| `Enter` | Fires `onPress`. |
| `Space` | Fires `onPress` (on key-up, matching native button semantics). |
| `Esc` | When `confirm="hold"` is in flight, cancels the hold. |

### Screen reader announcements
- Default: announce **"{label}, button"**.
- Loading: append **", busy"** via `aria-busy=true`.
- Disabled: append **", dimmed"** (iOS VoiceOver) / **", disabled"** (TalkBack) via `aria-disabled`.
- Destructive + `confirm="hold"`: append the hint **"Press and hold to confirm"** via `aria-describedby` on first session encounter.
- Icon-only: announce the `ariaLabel` value, NOT the icon name.

### Touch target (P1 + WCAG 2.5.5)
- `md`: **48×48pt** minimum. Visual size = touch size — no invisible hit-slop required.
- `sm` (back-office only): 40×40pt visual + 4pt `hit-slop` on all sides, total target 48pt. Achieves WCAG 2.5.5 via the "spacing" exception when buttons are isolated and surrounded by ≥24pt of inert space.

### Focus indication (P4)
See §5 Focus ring contract. The ring is the LOAD-BEARING affordance for keyboard users — never suppressed, even when ugly.

### Color independence (P4)
- Variants differ in **bg + label weight + icon presence**, not bg color alone. A user with no color perception can tell `secondary` from `primary` by the border (outline vs filled).
- Destructive carries an `AlertTriangle` `iconLeading` by **default** (override available) — the red bg is reinforcement, not the only signal.

### Motion (P4 + motion-sensitivity)
- Respect `prefers-reduced-motion: reduce` (web) and `Reduce Motion` (RN `AccessibilityInfo`):
  - Press scale animation: skipped (instant bg swap only).
  - Hold-confirm arc: still fills (the duration is part of the safety mechanic), but no scale pulse on completion.
  - Loading spinner: still rotates (the rotation IS the loading affordance), but a `prefers-reduced-motion` user can opt to a static "…" indicator via app-level setting.

---

## 8. Usage guidelines

### Do

- Use a verb. **"Save offline"**, **"Publish news"**, **"Delete document"** — not "OK", "Yes", "Submit".
- One primary per modal/screen region. Demote alternatives to `secondary` or `ghost`.
- Pair destructive `confirm="undo"` with a parent surface toast — the spec requires it.
- Use `loading` instead of swapping label text to "Saving…" — preserves width, prevents layout shift.
- Set `iconLeading={Wifi}` (or matching status icon) for actions whose result depends on network state — gives Julien a glanceable cue (P1).
- For Sylvie's back-office tables: `variant="ghost"` `size="sm"` `density="compact"` for row actions.

### Don't

- Don't use color alone to differentiate variants (P4) — keep the border on `secondary`, the icon on `destructive`.
- Don't disable `:focus-visible` outlines. Ever.
- Don't put two `primary` buttons adjacent. Choose one.
- Don't use `confirm="hold"` for soft destructive actions — it adds friction without proportional safety. Reserve for hard destructive only.
- Don't shrink `sm` below 40pt on mobile — fall back to `md`.
- Don't use `<a>` styled as a Button. Routes use Link.

### Content rules

- **Length**: 1–3 words. 4 words is the soft cap. >4 = re-think.
- **Sentence case**, never SCREAMING CAPS (P4 — uppercase reduces legibility).
- **No punctuation** in labels (no "Save!" or "Delete?").
- **French label parity**: French is ~25% longer than English. Test "Enregistrer hors-ligne" fits `md` width. If not, drop to icon-only on the constrained surface.

### Related components

- **Link** — for navigation. Visually less heavy.
- **IconButton** — single-icon, no label, when space forbids a labeled button.
- **ToggleButton** — for binary state.
- **SegmentedControl** — for mutually exclusive choices.
- **Snackbar/Toast** — REQUIRED companion for destructive `confirm="undo"`.

---

## 9. Verification — what must hold at every release

| Check | How | Pass criterion |
|---|---|---|
| All variant × theme combinations clear AA | [`color-audit.ts`](../../../design-system-preview/src/lib/color-audit.ts) running over `action.{primary,secondary,destructive}.{bg,bgHover,bgPressed}` × theme | 100% pass |
| Focus ring ≥3:1 vs all adjacent surfaces | Manual audit per `border.focus` value per theme | All 3 themes pass |
| `md` size ≥48×48pt at all zooms | Browser zoom 100% / 200%; RN device test | Never below |
| `prefers-reduced-motion` skips press scale | DevTools emulate; observe | Bg-swap only, no transform |
| Keyboard Tab order includes disabled buttons | Tab through preview at [/components/button](http://localhost:3001/components/button) | Disabled focusable, announce-only |
| French label "Enregistrer hors-ligne" fits `md` width-hugged | Visual at fr-FR locale | Fits or falls back per spec |
| Destructive `confirm="undo"` paired with parent toast in every usage | grep usage callsites in app code (Stage 3+) | 100% paired |

---

## 10. Open follow-ups

- [ ] **Component-level token slots** — add `component.button.*` to `tokens.ts` once the second component (likely `IconButton` or `SearchInput`) lands and we see what slots actually repeat.
- [ ] **`ghost` hover fill in dark theme** — currently bg → `gray.800`; visually nearly invisible against `surface.raised`. Field-test before Stage 3 ships dark UIs.
- [ ] **RN implementation** — Stage 3, `apps/mobile`. Mirror this spec using `Pressable` + `react-native-reanimated` for scale/arc, `lucide-react-native` for icons.
- [ ] **French label width test** — needs a real fr-FR copy pass once the news/doc actions are named.
- [ ] **Storybook-on-device** — set up Expo Storybook for cross-platform parity verification at Stage 3 kickoff.

---

## 11. Changelog

| Date | Version | Change | Skill |
|---|---|---|---|
| 2026-05-28 | 1.0 | First FFIE component spec. 4 variants × 3 sizes × 3 widths, full state matrix, P1/P4/P5 contracts encoded. tokens.ts → v0.5 (action state variants, secondary action, motion.duration.loop). Web preview live; RN parity deferred to Stage 3. | `design-systems--component-spec` |

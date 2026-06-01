# StatusPill

**Status:** v1.0 — third FFIE component (after Input + Button).
**Owner skill:** `design-systems--component-spec` (with `adaptive-interfaces--colour-independence` + `inclusive-interaction--feedback-and-status`).
**Tokens:** [tokens.ts](../tokens.ts) v0.6 — `themes[*].feedback.{success, warning, danger, info, offline, syncing, stale}` (filled), `themes[*].feedback.subtle.{name}.{bg, fg, border}` (low-emphasis), `textStyles.label.sm` + `caption`, `semantics.spacing.inset.{tight, compact}`, `motion.duration.loop`.
**Preview:** [/components/status-pill](http://localhost:3001/components/status-pill).
**Principles touched:** P2 (offline-first / Julien's worksite cache state), P4 (a11y — shape + icon + label, never colour alone), P1 (sunlight legibility — pills must read at arm's length in glare).

---

## 1. Overview

The StatusPill communicates the **state of a thing** in a compact, glance-able shield: this document is **offline-ready**; this news item is **stale**; this sync is **in-progress**; this action **succeeded**.

It is the load-bearing visual contract behind P2 (offline-first). Every cached doc row in Julien's library, every news card freshness indicator, and every "saved" / "publishing" / "failed" toast leans on this component. If the StatusPill regresses, P2 regresses.

### When to use

- To show the **current state of an item** the user is looking at: a document's cache state, a news item's freshness, a sync's progress, a form field's validation outcome.
- As an inline tag next to a title, in a list row, or atop a card.
- In a toast/snackbar to confirm an action completed (or failed).

### When NOT to use

- For a **trigger**. Even though `onPress` is supported (tap a stale pill to refresh), the pill is primarily a *signal*. If the primary purpose is action, use **Button** (`variant="ghost"` + `iconLeading`).
- For a **tab or filter**. Use **Tabs** or **Chip** (separate component, future).
- For an **achievement / badge** with brand decoration. That's a future **Badge** component.
- When the state is **boolean and persistent** (on/off, member/non-member) — use **Toggle** or **state.gated.\*** color directly on the surface.

### The P2 lineage

The status set is not generic — it was designed around Julien's worksite reality:

| Status | What it means in plain French | Where it appears |
|---|---|---|
| `offline` | "Available without network" | Doc-library row, cached news card |
| `syncing` | "Updating now" | Doc detail header during background fetch |
| `stale` | "Cached, but older than 24h" | Doc-library row, news card |
| `fresh` | "Just refreshed" | Brief 3s flash after a successful sync |
| `success` | Generic positive completion | Form save, action confirmation |
| `warning` | Generic non-blocking caution | Form field, action with caveat |
| `danger` | Generic blocking error | Form field, failed save |
| `info` | Generic neutral info | Empty states, tips |

`offline` / `syncing` / `stale` / `fresh` are the **P2 set**. They share visual DNA but each carries its own icon + label so a colorblind / glove-handed / sunlight-blinded user can read them at arm's length.

---

## 2. Anatomy

```
┌──────────────────────────────────────┐
│  [icon]   Label text                 │  ← container (bg, border?, full radius)
└──────────────────────────────────────┘
   ↑       ↑
   inline.tight (4)  inset.x = inset.compact (8) on sm/md, inset.default (16) on lg
```

| Element | Required | Notes |
|---|---|---|
| Container | ✓ | `<span>` (web) / `View` (RN). Pill shape via `radii.full`. |
| Icon | ✓ | Lucide icon. The icon is **non-negotiable** — it IS the colour-independence mitigation per P4. The component will refuse `iconOnly=false && icon=null` at compile time. |
| Label | optional | Visible text. Required for `variant="filled"`; optional (icon-only) for ultra-dense contexts in `variant="subtle"`. |
| Border | conditional | Present in `variant="subtle"` (per `feedback.subtle.{name}.border`). Absent in `variant="filled"`. |
| Live region | conditional | When `live={true}`, the pill becomes an `aria-live="polite"` region. Used by syncing/success toasts where the state CHANGES while the user is on the screen. |

---

## 3. Variants

### Emphasis

| Variant | Style | Use |
|---|---|---|
| **filled** (default) | Saturated `feedback.{name}` bg + `text.inverse` fg | Single, prominent pill (header banner, toast, isolated status). One per visual region. |
| **subtle** | `feedback.subtle.{name}.bg` + `feedback.subtle.{name}.fg` (+ border in sunlight) | Repeated/contextual pills (every row in Julien's doc list, every news card). The default when you'd see >2 pills together. |

### Status (`name` prop)

`success` · `warning` · `danger` · `info` · `offline` · `syncing` · `stale` · `fresh`

`fresh` is implemented as a `success` variant with the **CheckCircle** icon and the label "Mis à jour" / "Updated". It exists as a named status so engineers don't manually wire a green Check pill every time.

### Size

| Size | Height | Icon | Text style | Use |
|---|---|---|---|---|
| **sm** | 20 | 12 | `caption` (12pt) | Inline with a title in a dense list row. **NOT tappable** (sub-target). |
| **md** (default) | 24 | 14 | `label.sm` (14pt) | Card header, doc-row leading status. **NOT tappable** by default. |
| **lg** | 32 | 16 | `label.md` (14pt + medium weight) | Toast, hero banner, prominent state. **Tappable** when `onPress` is set (reaches 44pt with 6pt hit-slop top+bottom for WCAG 2.5.5). |

**Tappable sizes**: only `lg` (with hit-slop). `sm` and `md` are signals; if you need a tappable status indicator at small size, wrap it in a `Button variant="ghost" size="sm"` with the pill inside.

### Layout

- Inline-block by default — sits flush with surrounding text on its baseline.
- `inline.snug` (8) gap from any adjacent text per the P2 spacing contract (see [SPACING.md §7](../SPACING.md#7-persona-anchored-rules-the-load-bearing-ones) rule #4).

---

## 4. Props / API

```ts
type StatusName =
  | "success" | "warning" | "danger" | "info"
  | "offline" | "syncing" | "stale" | "fresh";

type StatusPillVariant = "filled" | "subtle";
type StatusPillSize = "sm" | "md" | "lg";

type StatusPillProps = {
  // Identity
  name: StatusName;                  // required
  variant?: StatusPillVariant;       // default: "filled"
  size?: StatusPillSize;             // default: "md"

  // Content
  children?: ReactNode;              // label text. Default = the localized default per `name`.
  icon?: LucideIcon;                 // override the default icon mapping (rare)

  // Behavior
  onPress?: () => void;              // only valid when size="lg"; type-checked
  live?: boolean;                    // aria-live="polite" for dynamic state changes
  pulse?: boolean;                   // syncing variant uses this by default — adds a 1s opacity loop

  // Theming (preview / RN escape hatch)
  themeName?: ThemeName;

  // Accessibility
  ariaLabel?: string;                // overrides the default screen-reader announcement
};
```

### Default icon mapping (lucide-react)

| Status | Icon | Why |
|---|---|---|
| `success` | `CheckCircle2` | Universal positive |
| `warning` | `AlertTriangle` | Universal non-blocking caution |
| `danger` | `AlertCircle` | Round = error (distinct from triangular caution) |
| `info` | `Info` | i-in-circle, universal |
| `offline` | `WifiOff` | Network-absence shape, NOT a warning |
| `syncing` | `RefreshCw` | Rotates continuously per `motion.duration.loop` |
| `stale` | `Clock` | Time-based, distinct from offline |
| `fresh` | `CheckCircle2` | Same as success — fresh IS the success of a sync |

### Default labels (FR / EN)

| Status | FR | EN |
|---|---|---|
| `success` | "Réussi" | "Success" |
| `warning` | "Attention" | "Warning" |
| `danger` | "Erreur" | "Error" |
| `info` | "Info" | "Info" |
| `offline` | "Hors-ligne" | "Offline" |
| `syncing` | "Sync…" | "Syncing…" |
| `stale` | "Périmé" | "Stale" |
| `fresh` | "À jour" | "Updated" |

These are the canonical labels — overrideable via `children` for context ("Sauvegardé hors-ligne — 12 MB" instead of just "Hors-ligne"). FR strings are intentionally short (the back-office and mobile UI run in French; English is preview/docs only).

### Discriminated invariants

The TS API rejects at compile time:
- `onPress` set when `size !== "lg"` — small/medium pills are signals, not buttons.

---

## 5. States

StatusPill is mostly stateless — it renders the state passed in. But it has a few interaction / animation states:

| State | Visual | Tokens | Notes |
|---|---|---|---|
| **default** | Static pill | per name/variant | — |
| **syncing animation** | Icon rotates 360° linear | `motion.duration.loop` (1000ms) | Always on for `name="syncing"` unless `prefers-reduced-motion: reduce` AND user has opted out (default: rotation IS the affordance, so we keep it). |
| **pulse** | Container opacity 0.7 → 1.0 → 0.7 cycle | `motion.duration.loop` (1000ms) | Auto-enabled for `syncing`. Skipped on `prefers-reduced-motion`. |
| **fresh flash** | Mounted → visible 3s → fade out 320ms | `motion.duration.slow` (320ms) | Parent controls mount/unmount; the component handles its own fade-out via `useEffect` if `name="fresh"`. |
| **focus** (only `lg` + `onPress`) | 2pt outline, 2pt offset, `border.focus` | `border.focus` | Same contract as Button. |
| **pressed** (only `lg` + `onPress`) | bg darkens 1 step, scale 0.97 | `motion.duration.fast` (120ms) | Same as Button. |
| **live update** | `aria-live="polite"` announces change | — | When `live=true`, screen readers announce the new label in the user's idle moments. Use for toasts, NOT for the dozens of status pills in a doc list (would overwhelm SR). |

---

## 6. Behavior

### Color independence (P4) — the load-bearing piece

Every status differs in **THREE independent dimensions**, not just one:

| Dimension | Encodes the difference |
|---|---|
| Color | `feedback.{name}` / `feedback.subtle.{name}` |
| Icon shape | per the icon mapping table in §4 |
| Label text | per the default labels in §4 |

A user with no color perception can distinguish all 8 statuses from icon + label alone. The colorblind audit ([COLOR_SYSTEM.md §3](../COLOR_SYSTEM.md)) found one marginal pair: **sunlight `syncing` vs `info` under tritanopia (ΔE 0.5)**. The StatusPill is the mitigation: `RefreshCw` (rotating) vs `Info` (static i-in-circle) are radically different shapes — a user with tritanopia in sunlight reads the state from the icon, not the color. **This is why the icon is non-negotiable.** A `StatusPill` without an icon is a bug.

### Subtle vs filled — when to pick

| Context | Variant |
|---|---|
| One pill, prominent | **filled** |
| 2+ pills visible together | **subtle** |
| Toast / hero banner | **filled** |
| Inline in a doc-row or news-card | **subtle** |
| Sunlight theme + low-emphasis context | **subtle** (renders outlined — preserves max contrast promise) |

### Tappable behavior (`lg` + `onPress`)

- Hit-slop: 6pt top + 6pt bottom (height 32 + 12 = 44 ✓ WCAG 2.5.5).
- Same press feedback as Button: scale 0.97, bg one step darker, 120ms `motion.fast` ease.
- `prefers-reduced-motion`: drop scale, keep bg swap.
- Use case: "Tap **Stale** to refresh now" on a doc-library row.

### Live regions (`live={true}`)

- Adds `aria-live="polite"` to the container — screen reader announces the pill's text when it appears or its content changes.
- Use ONLY for status that changes while the user is on the page (a "Saving…" → "Saved" sequence). Never apply to the 12 status pills in a doc list.
- `aria-atomic="true"` — announce the full pill, not just the changed substring.

### Edge cases

| Case | Behavior |
|---|---|
| `name="syncing"` rendered next to `name="info"` in sunlight (the marginal colorblind pair) | Icons are radically different (RefreshCw vs Info), labels are different ("Sync…" vs "Info"). Indistinguishability is mitigated. |
| Container width < label + icon | Label truncates with `…`; full label exposed via `title` + `aria-label`. |
| `onPress` set on `size="sm"` | TS error at compile time. |
| `prefers-reduced-motion` + `syncing` | Rotation stays (it IS the affordance); pulse drops. |
| Long FR label "Mis à jour hors-ligne il y a 3 jours" on `sm` | Wraps to 2 lines OR truncates per parent layout. Caller is responsible for picking a length that fits. |
| Dynamic Type / Android font scaling to 200% | Icon scales with text; container grows; no overflow. |

---

## 7. Accessibility

### Semantic markup
- Web: `<span role="status">` (non-tappable) / `<button>` (tappable lg).
- RN: `<View accessibilityRole="text">` / `<Pressable accessibilityRole="button">`.

### Screen reader

| State | Announcement |
|---|---|
| Static (default) | **"{label}, status"** (e.g., "Hors-ligne, statut") |
| Live | Re-announced on update via `aria-live="polite"` |
| Tappable | **"{label}, button"** + the `ariaLabel` override if set |
| Icon-only (subtle, dense) | Announces the localized default label (e.g., "Offline") — NEVER announces the icon name |

The icon is decorated via `aria-hidden="true"` — the screen reader gets the label only. This avoids double-announcing.

### Keyboard (tappable `lg` only)
- `Tab` / `Shift+Tab` — focus / blur.
- `Enter` / `Space` — fires `onPress`.

### Touch target
- `sm` / `md` — **not interactive**. No target requirement.
- `lg` + `onPress` — 32pt height + 6pt top + 6pt bottom hit-slop = 44pt. Meets WCAG 2.5.5.

### Color independence (P4 — the contract)
- Icon presence is mandatory.
- Label presence is mandatory for `filled`; defaults to the localized status name.
- Color is the THIRD signal, not the first.

### Motion sensitivity (P4 + motion-sensitivity)
- `syncing` rotation stays under `prefers-reduced-motion: reduce` (rotation IS the affordance — without it, "Sync…" reads as a static label and the user has no signal that anything is happening).
- `pulse` is skipped under `prefers-reduced-motion`.
- `fresh` 3s flash + fade is preserved (it's a transient mount/unmount, not a continuous motion).

---

## 8. Usage guidelines

### Do

- Pick the **status** by what state you're communicating. Pick the **variant** by how many pills you're showing. Pick the **size** by visual emphasis.
- Use `subtle` when 2+ pills are visible together.
- Use the localized default label unless your context needs more — "Hors-ligne" is shorter and clearer than "Sauvegardé pour utilisation hors-ligne" in most contexts.
- Set `live={true}` on toasts that report dynamic state changes.
- Always show the icon. Always.
- For tappable pills (the "Tap Stale to refresh" pattern), use `lg` size.

### Don't

- Don't rely on color alone. The default icon mapping enforces this — don't override `icon` to a same-shape icon for two different statuses.
- Don't use a StatusPill where a Button belongs. A pill is a *signal*; if the primary purpose is action, use Button.
- Don't put `onPress` on `sm` or `md` — TS error.
- Don't set `live={true}` on pills inside a list row (it'd flood the screen reader).
- Don't shrink the icon below 12pt. The sunlight syncing/info disambiguation depends on the icon's distinctness.
- Don't fill the back-office news table with `filled` red `danger` pills — use `subtle` (visual noise; one filled prominent pill in the header is enough).

### Content rules

- **1–2 words** label. The labels in the FR table above are the upper bound.
- **Lowercase or sentence case**, never SCREAMING.
- **No icons in the label text** — the icon slot already has one.
- **No punctuation** — "Hors-ligne" not "Hors-ligne!"

### Related components

- **Button** — for actions. A pill is a signal; a button is a trigger.
- **Toast** (future) — wraps a `lg` `filled` StatusPill with a slide-in/slide-out container. The 60s undo from Button `confirm="undo"` lives here.
- **DocCard** (future) — composes a `subtle` `md` StatusPill in its header.

---

## 9. Verification — what must hold at every release

| Check | How | Pass criterion |
|---|---|---|
| All 8 statuses × 2 variants × 3 themes have AA contrast | `color-audit.ts` extended to cover `feedback.subtle.{name}.{bg, fg}` | 48 pairs, 100% pass |
| Every status has a unique icon | Visual review of the icon mapping table | No two statuses share an icon |
| Sunlight `syncing` vs `info` distinguishable | Side-by-side render under tritanopia simulation (Viénot) | Icons are different shapes; labels differ |
| `lg` tappable hit area ≥ 44pt | DevTools inspect; visual measurement | 32 + 6 + 6 = 44 ✓ |
| `prefers-reduced-motion` skips pulse, keeps rotation | DevTools emulate; observe | Pulse dropped; spin retained |
| Icon-only subtle pill announces full label | Screen reader audit | Announces localized label, not icon name |

---

## 10. Open follow-ups

- [ ] **Color audit extension** — add 48 new pairs to [color-audit.ts](../../design-system-preview/src/lib/color-audit.ts) to cover `feedback.subtle.{name}.{bg, fg}` × 3 themes. Wire into the `/foundations/color` preview.
- [ ] **Toast component** — wraps `lg` `filled` StatusPill + dismiss + undo action. Closes the parent half of the Button `confirm="undo"` contract.
- [ ] **i18n indirection** — the FR/EN label table is hardcoded in the component. When the app introduces a real i18n layer, the default-label lookup moves to a `useLocalizedStatus(name)` hook.
- [ ] **Component-level tokens** — once Card lands and we see `card.status-pill.gap` / `card.status-pill.size` repeated, promote to `component.status-pill.*` per TOKENS.md §3.
- [ ] **Folder convention** — Input lives at `src/components/ds/`, Button + StatusPill at `src/components/ui/`. Decide between `ds` and `ui` before the 4th component lands. (Carried forward from Button.md.)

---

## 11. Changelog

| Date | Version | Change | Skill |
|---|---|---|---|
| 2026-05-28 | 1.0 | First version. 8 statuses × 2 variants × 3 sizes × 3 themes. tokens.ts → v0.6 (added `feedback.subtle.{name}.{bg, fg, border}` across all themes; sunlight subtle = outlined to preserve max contrast). The shape+icon+label trio enforces P4 colour independence; the rotating `syncing` icon is the mitigation for the colorblind audit's marginal sunlight pair. | `design-systems--component-spec` + `adaptive-interfaces--colour-independence` + `inclusive-interaction--feedback-and-status` |

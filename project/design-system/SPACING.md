# FFIE Spacing System

**Status:** v1.0 — scale locked, semantic layer shipped, density modes defined.
**Owner skill:** `ui-design--spacing-system`.
**Source of truth:** [./tokens.ts](./tokens.ts) — `primitives.space` (raw scale) + `semantics.spacing` (inset / stack / inline / gap / gutter + density helpers).
**Preview:** [/foundations/spacing](http://localhost:3001/foundations/spacing) — live samples, density toggle, persona contracts.
**Principles touched:** P1 (field-ready), P3 (search front-door), P4 (a11y floor), P5 (forgive the editor), P6/P7 (public-facing breathability).

---

## 1. What this document does

Three things, in order:

1. **Lock the base unit** (resolves [TOKENS.md §9.1](./TOKENS.md#9-open-questions-surfaced-by-the-taxonomy)).
2. **Layer semantic spacing** on top of the primitive scale — names that describe intent (inset, stack, inline, gap, gutter), not pixel counts.
3. **Define the three density modes** FFIE actually ships (comfortable / compact / spacious) and the rules for when to use each.

The same scale feeds the React Native mobile app (unitless points) and the Next.js back-office (Tailwind/NativeWind `px`). One module, one vocabulary.

---

## 2. Base unit — 4pt (resolved)

> **Decision:** 4pt base, hybrid step: 4pt increments from 0 → 16, 8pt increments from 16 → 80.

### Why 4pt and not 8pt

| | 4pt base | 8pt base |
|---|---|---|
| iOS HIG alignment | ✓ native | ✓ native |
| Material Design alignment | ✓ native | ✓ native |
| Back-office row density (P5 — Sylvie) | ✓ 8/12pt intermediate steps available for tight tables | ✗ either 8 or 16, no middle gear |
| Touch-target arithmetic | ✓ 44/48pt land on the grid | ✗ 44 doesn't fit a pure 8pt step |
| Tailwind utility mapping | ✓ `space.4` = `p-4` = `16pt` | ✗ step numbers diverge from Tailwind |
| Spacing inflation risk | Low — 4pt forces deliberate small steps | High — temptation to default to 16+ everywhere |

The 8pt-only argument is "fewer choices = more consistency." The counter-argument for FFIE specifically is **Sylvie's back-office tables** (P5) — they need 8pt and 12pt row paddings, not just 8 and 16. A 4pt base gives us the intermediate steps without giving up the discipline; the **semantic tier** (§4) does the consistency work that "fewer primitives" would otherwise do for us.

### The scale

```
space.0   = 0       hairline / no gap
space.1   = 4       icon-text gap inside a pill
space.2   = 8       compact row padding, min adjacent-target gap
space.3   = 12      default inline gap between buttons
space.4   = 16      default card / button / form padding ← MOST-USED STEP
space.5   = 20      uncommon — reserve for type-baseline-aligned outliers
space.6   = 24      modal padding, card-grid gap
space.8   = 32      between landing-page columns, large card pad
space.10  = 40      between major page sections, hero inset
space.12  = 48      primary touch target height (P1)
space.16  = 64      between top-level page regions
space.20  = 80      hero block top/bottom margin on desktop
```

Note the skipped numbers (`7`, `9`, `11`, …). Steps that aren't in the scale **don't exist**. Don't reintroduce them.

---

## 3. The 3-tier rule (recap from TOKENS.md §3)

```
Primitive  →  Semantic        →  Component
space.4       inset.default      button.padding.x
              stack.section      news-card.gap
              gutter.mobile      doc-list.row-padding
```

- **Primitives** (`primitives.space.*`) are raw, context-free numbers. Used by the design system team and Figma. Rarely referenced from product code.
- **Semantics** (`semantics.spacing.*`) are purpose-anchored: *what is this space for?* Components read these.
- **Component tokens** are slot-scoped (`button.padding.x`). Defined per-component in Stage 3 specs.

If you ever find yourself writing `padding: tokens.primitives.space[4]` inside a component, you've skipped a tier. Add a semantic (or a component token) instead.

---

## 4. Semantic spacing — the four families

There are four spatial *jobs*. Each has its own scale.

### 4.1 Inset — padding INSIDE a container

> The space between a container's edge and its content.

| Token | Value | Use |
|---|---|---|
| `inset.none` | 0 | Flush content (full-bleed images, `inset.x` for image cards) |
| `inset.tight` | 4 | Chip/tag inner padding around an icon |
| `inset.compact` | 8 | Dense rows, status pills, table cells (P5 — Sylvie's tables) |
| `inset.default` | 16 | Most cards, buttons, fields, form rows (P1 — Julien's mobile) |
| `inset.comfortable` | 24 | Modals, hero cards, member-facing detail panes |
| `inset.spacious` | 32 | Landing-page sections, empty states (P7 — public substance) |
| `inset.hero` | 40 | Public-marketing hero block padding |

### 4.2 Stack — VERTICAL space between stacked elements

> The "rhythm" of a vertical layout.

| Token | Value | Use |
|---|---|---|
| `stack.none` | 0 | Visually attached (label flush against control) |
| `stack.tight` | 4 | Label → control |
| `stack.snug` | 8 | Adjacent paragraphs in a dense back-office row |
| `stack.default` | 16 | Internal rhythm inside a card or form |
| `stack.loose` | 24 | Between sub-sections within a section |
| `stack.section` | 40 | Between major sections (feed cards, doc groups) |
| `stack.page` | 64 | Between top-level page regions (hero → first content block) |

### 4.3 Inline — HORIZONTAL space between row-direction elements

| Token | Value | Use |
|---|---|---|
| `inline.none` | 0 | Visually attached siblings |
| `inline.tight` | 4 | Icon → label inside a pill |
| `inline.snug` | 8 | Icon → text in a row item; **MIN gap between two adjacent tappable targets** (P4 — never less, or zoom-200% collapses them) |
| `inline.default` | 12 | Between adjacent buttons in a toolbar |
| `inline.loose` | 16 | Between toolbar groups |
| `inline.wide` | 24 | Between major top-bar regions |

### 4.4 Gap — for grid/flex `gap` and RN auto-layout

> Direction-agnostic. Use when the gap applies to both row and column flow.

| Token | Value | Use |
|---|---|---|
| `gap.tight` | 4 | Within a tightly-coupled cluster |
| `gap.snug` | 8 | Between related controls |
| `gap.default` | 12 | Chip cloud, button row |
| `gap.loose` | 16 | Form-field grid |
| `gap.grid` | 24 | Card grid (doc library, news feed) |
| `gap.section` | 32 | Between landing-section columns on desktop |

---

## 5. Gutter — page-level horizontal margins

The space between the viewport edge and the content column. Sized per breakpoint per **P1** (one-handed reach on mobile) + Sylvie's back-office readability.

| Token | Value | Breakpoint | Rationale |
|---|---|---|---|
| `gutter.mobile` | 16 | `< sm` (640) | Julien's one-handed worksite use — leaves the thumb-zone clear |
| `gutter.tablet` | 24 | `sm – md` (640–768) | iPad / large phone landscape |
| `gutter.desktop` | 32 | `md – xl` (768–1280) | Back-office default — Sylvie's monitor |
| `gutter.wide` | 40 | `≥ xl` (1280+) | Large desktop — keeps line lengths readable |

Implementation pattern (web, NativeWind class):

```tsx
<main className="px-4 sm:px-6 md:px-8 xl:px-10">
  {/* gutter.mobile, gutter.tablet, gutter.desktop, gutter.wide */}
</main>
```

React Native: read directly from `semantics.spacing.gutter.mobile` (mobile-only consumer).

---

## 6. Density modes

> A density mode is a **one-step shift** across the semantic spacing scales. It is NOT a separate token tree.

```ts
density = {
  comfortable: 0,    // default — no shift
  compact:    -1,    // one step DOWN in each family
  spacious:   +1,    // one step UP in each family
}
```

### When to use each

| Mode | Context | Example | Principle |
|---|---|---|---|
| **comfortable** (default) | Member-facing mobile, public news feed, doc cards | Most of the mobile app | P1 — Julien on a worksite |
| **compact** | Back-office data tables, audit logs, admin lists | News-management table for Sylvie | P5 — give the editor density without giving up legibility |
| **spacious** | Public landing sections, onboarding, empty states | "Discover the trades" homepage | P7 — substance over brochure copy; room to scan |

### Density shift, worked

A `<Card padding="default">` rendered at three densities:

| Mode | Resolves to | Value |
|---|---|---|
| comfortable | `inset.default` | 16 |
| compact | `inset.compact` (one step down) | 8 |
| spacious | `inset.comfortable` (one step up) | 24 |

The helper:

```ts
import { withDensity } from "@tokens";

withDensity("inset",  "default", "compact")   // → 8
withDensity("stack",  "default", "spacious")  // → 24 (stack.loose)
withDensity("inline", "snug",    "compact")   // → 4  (inline.tight)
```

Density clamps at the ends of each scale — `compact` of `none` stays `none`; `spacious` of `hero` stays `hero`.

### What density does NOT shift

- **`gutter.*`** — page gutters are tied to breakpoint, not density.
- **Touch targets** — `target.primary` (48) and `target.secondary` (44) are accessibility floors and **never shrink**, even in compact mode (P4 — accessibility is a floor, not a ceiling).
- **`inline.snug`** when used as the minimum adjacent-tappable-target gap — that 8pt is also a floor (P4). Code reviewers: if you see `inline.tight` between two buttons, flag it.

---

## 7. Persona-anchored rules (the load-bearing ones)

These are the rules a reviewer should be able to recite without opening this doc.

| # | Rule | Anchor | Why it breaks if violated |
|---|---|---|---|
| 1 | Mobile gutter = `gutter.mobile` (16) | P1 / Julien | Anything tighter eats into one-handed thumb reach; anything wider wastes screen on a 5.5" phone in a glove |
| 2 | Primary touch target = 48pt, secondary = 44pt, **never compressed by density** | P1 + P4 | Misses Julien gloved; misses WCAG 2.5.5 |
| 3 | Minimum gap between two adjacent tappable targets = `inline.snug` (8) | P4 | At 200% zoom the targets merge and become unhittable for low-vision users |
| 4 | Status pills (offline / syncing / stale) get `inline.snug` (8) from surrounding text — never flush | P2 | Pill reads as part of the sentence, not as system state |
| 5 | Search bar gets `stack.section` (40) above the first result list | P3 | Hierarchy goes away — search stops feeling like the front door |
| 6 | Destructive-action confirmation modals use `inset.comfortable` (24) | P5 / Sylvie | Tight modals correlate with mis-taps; breathing room reduces error rate |
| 7 | Public landing sections use `stack.section` (40) between content blocks | P6 + P7 | Public visitors scroll-skim; tight rhythm reads as a wall of text |
| 8 | Back-office data tables use `density="compact"` — row padding `inset.compact` (8) | P5 | Sylvie sees 12 news items per screen instead of 6; fewer scrolls when fact-checking |

---

## 8. Application reference — what to use where

### Cards (mobile member feed)
- Outer: `inset.default` (16) padding
- Header → body: `stack.default` (16)
- Body paragraphs: `stack.snug` (8)
- Card-to-card in feed: `gap.grid` (24) via the list's `gap`

### Doc-library row (mobile)
- Row padding (vertical): `inset.default` (16) — keeps row >48pt total
- Row padding (horizontal): `gutter.mobile` (16)
- Icon → title: `inline.snug` (8)
- Title → status pill: `inline.snug` (8) — see Rule #4

### Back-office news table (Sylvie)
- Container: `density="compact"`
- Row padding: `inset.compact` (8) — 4pt-fine resolution kicks in here
- Column gap: `inline.default` (12)
- Page gutter: `gutter.desktop` (32)

### Public landing — "Discover the trades"
- Container: `density="spacious"`
- Section padding: `inset.spacious` (32) on mobile, `inset.hero` (40) on desktop
- Section-to-section: `stack.section` (40)
- Hero top/bottom: `space[20]` (80) on desktop — single primitive use, documented exception

### Destructive confirmation modal (Sylvie unpublishes news)
- Modal padding: `inset.comfortable` (24) — Rule #6
- Title → body: `stack.default` (16)
- Body → actions: `stack.loose` (24)
- Cancel → Delete button gap: `inline.default` (12) — Cancel always on the left, primary action on the right per RN platform convention

---

## 9. Testing

These are the checks a future PR should pass. They map to the persona rules above.

| Check | How to verify | Owner |
|---|---|---|
| Zoom to 200% on web — no two interactive targets touch | Manual; browser zoom 200%; tab through; check focus rings don't merge | Code reviewer |
| All primary touch targets ≥ 48pt | Inspector hover; React Native: `LayoutRectangle.height` | QA |
| Back-office news table shows ≥ 10 items at desktop default zoom | Visual check at 1440×900 | Sylvie's UX rep |
| Search bar has 40pt clear vertical space below it on mobile | Mobile preview at 390×844 | Designer |
| No raw `padding: 16` or `marginTop: 24` in component code | `rg "padding: \d+" src/` should return 0 outside tokens.ts and the preview app | CI lint (future) |

---

## 10. RN-specific notes

- Spacing values are **unitless numbers**. RN consumes them as device-independent pixels (`pt` on iOS, `dp` on Android). The web layer appends `px`.
- Gutters are **not** affected by Dynamic Type / Android font scale — only typography is. The horizontal layout stays put when a user scales the font.
- `withDensity()` is sync and pure — safe to call in render. No memoization needed for primitive numeric returns.
- For NativeWind, density is resolved at theme-context level (not via CSS custom properties — RN doesn't have them). See [TOKENS.md §6 RN gotchas](./TOKENS.md#6-rn-specific-gotchas-that-shaped-the-token-design).

---

## 11. Open follow-ups

- [ ] **Component-tier spacing tokens** — emerge during `design-systems--component-spec` work in Stage 3. Each component spec defines its own `padding.x`, `padding.y`, `gap` slots in terms of the semantic tier here.
- [ ] **Density-aware Tailwind plugin** for the back-office — currently density is a TS-level helper; a Tailwind plugin (`density="compact"` ⇒ `data-density="compact"` attribute → variant) would let us write `compact:p-2` directly. Defer until first back-office screen is built.
- [ ] **Lint rule against raw `primitives.space.*` in components.** Add an ESLint custom rule when the component layer is large enough to warrant it.
- [ ] **Field test gutter.mobile on Julien's actual phones** at the same checkpoint as the sunlight-theme field test (logged in [STATE.md](../STATE.md)).

---

## 12. Changelog

| Date | Version | Change | Skill |
|---|---|---|---|
| 2026-05-28 | 1.0 | Initial system. 4pt base resolved. Semantic spacing (inset/stack/inline/gap/gutter) + density modes (comfortable/compact/spacious) + `withDensity()` helper added to `tokens.ts`. | `ui-design--spacing-system` |

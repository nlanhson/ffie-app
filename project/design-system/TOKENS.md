# FFIE — Design Token Taxonomy & Naming Convention

**Project:** FFIE — Fédération Française des Intégrateurs Électriciens — mobile app + back-office
**Date:** 2026-05-28
**Skill:** `design-systems--design-token` (taxonomy phase — not yet implementation)
**Status:** v0.1 Draft. Taxonomy only. Concrete values (hexes, px, ms) come in the next three skills: `ui-design--color-system`, `ui-design--typography-scale`, `ui-design--spacing-system`.
**Stack:** TypeScript everywhere — React Native + Expo (mobile), Next.js (back-office). Token output is a TS module consumable by NativeWind / Tailwind / RN `StyleSheet`.
**Source inputs:** [DESIGN_BRIEF.md](../brief/DESIGN_BRIEF.md), [PERSONAS.md](../brief/PERSONAS.md), [DESIGN_PRINCIPLES.md](../brief/DESIGN_PRINCIPLES.md), [STATE.md](../STATE.md).

---

## 0. Why this document exists (and why first)

Tokens are the **atomic vocabulary** every other design artifact references — colors, type, spacing, shadows, motion. If we pick colors before deciding the taxonomy, we will refactor every color name three months from now when we add the sunlight theme variant. If we pick spacing before agreeing on the base unit and scale, components will have inconsistent padding. **Taxonomy precedes values.**

This doc does three things and only three:
1. Defines the **3-tier token model** (primitive → semantic → component) and explains the why.
2. Lists the **categories** of tokens we will produce and the **project-specific tokens** that fall straight out of the principles (P1–P7).
3. Locks the **naming convention** (kebab in docs, dot-paths in TS) and the **TS export shape**.

It does **not** assign hex values, px scales, or font sizes. Those come next.

---

## 1. The 3-tier model

We are using three tiers, not two. Two-tier (primitive → semantic) is enough for a single-product, single-theme design system. We have **two products** (mobile + back-office), **multiple themes** (light, dark, sunlight high-contrast), and **a known brand-identity gap** that will arrive late and need to be absorbed without component-level rewrites. Three tiers earns its complexity here.

| Tier | What it is | Example | Who touches it |
|---|---|---|---|
| **1. Primitive** | Raw, context-free values. The palette / scale itself. | `gray.100`, `blue.500`, `space.4`, `radius.md`, `duration.150` | Design system team only. Rarely changes. |
| **2. Semantic** | Purpose-driven aliases. Reference primitives, never raw values. Theme-swappable. | `surface.default`, `text.body`, `action.primary`, `border.subtle`, `feedback.danger` | Designers + theme authors. Changes when a theme is added. |
| **3. Component** | Slot-scoped tokens for a single component. Reference semantics, never primitives. | `button.primary.bg`, `searchbar.icon.color`, `news-card.surface` | Component authors. Changes per component spec. |

### Why 3-tier, not 2-tier — the FFIE-specific argument

- **Theme swap without component edits.** When FFIE delivers brand colors, only the **semantic tier** rebinds (`action.primary` now points at `brand.500` instead of `blue.500`). Components don't move. This is the brand-gap insurance policy.
- **Sunlight variant is a clean override.** P1 + P4 demand a high-contrast outdoor mode. With three tiers, the sunlight theme is just an alternative semantic-tier bindings file. Without three tiers, every component would need a sunlight-aware conditional.
- **Mobile and back-office can share primitives and semantics, diverge at components.** A `button.primary.bg` token in Expo can resolve to one rendering path; the same semantic in Next.js can resolve to another. Sharing the bottom two tiers means the back-office never drifts visually from the app.
- **It's defensible to engineers.** Three named layers are easier to enforce in TS types than "use the semantic one, except sometimes the primitive." Components import only from `tokens.component.*` and `tokens.semantic.*`. Primitives are not exported to component code.

### Hard rule
**Components MUST NOT import primitives directly.** The lint rule and the TS module shape (see §6) enforce this. If a component needs a value that has no semantic, we create the semantic first, then bind the component to it. No skipping a tier.

---

## 2. Categories

The token system has nine categories. Each is named, scoped, and justified below. Concrete scales come in subsequent skills.

| Category | Purpose | Primitive examples | Semantic examples | Component examples |
|---|---|---|---|---|
| **color** | Palette, surface, text, border, feedback, brand | `gray.50–900`, `blue.50–900`, `red.50–900`, `green.50–900`, `amber.50–900`, `brand.50–900` (slot, FFIE TBD) | `surface.default`, `surface.elevated`, `surface.sunken`, `text.body`, `text.muted`, `text.inverse`, `border.default`, `border.subtle`, `action.primary`, `action.primary.hover`, `feedback.success`, `feedback.warning`, `feedback.danger`, `feedback.info` | `button.primary.bg`, `searchbar.bg`, `news-card.border`, `doc-row.icon` |
| **typography** | Font family, size, weight, line-height, letter-spacing | `font.family.sans`, `font.family.mono`, `font.size.50–900`, `font.weight.regular/medium/semibold/bold`, `font.lineHeight.tight/normal/relaxed`, `font.letterSpacing.tight/normal/wide` | `text.body`, `text.body-strong`, `text.caption`, `text.heading.1–6`, `text.code`, `text.label` | `button.label`, `searchbar.input`, `news-card.title` |
| **spacing** | Inset, stack, inline — the layout currency | `space.0`, `space.1` (4pt), `space.2` (8pt), `space.3` (12pt), `space.4` (16pt) … `space.12` (48pt+) | `inset.compact`, `inset.default`, `inset.comfortable`, `stack.tight`, `stack.default`, `stack.loose` | `button.padding.x`, `card.padding`, `screen.gutter` |
| **sizing** | Touch target floors, icon sizes, control heights | `size.touch.min` (44pt), `size.touch.comfortable` (48pt), `size.icon.xs/sm/md/lg/xl`, `size.control.sm/md/lg` | `target.primary` (= 48pt — P1), `target.secondary` (= 44pt), `icon.inline`, `icon.standalone` | `button.height`, `searchbar.height`, `tab-bar.height` |
| **radius** | Corner roundness scale | `radius.none/xs/sm/md/lg/xl/full` | `radius.control`, `radius.card`, `radius.pill`, `radius.modal` | `button.radius`, `news-card.radius` |
| **elevation** | Shadow levels (iOS) + Android compatibility | `shadow.0–5` with platform-specific definitions (see §5) | `elevation.flat`, `elevation.raised`, `elevation.floating`, `elevation.overlay` | `card.shadow`, `modal.shadow`, `tab-bar.shadow` |
| **motion** | Duration + easing for transitions and micro-interactions | `duration.instant` (0ms), `duration.fast` (100ms range), `duration.base` (200ms range), `duration.slow` (300ms range); `easing.standard`, `easing.entrance`, `easing.exit`, `easing.emphasized` | `motion.feedback.tap`, `motion.transition.screen`, `motion.toast.enter` | `button.press.duration`, `modal.enter.easing` |
| **opacity** | Alpha levels for disabled, pressed, stale states | `opacity.0/20/40/60/80/100` | `opacity.disabled`, `opacity.pressed`, `opacity.stale`, `opacity.scrim` | `button.disabled.opacity`, `doc-row.stale.opacity` |
| **breakpoints** | Back-office only; mobile is device-driven | `bp.sm/md/lg/xl/2xl` | `container.narrow`, `container.default`, `container.wide` | `layout.sidebar.width` |

### Categories explicitly NOT included

- **z-index** — Handled at the elevation tier and per-platform stacking. Avoids the "z-index: 9999" tarpit.
- **gradients** — Not a Phase 1 need. If we add them, they go under `color` as a primitive sub-scale.
- **blurs** — Not a Phase 1 need.

---

## 3. Project-specific tokens (straight from the principles)

These are the tokens that exist **because** of the FFIE principles. They are not optional. They are the design system's commitment to the principles in machine-readable form.

| Token | Tier | Comes from | Why it exists | Resolves to (initial intent) |
|---|---|---|---|---|
| `size.touch.comfortable` → `target.primary` | primitive → semantic | **P1** (Field-ready, gloved hands) | Hard floor for primary actions. Every primary CTA imports this, not a raw number. | `48` (unitless pt/px, see §5) |
| `size.touch.min` → `target.secondary` | primitive → semantic | **P1**, P4 (WCAG 2.5.5 / 2.5.8) | Absolute floor for any tappable element, including icon-only buttons. | `44` |
| `feedback.offline` | semantic | **P2** (Offline-first) | Sync-status indicator color. Calm by default, never red unless action required. | A muted slate, not red |
| `feedback.syncing` | semantic | **P2** | "Syncing now" state — distinct from offline and from success. | A calm blue/teal |
| `feedback.stale` | semantic | **P2** | Cached-but-old indicator color, used on docs and news cards past freshness threshold. | An amber that does NOT read as warning |
| `opacity.stale` | semantic | **P2** | Visual de-emphasis for stale cached content. | `0.6`–`0.7` range |
| `state.gated.public` | semantic | **P6, P7** (No login wall on public; show value before relationship) | Visual treatment for content visible to public — equal visual quality to gated content, not "demo mode." | Full opacity, full color |
| `state.gated.member-only` | semantic | **P6, P7** | Locked-content treatment that is INFORMATIVE, not punitive — shows preview metadata (counts, categories), badge color from `feedback.info`. | A distinct badge + lock glyph, not a blur |
| `action.destructive` | semantic | **P5** (Forgive the editor) | Color slot for delete/deprecate/revoke buttons. Distinct from `feedback.danger` (which is informational). Always paired with `motion.confirm.delay`. | Red family, AAA contrast on white |
| `action.destructive.confirm.bg` | component | **P5** | Background of the typed-confirmation final button (e.g., "Send to 6,432 members"). | Same red family, intentionally large surface |
| `feedback.undo.bg` | semantic | **P5** | Background of the 60-second undo toast. Persistent, calm, not green-success. | Neutral dark with high text contrast |
| `motion.undo.duration` | semantic | **P5** | The 60s window itself, as a token so it's not a magic number scattered in code. | `60000` (ms) |
| `motion.confirm.delay` | semantic | **P5** | Minimum delay before the destructive final-action button becomes interactive (typed-confirmation already enforces this, this is the visual cue). | `400`–`600` ms |
| `theme.contrast-mode.sunlight` | theme | **P1 + P4** | Entire alternative semantic-tier binding for outdoor worksite use. Activated by OS high-contrast toggle OR in-app switch reachable without re-auth. | See §4 |
| `theme.contrast-mode.standard` | theme | default | Light theme, WCAG AA min, AAA on body text where layered surfaces allow. | See §4 |
| `theme.contrast-mode.dark` | theme | P1 (Julien evening reading) | Dark theme, lighter surfaces for elevation (not shadows), desaturated colors. | See §4 |

### Why these and not others
- We are not pre-defining `feedback.success.muted` or `surface.elevated.alpha` — they don't trace to a principle. Add them only when a component spec demands one.
- `action.destructive` is intentionally distinct from `feedback.danger`. Danger = "the system reports a problem" (a red toast). Destructive = "the user is about to do something irreversible" (a red button). Conflating them is the most common design-system mistake here and produces UX where a "save" success toast looks the same color as a "delete forever" button.

---

## 4. Theming model — three modes from day one

Theme = an alternative binding of the **semantic tier** to **primitives**. Components do not know which theme is active; they read the semantic.

| Theme | Trigger | Why | Notes |
|---|---|---|---|
| `standard` (light) | Default | The base experience. AA min, AAA body text where possible. | Brand colors live here; sunlight + dark inherit and override. |
| `dark` | OS preference (`useColorScheme()` in Expo, `prefers-color-scheme` in Next) + in-app toggle | Julien's evening reading; reduced eye strain; OS-respecting | Lighter surfaces for elevation, not shadows. Desaturated colors. Test text legibility at every step. |
| `sunlight` | OS high-contrast toggle (`AccessibilityInfo.isHighTextContrastEnabled` on iOS; `prefers-contrast: more` on web) **OR** in-app toggle reachable without re-auth (P1 explicit) | Bright outdoor worksites (P1, P4) | Maximum contrast. Reduced color palette. Heavier typography weights. Borders instead of shadows for elevation. Not just "darker light mode" — a real third theme. |

### Future themes (slots reserved, no work now)
- `brand.ffie` — drops in when FFIE provides the brand palette. Currently the `brand.*` primitive scale is a placeholder (likely a neutral indigo/teal that won't embarrass us if it ships unchanged).
- `density.comfortable` / `density.compact` — back-office only, Phase 2 candidate. Sylvie's bifocals argue for `comfortable` as default.

---

## 5. React Native specifics (the platform tax)

Tokens designed for the web do not translate 1:1 to RN. The following choices are deliberate and load-bearing.

### Units — no `rem`, no `em`, no strings
RN's `StyleSheet` accepts **unitless numbers** interpreted as density-independent pixels (`dp` on Android, `pt` on iOS, effectively equivalent for sizing decisions). Tokens are exported as **numbers**, not strings.

```ts
// CORRECT
space: { 4: 16 }

// WRONG — breaks RN
space: { 4: "16px" }
```

NativeWind and Tailwind preset configs in the back-office can wrap these numbers as `"${n}px"` at build time. The **primitive tokens stay unit-free**.

### Shadows — split iOS / Android
iOS uses `shadowColor / shadowOffset / shadowOpacity / shadowRadius`. Android uses `elevation` (single integer). Web (back-office) uses `box-shadow` string. The elevation token is a **structured object**, not a string:

```ts
elevation.raised = {
  ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  android: { elevation: 3 },
  web: "0 2px 8px rgba(0,0,0,0.08)"
}
```

A helper `applyElevation(token)` picks the right shape based on `Platform.OS` (or builds the CSS at compile time on web).

### Touch targets — pt, not px, but stored as numbers
`size.touch.comfortable = 48` means 48 dp on Android, 48 pt on iOS. Numerically identical for token storage. The semantic name `target.primary` is what components reference.

### Font scaling — Dynamic Type vs `allowFontScaling`
RN respects iOS Dynamic Type and Android font scale by default when `allowFontScaling` is not set to false. P4 makes this non-negotiable: **we do not disable font scaling globally**. Tokens define the base size; user OS preference scales them up to 200%. Components must reserve space for that.

### Colors — strings, no alpha shorthand
Use full hex with alpha (`#RRGGBBAA`) or `rgba()`. RN supports both. Avoid CSS 4 `#RGBA` shorthand — older RN engines choke on it.

### Motion — durations as numbers (ms), easing as Bezier tuples or named curves
RN's `Animated` and Reanimated accept ms numbers and easing functions, not CSS strings. Tokens export numbers and `[number, number, number, number]` Bezier control points; a wrapper resolves them to `Easing.bezier(...)` or `cubic-bezier(...)` at the platform boundary.

### No CSS variables on mobile
CSS custom properties don't exist in RN. Theming is done by **swapping the imported semantic-tier module** at the React Context boundary (`ThemeProvider`), not by CSS variable cascade. The back-office, being web, can do either; we choose context-based theming for symmetry with mobile.

---

## 6. Naming convention

### The rules

| Where | Style | Example |
|---|---|---|
| Documentation (this doc, Figma, Markdown) | `kebab-case` with dot separators for hierarchy | `action-primary-bg`, `text-body`, `space-4`, `surface-default` |
| TypeScript exports | nested object, dot-path access | `tokens.color.action.primary.bg`, `tokens.space[4]`, `tokens.text.body` |
| Tailwind / NativeWind class names (back-office, mobile via NativeWind) | kebab, hyphen-separated, matches TS path | `bg-action-primary`, `text-body`, `p-4`, `rounded-card` |
| Figma variable names | dot-paths, matches TS path | `color.action.primary.bg`, `space.4` |
| Code Connect mappings | matches TS path exactly | `tokens.color.action.primary.bg` |

### The pattern

`{category}.{group}.{role}.{variant?}.{state?}`

Examples:
- `color.action.primary.bg` — category `color`, group `action`, role `primary`, slot `bg`
- `color.action.primary.bg.hover` — same, hover state
- `color.text.body` — category `color`, group `text`, role `body`
- `motion.duration.base` — category `motion`, group `duration`, role `base`
- `space.4` — category `space`, scalar `4` (the 4th step of the spacing scale)

### Why kebab-in-docs + dot-paths-in-TS

- **Kebab is the universal CSS/Tailwind convention.** Designers read it without context-switching from Figma. Engineers writing utility classes (NativeWind / Tailwind) match it 1:1.
- **Dot-paths in TS** give us **autocomplete, type safety, and grep-ability**. `tokens.color.action.primary.bg` jumps to the definition. A string like `"color-action-primary-bg"` does not.
- **They are mechanically convertible.** A simple build step generates Tailwind config from the TS module, and vice-versa. No drift.

### What NOT to do
- ❌ Camel-case in tokens: `actionPrimaryBg` — breaks Tailwind, breaks CSS, breaks Figma variable autocomplete.
- ❌ Abbreviations: `act.pri.bg` — un-scannable; Sylvie-on-the-back-office equivalent of writing trade jargon to a client.
- ❌ Visual-property names: `color.blue.500` used as a semantic. Use `color.action.primary` instead. Blue may not stay blue.
- ❌ State-as-prefix: `hover.button.bg`. State is the **last** segment. State precedence reads left-to-right: category first, state last.
- ❌ Numbers without a scale: `space-medium`. Always `space.4`. "Medium" drifts; `4` is anchored to a base unit.

### Naming for the FFIE-specific tokens (P1–P7)
- Sunlight contrast variant: `theme.contrast-mode.sunlight` (not `theme.high-contrast` — "sunlight" is the actual use case Julien lives in; the name should encode the principle).
- Member-only gating: `state.gated.member-only` (not `state.locked` — "locked" reads punitive; "gated.member-only" reads informational, matching P6/P7).
- Undo banner: `feedback.undo.bg` (not `toast.undo.bg` — the undo *is* the feedback, not a generic toast).

---

## 7. TS export shape (sketch, not the implementation)

This is the shape the next-stage implementation will produce. **One short illustrative block** — full module comes during `ui-design--color-system` and after.

```ts
// design-system/tokens/primitive.ts
export const primitive = {
  color: {
    gray:   { 50: "#F8FAFC", 100: "#F1F5F9", /* ... */ 900: "#0F172A" },
    blue:   { 50: "#EFF6FF", /* ... */ 500: "#3B82F6", /* ... */ 900: "#1E3A8A" },
    red:    { /* ... */ },
    green:  { /* ... */ },
    amber:  { /* ... */ },
    brand:  { /* FFIE TBD — neutral indigo placeholder */ },
  },
  space:  { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 },
  radius: { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  size: {
    touch:  { min: 44, comfortable: 48 },
    icon:   { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 },
  },
  duration: { instant: 0, fast: 120, base: 200, slow: 320, undo: 60000 },
  // ... font, easing, opacity, breakpoints
} as const;

// design-system/tokens/semantic.standard.ts
import { primitive as p } from "./primitive";
export const semantic = {
  surface: {
    default:  p.color.gray[50],
    elevated: "#FFFFFF",
    sunken:   p.color.gray[100],
  },
  text: {
    body:    p.color.gray[900],
    muted:   p.color.gray[600],
    inverse: p.color.gray[50],
  },
  action: {
    primary:     { bg: p.color.brand[500], fg: "#FFFFFF" },
    destructive: { bg: p.color.red[600],   fg: "#FFFFFF" },
  },
  feedback: {
    offline: p.color.gray[500],
    syncing: p.color.blue[500],
    stale:   p.color.amber[500],
    undo:    { bg: p.color.gray[900], fg: p.color.gray[50] },
  },
  target: { primary: p.size.touch.comfortable, secondary: p.size.touch.min },
} as const;

// design-system/tokens/index.ts
export const tokens = { primitive, semantic /* , component */ } as const;
export type Tokens = typeof tokens;
```

Components import only from `semantic` (or a `component` layer that itself imports `semantic`). A lint rule will block primitive imports outside `semantic.*.ts` files. `as const` gives us autocomplete + literal-typed values without runtime cost.

Alternative themes (`dark`, `sunlight`) are sibling files with the same shape (`semantic.dark.ts`, `semantic.sunlight.ts`). A `ThemeProvider` selects which one is in scope.

---

## 8. What this taxonomy does NOT solve (yet)

Calling these out so the next skills know what they own:

- **Concrete color values** — owned by `ui-design--color-system`. Must produce: primitive palette (with named ramps), three theme bindings (`standard`, `dark`, `sunlight`), AAA body-text combos catalogued, contrast tested against P4.
- **Concrete type scale** — owned by `ui-design--typography-scale`. Must produce: font family decision (probably system font on mobile + a neutral sans on web until FFIE specifies), modular scale, line-heights, French copy length budget (French is ~20% longer than English on average — labels need headroom).
- **Concrete spacing scale** — owned by `ui-design--spacing-system`. Must produce: base unit decision (see open question below), full scale, thumb-zone application rules.
- **Component tokens** — owned per-component during `design-systems--component-spec` invocations later (Stage 3+). The `component.*` tier stays empty in this doc.
- **Icon sizes — final** — sketched here (`size.icon.xs–xl`), pinned during `design-systems--icon-system` later.

---

## 9. Open questions surfaced by the taxonomy

These are decisions that must be made in the next skills, flagged here so we don't lose them.

1. ~~**4pt base or 8pt base for the spacing scale?**~~ **Resolved 2026-05-28** → 4pt base with hybrid step (4pt from 0–16, 8pt from 16+). Full rationale + semantic layer (inset/stack/inline/gap/gutter + density modes) in [./SPACING.md](./SPACING.md).
2. **System font on mobile (SF Pro / Roboto via system) vs custom sans (e.g., Inter)?** System fonts are smaller bundle, native feel, free Dynamic Type. Custom sans is brand control. Recommend **system fonts until FFIE provides a brand type**; brand type plugs into the same semantic. Decide in `ui-design--typography-scale`.
3. **Brand color placeholder hue?** Suggesting a neutral indigo (`#3B5BDB` family) — professional, neither too "tech" nor too "construction-orange," will not clash with whatever FFIE eventually provides. Decide in `ui-design--color-system`.
4. **Sunlight theme — separate file or runtime modifier?** Recommend separate file (`semantic.sunlight.ts`) for clarity and reviewability. Confirm with engineering before lock-down.
5. **Brand assets ETA from FFIE.** Outstanding from Open Question §7.4 in the brief. Until they arrive, the `brand.*` primitive scale stays as a labeled placeholder. The taxonomy already supports a one-file swap.

---

## 10. Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-05-28 | 0.1 | Initial taxonomy draft. 3-tier model, 9 categories, FFIE-specific tokens from P1–P7, naming convention locked, TS shape sketched. | design-system-architect |

---

## Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| FFIE — Communications & Digital Lead | _TBD_ | | |
| Studio — Lead Designer | _TBD_ | | |
| Studio — Engineering Lead | _TBD_ | | |

*Taxonomy drafted by design-system-architect, 2026-05-28. To be reviewed before `ui-design--color-system` begins.*

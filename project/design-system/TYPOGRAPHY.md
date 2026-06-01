# FFIE Typography

**Version:** 1.0 (matches `tokens.ts` v0.3)
**Last updated:** 2026-05-28
**Skill of record:** `ui-design--typography-scale`
**Source of truth:** [`tokens.ts`](./tokens.ts) — this document explains the methodology and contracts. If they disagree, `tokens.ts` wins.

---

## 1. Methodology

Three layers, just like color:

| Layer | What lives here | Files |
|---|---|---|
| **Primitives** | Raw scales — `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacings`, `fontFamilies`. Unitless throughout for RN/web portability. | `tokens.ts` |
| **Roles (textStyles)** | Semantic compositions of primitives — `display.lg`, `heading.h1`, `body.md`, `eyebrow`, etc. Components reference these names, never the raw primitives. | `tokens.ts` |
| **Renderers** | Web (next/font + CSS vars) and React Native (`useFonts` + `Text` style consumption). | preview app + future RN bridge |

Audited live at [`/foundations/typography`](http://localhost:3001/foundations/typography) — the Dynamic-Type simulator there scales every specimen at 100% / 115% / 135% / 200% so we can see WCAG 1.4.4 compliance at a glance.

## 2. Scale

The fontSize ramp uses a **~1.25 modular scale on a 16pt base**, with whole-number rounding:

| Token | Size | Ratio from previous | Drift from pure 1.25 |
|---|---|---|---|
| `xs`   | 12pt | — | — |
| `sm`   | 14pt | 1.167 | −6.7% |
| `base` | 16pt | 1.143 | −8.6% |
| `lg`   | 20pt | 1.250 | 0% |
| `xl`   | 24pt | 1.200 | −4% |
| `2xl`  | 30pt | 1.250 | 0% |
| `3xl`  | 36pt | 1.200 | −4% |
| `4xl`  | 48pt | 1.333 | +6.7% |

**Decision:** keep these values. The drift exists because we round to safe whole-number sizes — a pure 1.25 scale from 16 would give 25pt for `xl`, 31.25pt for `2xl`, 39pt for `3xl`. Those are arithmetically pure but render poorly and don't match the sizes designers and developers expect. Tailwind, Material, IBM Carbon and Atlassian DS all make the same call.

## 3. Role table (semantic)

Components reference these by name. Each role is a composition of `{ fontFamily, fontSize, lineHeight, fontWeight, letterSpacing }` and optionally `textTransform`.

| Role | Family | Size | LH | Weight | LS | Use |
|---|---|---|---|---|---|---|
| `display.lg` | display | 48 | 1.2 | 700 | −0.025em | Marketing hero, page splash |
| `display.md` | display | 36 | 1.2 | 700 | −0.010em | Page hero, section opener |
| `heading.h1` | display | 30 | 1.2 | 700 | −0.010em | Top-of-page heading |
| `heading.h2` | display | 24 | 1.2 | 600 | −0.010em | Section heading |
| `heading.h3` | brand | 20 | 1.4 | 600 | 0 | Subsection / card title |
| `heading.h4` | brand | 16 | 1.4 | 600 | 0 | Inline emphasis heading |
| `body.lg` | brand | 20 | 1.6 | 400 | 0 | Lede paragraph |
| `body.md` | brand | 16 | 1.5 | 400 | 0 | **Default reading flow** |
| `body.sm` | brand | 14 | 1.5 | 400 | 0 | Secondary metadata only |
| `label.lg` | brand | 16 | 1.2 | 600 | 0 | Primary button labels |
| `label.md` | brand | 14 | 1.2 | 500 | 0 | Form labels, secondary buttons |
| `label.sm` | brand | 12 | 1.2 | 500 | 0 | Pill / chip text |
| `eyebrow` | brand | 12 | 1.2 | 600 | +0.060em | Section taglines (UPPERCASE) |
| `caption` | brand | 12 | 1.4 | 400 | 0 | Timestamps, footnotes |
| `code` | mono | 14 | 1.4 | 400 | 0 | Tokens, technical strings |

## 4. Font families

| Slot | Stack | Status |
|---|---|---|
| `display` | `Montserrat, "Museo Sans", -apple-system, …` | **Loaded via `next/font/google`** in the preview. Free, Google Fonts. Used for display + heading roles. |
| `brand` | `"Museo Sans", Museo, -apple-system, …` | **License TBC with FFIE.** ffie.fr uses Museo (paid foundry). System stack renders by default until a webfont license is confirmed. |
| `sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, …` | System stack. Available as a neutral fallback if `brand` slot is unwanted. |
| `mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, …` | System stack. |

### How families are wired

**Web (Next.js preview):**
- `next/font/google` loads Montserrat at build time, exposes a CSS variable (`--font-montserrat`), and self-hosts the files (no FOUT, no Google network call at runtime).
- `globals.css` defines `--font-display`, `--font-brand`, `--font-mono` chains that reference the next/font variable.
- Page-level CSS reads `var(--font-display)` etc. — never hardcodes a stack.

**React Native (future):**
- `expo-font` + `useFonts` loads Montserrat from Google Fonts mirror (or bundled `.ttf`).
- The brand stack uses `Platform.select({ ios: "Museo Sans", android: "Museo Sans", default: undefined })` and falls back to the system font.
- `Text` components read from `textStyles.role` directly — the same role names used on web.

## 5. Dynamic-Type contract

Per P4, the type system must survive OS-level text scaling. The simulator on the preview page tests four scaling levels:

| Level | Scale | Origin | Required |
|---|---|---|---|
| Default | 100% | — | Baseline |
| iOS Dynamic Type +1 | 115% | iOS Larger Text settings | Must read |
| iOS Dynamic Type +3 / Android Large | 135% | iOS aXL / Android Display size | Must read |
| Android Huge / WCAG SC 1.4.4 | 200% | Android Display +200% | **Must reflow without truncation or overlap** — WCAG 2.2 SC 1.4.4 |

### Rules

1. **`allowFontScaling` is `true` by default** on every Text in React Native. The only opt-outs are:
   - Pure decorative numerals where overflow would break layout (e.g. a fixed-width countdown badge).
   - Code blocks where wrapping mid-token would be worse than horizontal scroll.
2. **No `body.*` role ever drops below 16pt** — that's the AAA-aware reading floor.
3. **`body.sm` (14pt) is metadata-only** — timestamps, "cached today", footnotes. Never the main reading flow.
4. **Maximum scale cap is 200%** in the simulator; in production the OS may go higher, in which case overflow is acceptable as long as content remains reachable via scroll.

## 6. Letter spacing rules

- Uppercase text always pairs with `letterSpacings.wider` (0.06em). Caps without tracking compress to an unreadable block — this rule exists because we lost a sprint last year to it. The `eyebrow` role bakes this in; any ad-hoc `text-transform: uppercase` outside the role table is a code-review red flag.
- Display + h1/h2 use tight or tighter (-0.01 to -0.025em). At 30pt+ the default tracking looks loose; tightening recovers a "designed" feel.
- Body and labels stay at `0` — anything else hurts ESL and screen-reader users.

## 7. Locale considerations

The product is French-primary. French has:
- Significantly more accented characters (`é à ç è ù â ê î ô û`) — every weight + style must include `latin-ext` subset. (Montserrat in our `next/font` config includes both.)
- Longer average word length than English (+15-25% on UI labels). This means the 200% test in the simulator is even more important — French at 200% is roughly English at 230%.
- Convention of inserting a non-breaking space before `:` `;` `?` `!` `«»`. Don't change this with CSS resets.

## 8. Open items

- **Museo Sans licensing decision with FFIE.** Until confirmed, the brand stack falls through to the system font on first paint. Decide either: (a) license Museo Sans webfont, (b) approve system stack permanently, or (c) substitute a free alternative that matches Museo's character (e.g. Lato or Inter).
- **Real-device dynamic-type testing.** The simulator approximates iOS Dynamic Type and Android scaling — running the actual mobile app at +3 and +200% on test devices is the next step before launch.
- **French-specific tracking review.** Display roles at 30pt+ may need a slightly looser letter-spacing in French than the current `-0.010em` — French accents and word length affect optical density.
- **`textStyles` consumption helper** for React Native — a tiny wrapper that converts the unitless letterSpacing em-multiplier to a points value (`em * fontSize`) so the same role table feeds web and native without bespoke logic at the component level.

## 9. References

- WCAG 2.2 SC 1.4.4 (Resize Text) — https://www.w3.org/TR/WCAG22/#resize-text
- WCAG 2.2 SC 1.4.12 (Text Spacing) — https://www.w3.org/TR/WCAG22/#text-spacing
- next/font docs — https://nextjs.org/docs/app/api-reference/components/font
- Apple HIG · Dynamic Type — https://developer.apple.com/design/human-interface-guidelines/typography
- Material 3 · Type scale — https://m3.material.io/styles/typography/type-scale-tokens
- Tim Brown, *Modular Scale* — https://www.modularscale.com/

# FFIE Color System

**Version:** 1.0 (matches `tokens.ts` v0.2)
**Last updated:** 2026-05-28
**Skill of record:** `ui-design--color-system`
**Source of truth:** [`tokens.ts`](./tokens.ts) — this document explains what is true *because* of the values there. If they disagree, `tokens.ts` wins.

---

## 1. Methodology

The color system is built and audited at three levels:

| Level | What's tested | How |
|---|---|---|
| **Ramps** | Each primitive tonal scale (gray, brand.navy, brand.teal, red, amber, green, blue) | Walk every `[step, hex]`, compute CIE L\* (perceptual lightness) via the sRGB → linear → XYZ → Lab transform, surface the per-step delta and its standard deviation. The aim is monotonic descent. |
| **Semantic bindings** | Every foreground/background pair the themes promise (text on surface, action fg on action bg, pill text on feedback bg, etc.) | WCAG 2.2 relative-luminance contrast ratio, graded against AA (4.5:1 text, 3:1 non-text), AAA (7:1 text). Required level varies per pair. |
| **Colour-blindness independence** | Pairs of semantically-loaded colors that must remain distinguishable when colour is the only differentiator (offline vs syncing, danger vs success, etc.) | Viénot, Brettel & Mollon (1999) LMS simulation for deuteranopia, protanopia, tritanopia, followed by CIE ΔE\*ab between the simulated pair. ΔE < 5 ≈ a glance cannot tell them apart. |

Every audit is computed at render time on the live preview at `/foundations/color`. If a value in `tokens.ts` changes upstream, the preview rerenders with the new numbers — no separate sync step.

## 2. Brand anchors (resolved)

Closes PRD §7.4 and TOKENS.md §9.3.

| Token | Hex | Source |
|---|---|---|
| `brand.navy.700` | `#222D5D` | The institutional block of the FFIE logo SVG (`/typo3conf/ext/ffie_skin/Resources/Public/assets/images/logo-ffie.svg`). |
| `brand.teal.400` | `#04C6E2` | Brightest cyan in the federation's compiled stylesheet (14 occurrences). |
| `brand.teal.500` | `#02B5CE` | Secondary accent in the compiled stylesheet (47 occurrences). |
| `brand.teal.600` | `#0094A9` | The most-used color in `ffie.fr`'s compiled stylesheet — 58 occurrences — i.e. the federation's primary CTA hue. |
| `brand.teal.700` | `#027489` | Local extension — chosen so white text clears WCAG AA on the primary action surface (5.66:1 vs 3.62:1 at teal[600]). |

The brand resolution removes the previous indigo placeholder. All three theme bindings (`light`, `dark`, `sunlight`) have been re-bound onto the new `brand` namespace.

## 3. Ramp audit — perceptual lightness progression

Each ramp's CIE L\* delta per step, with the standard deviation across the ramp:

| Ramp | Mean ΔL\* | Stdev | Notes |
|---|---|---|---|
| `gray` | 9.35 | 4.51 | Tailwind-derived. Uneven by design (Tailwind tunes for visual impact, not perceptual uniformity); biggest step at 400→500 (Δ18.5). |
| `brand.navy` | 9.05 | 4.40 | Locally tuned around the locked anchor `[700] = #222D5D`. Uneven in the mid-range (200→300 = Δ15.9) — accepted because the load-bearing positions (.700/.800/.900) read predictably. |
| `brand.teal` | 8.25 | 2.65 | **Most evenly stepped ramp in the system.** The mid-ramp `[400]/[500]/[600]` positions are real FFIE brand colors taken from ffie.fr; the rest interpolate cleanly. |
| `red` | 8.38 | 3.17 | Tailwind, AAA-capable at 700+. |
| `amber` | 8.30 | 3.93 | Tailwind. |
| `green` | 8.24 | 3.77 | Tailwind. |
| `blue` | 8.03 | 2.49 | Tailwind. |

### Decision: do not re-tune the Tailwind ramps

Perfectly uniform CIELAB progression is academically attractive but produces ramps that *look* worse to users — small visual steps at the light end stop reading as different colors. Tailwind's bias toward larger mid-ramp steps matches human perception of "noticeable difference." We accept the unevenness because:

1. The semantic positions we actually bind to (.500–.800) are well-tested and AAA-capable where required.
2. The contrast catalog (§4) verifies the bindings hold against WCAG thresholds — that is the real safety net.
3. Re-tuning the ramps would invalidate years of community-tested defaults.

### Decision: `brand.navy` mid-range stays

The unevenness in `brand.navy` between .200 and .500 is cosmetic — none of those positions appear in load-bearing semantic bindings. The locked anchor at .700 (`#222D5D`, logo color) is the only constraint.

## 4. Cross-theme contrast catalog

**Status: 33 pairs / 3 themes / 0 failures.**

Every binding in `themes.{light, dark, sunlight}` is tested against the WCAG threshold appropriate for its use:

| Required | Threshold | Applied to |
|---|---|---|
| AAA | 7:1 | `text.body` on every surface, `text.brand` on default surface. Per design principle P4. |
| AA | 4.5:1 | `text.muted` on every surface; `action.*.fg` on `action.*.bg`; `text.inverse` on `feedback.*` (the filled-pill pattern). |
| AA non-text | 3:1 | Reserved for load-bearing borders, icons, focus rings — *not* applied to the decorative `border.default` token. |

### Theme adjustments made by this audit

Three bindings were modified during the refinement pass:

| Theme | Binding | Was | Now | Why |
|---|---|---|---|---|
| `light` | `action.primary.bg` | `brand.teal[600]` (#0094A9) | `brand.teal[700]` (#027489) | White-on-teal[600] = 3.62:1, fails AA. teal[700] gives 5.66:1 and still reads as the FFIE teal family. |
| `light` | `feedback.success` | `green[600]` (#16A34A) | `green[700]` (#15803D) | White-on-green[600] = 3.30:1, fails AA. green[700] gives 6.49:1. |
| `dark` | `action.destructive` | bg `red[500]` / fg `white` | bg `red[400]` / fg `gray[950]` | Aligns with the dark-mode pattern of bright bg + dark fg; the previous bg was too saturated for white text (3.76:1) and inverting to dark text on the brighter bg yields 8.9:1. |

### Filled-pill text contract

For any filled `feedback.*` background, the foreground text is `theme.text.inverse`:

- `light.text.inverse = #FFFFFF` → white text on dark feedback colors
- `dark.text.inverse = gray[950]` → dark text on bright feedback colors  
- `sunlight.text.inverse = #FFFFFF` → white text on the deepest feedback colors

This is enforced in the contrast catalog as the standard "feedback pill" pattern.

### Decorative borders

`border.default = gray[200]` does not clear 3:1 against white (it's 1.3:1). This is intentional — the token is decorative-only. Any border that conveys meaning (input outline, focus ring, divider that separates interactive regions, table cell separator under text) must use a higher-contrast token. Note for a future iteration: introduce `border.strong` and `border.focus` semantic tokens to make this contract explicit in the type system.

## 5. Colour-blindness independence audit

**Status: 63 pairs (7 critical × 3 themes × 3 dichromacies) / 59 distinct / 3 marginal / 1 indistinguishable.**

Methodology: each critical pair is run through Viénot LMS simulation for each dichromacy, and the simulated pair's CIE ΔE\*ab is computed:

| ΔE | Verdict | Meaning |
|---|---|---|
| ≥ 11 | Distinct | Two glances tell them apart. |
| 5–11 | Marginal | A careful look distinguishes them, but a glance may not. Acceptable *only* when the pair is reinforced by icon, shape, or text. |
| < 5 | Indistinguishable | A glance cannot separate them. The system must not rely on color alone for that pair. |

### Findings

#### Distinct (59/63) — pass

All `feedback.offline` vs `feedback.syncing` pairs pass with ΔE > 15. This is the FFIE-specific load-bearing P2 pair (amber vs teal) and it never collapses across any of the three dichromacies in any theme. ✓

#### Marginal (3/63) — accepted with reinforcement policy

| Theme | Pair | Type | ΔE | Reinforcement |
|---|---|---|---|---|
| dark | `feedback.success` vs `feedback.danger` | deuteranopia | 9.8 | Already enforced — success/danger never appear without an icon (✓ / ⚠) and an accessible label in any UI surface. |
| dark | `feedback.syncing` vs `feedback.info` | tritanopia | 8.4 | These two are never adjacent in the UI — `syncing` appears on the news/document items, `info` only in toasts and announcements. |
| sunlight | `feedback.danger` vs `feedback.warning` | tritanopia | 7.9 | Tritanopia affects ~0.01% of the population; both states are reinforced by icon + text. |

#### Indistinguishable (1/63) — accepted, conditions documented

| Theme | Pair | Type | ΔE | Why we accept |
|---|---|---|---|---|
| sunlight | `feedback.syncing` vs `feedback.info` | tritanopia | 0.5 | At sunlight depth (`teal[800]` and `blue[800]` both deeply desaturated), the tritanopia simulation collapses both to the same dark blue-black. We accept this because (a) tritanopia is the rarest dichromacy at ~0.01% of the population, (b) `info` toasts and `syncing` indicators are never co-present on the same surface, and (c) both states ship with their own icon and text label. **If we ever introduce a UI where info and syncing co-appear under sunlight + tritanopia, this binding must be revisited.** |

## 6. Sunlight theme — why darker brand colors

`sunlight` (P1 + P4 — Julien on a worksite at noon) takes the deepest brand values:

- `action.primary.bg = brand.navy[900]` — the FFIE logo navy, deepest for outdoor legibility against high ambient light
- `feedback.*` uses `[700]`/`[800]` shades — saturated enough to remain hue-identifiable but dark enough that text clears AAA

Borders carry elevation in sunlight (`border.default = black`) because shadows wash out in direct sunlight. This is the only theme where elevation is communicated through outline rather than shadow.

## 7. Brand-swap procedure

If FFIE refines its brand palette, the swap touches one file:

1. Update the hex values in `primitives.colors.brand.navy.*` and `primitives.colors.brand.teal.*` (`tokens.ts`).
2. Re-run the contrast catalog at `/foundations/color` — confirm the green-zone count remains at 33/33.
3. Re-run the colour-blindness audit at the same URL — confirm the only `indistinguishable` row stays the documented sunlight tritanopia case.
4. If a new failure appears, the action surfaces or feedback bindings need a step adjustment (e.g. promote `action.primary.bg` from `[700]` to `[800]`).

No component code needs to change — all components read from the semantic theme.

## 8. Open items

- **`border.strong` / `border.focus` semantic tokens** — recommended to add in the next iteration so the load-bearing border contract is enforced by the type system rather than convention.
- **Color-blindness simulation in the preview** — currently shown as ΔE values + swatches in the audit table. A user-facing toggle to render the entire preview as if viewed with each dichromacy would catch problems the pair-wise audit misses.
- **Real-device sunlight testing** — the sunlight theme is validated against contrast math. Field-testing it on Julien's actual phones outdoors is the next step before launch.

## 9. References

- WCAG 2.2 SC 1.4.3 (Contrast Minimum) — https://www.w3.org/TR/WCAG22/#contrast-minimum
- WCAG 2.2 SC 1.4.6 (Contrast Enhanced) — https://www.w3.org/TR/WCAG22/#contrast-enhanced
- WCAG 2.2 SC 1.4.11 (Non-text Contrast) — https://www.w3.org/TR/WCAG22/#non-text-contrast
- Viénot, Brettel & Mollon (1999), *Digital video colourmaps for checking the legibility of displays by dichromats* — https://doi.org/10.1002/(SICI)1520-6378(199906)24:3%3C243::AID-COL11%3E3.0.CO;2-3
- CIE 1976 (L\*, a\*, b\*) color space — used for perceptual lightness and ΔE — https://en.wikipedia.org/wiki/CIELAB_color_space
- FFIE federation site — https://www.ffie.fr — source of the brand palette.

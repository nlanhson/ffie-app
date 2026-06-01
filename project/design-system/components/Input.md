# Input

**Version:** 1.0 (matches `tokens.ts` v0.4)
**Status:** Spec — reference implementation in [`design-system-preview/src/components/ds/Input.tsx`](../../../design-system-preview/src/components/ds/Input.tsx)
**Skill of record:** `design-systems--component-spec` + `accessible-content--form-labelling`
**Live preview:** [`/components/input`](http://localhost:3001/components/input)

---

## 1. Purpose

The Input is the text-entry component for both Julien's search-as-front-door flow (P3) and Sylvie's back-office forms. It owns the **focus-ring contract**, the **label/helper/error layout**, and the **density → height mapping** for the entire system. Every other text-entry surface in the product (Search Bar, TextArea, Password, Email) is either a variant of this component or a composition that consumes it.

## 2. Anatomy

```
┌─────────────────────────────────────┐
│ [Label] *                            │  ← real <label>, stack.tight gap
│ ┌─────────────────────────────────┐ │
│ │ 🔍   value text          ✕      │ │  ← height fixed by density
│ └─────────────────────────────────┘ │
│ Helper text or error message         │  ← aria-describedby target
└─────────────────────────────────────┘
```

The label is **always a real `<label htmlFor>`** — never a placeholder. The required marker is an `*` glyph **plus** `aria-required="true"`. Error and helper occupy the same slot; error wins when present.

## 3. Variants

| Variant | Trigger | Decoration |
|---|---|---|
| `text` | default | none |
| `search` | type="search" | leading `Search` icon, trailing `X` clear button when value is non-empty + `onClear` provided |
| `password` | type="password" | trailing eye toggle (Eye / EyeOff) — visible-text mode is `aria-pressed` true |
| `email` | type="email" | none — browser/OS handles validation hinting |

## 4. States

| State | Visual | Behavior |
|---|---|---|
| idle | border `theme.border.strong` | — |
| hover | unchanged (web pointer) | — |
| focus | border `theme.border.focus` + 2pt outer ring with 2pt offset | 120ms transition (`motion.duration.fast`) |
| disabled | bg `theme.surface.subtle`, opacity 0.4 (`primitives.opacity.disabled`) | not focusable |
| error | border `theme.feedback.danger`, ring follows | `aria-invalid="true"` + `role="alert"` on message |
| filled (has value) | unchanged | — |
| required | visible `*` next to label | `aria-required="true"` |

## 5. Density → height contract

| Density | Total height | Vertical padding | Font size | Notes |
|---|---|---|---|---|
| `compact` | 40pt | 8 (inset.compact) | sm (14pt) | **Back-office only.** Below the 44pt WCAG 2.5.5 floor, so requires keyboard + mouse as primary input. Used for Sylvie's data forms where dozens of fields are visible at once. |
| `comfortable` | 48pt | 12 (custom — between compact and default) | base (16pt) | **Default. Matches `sizes.touchTarget.primary` (P1).** Used everywhere member-facing. |
| `spacious` | 56pt | 16 (inset.default) | lg (20pt) | **Hero/onboarding/public landings.** Matches `sizes.touchTarget.comfortable`. Larger font signals primacy. |

Horizontal padding stays `inset.default` (16) for comfortable and spacious; drops to `inset.compact` (8) in compact mode.

## 6. Token recipe

| Slot | Token |
|---|---|
| background | `theme.surface.default` |
| background (disabled) | `theme.surface.subtle` |
| border (idle) | `theme.border.strong` |
| border (focus) | `theme.border.focus` |
| border (error) | `theme.feedback.danger` |
| text | `theme.text.body` |
| placeholder | `theme.text.placeholder` |
| label / helper | `theme.text.muted` |
| error text | `theme.feedback.danger` |
| required marker | `theme.feedback.danger` |
| icon color | `theme.text.muted` |
| horizontal inset | `inset.default` (16) · `inset.compact` (8) in compact |
| label → field gap | `stack.tight` (4) |
| field → helper gap | `stack.tight` (4) |
| icon → text gap | `inline.snug` (8) |
| corner radius | `radii.md` (8) |
| focus transition | `motion.duration.fast` (120ms) |
| disabled opacity | `opacity.disabled` (0.4) |

Component-internal values that are **not** in the token system:
- 12pt vertical padding for `comfortable` density — this is a computed value (height 48 − line-height 24 = 24, split). Documented here so it doesn't leak into ad-hoc usage.

## 7. Accessibility

- **Real `<label>` with `htmlFor`** linking to a `<input id>`. Placeholders never substitute for a label.
- **Required state** is communicated three ways: visible `*` next to label, `aria-required="true"` on the input, and an HTML `required` attribute (which lets the browser enforce on submit).
- **Errors**: input gets `aria-invalid="true"`; the error message has `role="alert"` so screen readers announce it on change; `aria-describedby` on the input points at exactly one description (error if present, otherwise helper).
- **Focus indicator**: 2pt solid border + 2pt outer ring with 2pt offset. Total visible focus indicator is 4pt thick. Meets WCAG 1.4.11 (3:1 against surface) for every theme, including sunlight.
- **Touch target**: 48pt comfortable (default) meets WCAG 2.5.5. Compact (40pt) is documented as back-office-only.
- **Font scaling**: web inputs scale with OS settings automatically. On RN the corresponding component MUST NOT pass `allowFontScaling={false}` (P4 — never disabled).
- **Keyboard**: native input behavior. Search variant's trailing clear button is reachable by Tab and activatable by Space/Enter.
- **Password toggle**: the eye button has `aria-label` (state-dependent) and `aria-pressed` to communicate visibility state.

## 8. Do · Don't

| Do | Don't |
|---|---|
| Use the `label` prop. Always. | Use the `placeholder` as the only label. |
| Use the `search` variant for any search-the-app field. | Build a custom search input that omits the magnifier — Julien needs the affordance. |
| Use `error` for validation failures; tie it to live state. | Show a stale error after the user has corrected the value. |
| Use `compact` density only inside back-office data forms. | Use `compact` on member-facing mobile screens — it breaks the 44pt touch floor. |
| Pass `onClear` for search variants. | Force the user to backspace-clear a 30-character query. |
| Let the OS handle email/password keyboards via `variant`. | Override `inputMode` arbitrarily. |

## 9. Sunlight theme behavior

In sunlight mode (Julien on a worksite at noon), the Input renders with:
- `border.strong = black` — the full 21:1 against white surface
- `border.focus = brand.navy[900]` — institutional FFIE navy
- No shadows; the border itself is the elevation

Test outdoors before launch — the simulator can't replicate real ambient luminance.

## 10. React Native parity notes

When the RN sibling component is built (post-Stage 2):

- Same token recipe — read from `theme.*` directly, no Tailwind classes.
- Height contract is unitless points → `<TextInput style={{ height: 48 }}>`.
- The focus ring approximation uses `borderWidth: 2` on focus + `shadowColor` for the offset; iOS and Android need slight per-platform tuning.
- `allowFontScaling` defaults to undefined (= true) on RN. **Never pass false.**
- `accessibilityState={{ disabled, required, invalid: hasError }}` mirrors the web ARIA attributes.
- Search variant uses `clearButtonMode="while-editing"` on iOS for native parity; Android renders our custom `X` button.

## 11. Open items

- **Multiline (textarea) variant** — pending. Sylvie's back-office news editor needs it; not blocking for v1.0.
- **Numeric / OTP variants** — pending; not needed in Phase 1 scope.
- **Autocomplete / suggestions popover** — needed for search (Julien types "NF C" and sees matching documents). Will be a separate `SearchBar` component that wraps Input rather than a variant.
- **Form integration** — `<Form>` and `<FormField>` wrappers that propagate density, required, and error state are deferred to the Form spec.
- **Real-device sunlight test** — the focus ring contract needs to be verified outdoors on Julien's actual phone before Phase 1 launch.

## 12. References

- WCAG 2.2 SC 1.4.11 (Non-text Contrast) — focus indicators
- WCAG 2.2 SC 2.5.5 (Target Size) — 44pt floor
- WCAG 2.2 SC 3.3.2 (Labels or Instructions)
- WCAG 2.2 SC 4.1.2 (Name, Role, Value) — `aria-required`, `aria-invalid`, `aria-describedby`
- Skill: `accessible-content--form-labelling`
- FFIE design principle P3 — search is the front door

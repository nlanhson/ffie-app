# Card

**Version:** 1.0 (matches `tokens.ts` v0.6)
**Status:** Spec — reference implementation at [`src/components/ds/Card.tsx`](../../../design-system-preview/src/components/ds/Card.tsx)
**Skill of record:** `design-systems--component-spec`
**Live preview:** [`/components/card`](http://localhost:3001/components/card)

---

## 1. Purpose

Card is the composition primitive for any **row-like or block-like surface** in the FFIE product. One spec serves four very different use cases, switched only by `density` + `variant`:

| Use case | Persona / principle | Card config |
|---|---|---|
| News feed item | Julien · P1 + P2 | `density="comfortable" variant="default"` |
| Document library row | Julien · P2 + P3 | `density="comfortable" variant="default" interactive` |
| Back-office data row | Sylvie · P5 | `density="compact" variant="outlined"` |
| Public landing block | Karim + Léa · P6 + P7 | `density="spacious" variant="raised"` |

Card is the final primitive in the v1.0 design system. It does not introduce new tokens — it composes everything we built: surface + border + radius + elevation + spacing (inset/stack/inline) + typography roles + StatusPill + Button.

## 2. Anatomy

```
  ┌───────────────────────────────────────────┐
  │  CardEyebrow                  CardActions │  ← CardHeader (flex column)
  │  CardTitle                                │
  │                                           │
  │  CardContent                              │
  │    CardDescription                        │
  │    CardMedia                              │
  │                                           │
  │  CardFooter (Button…)         CardMeta    │  ← row, gap.inline.default
  └───────────────────────────────────────────┘
        ↑                                ↑
    inset.{compact|default|comfortable}  CardActions slot
    per density                          (margin-left: auto)
```

The sub-components describe **regions**, not layout. Callers compose the regions in whatever order their semantic content needs. For example:

- News feed: Header → Content → Footer
- Document row: `<CardRow>` with icon + Title-stack + StatusPill on one line
- Back-office row: grid with 4 columns (title / status / date / count)

## 3. Sub-components

| Component | Role | Default style notes |
|---|---|---|
| `<Card>` | Root container | Density-aware padding, variant-aware border + shadow, optional `stale` + `interactive` |
| `<CardHeader>` | Top region | Flex column, `gap: stack.tight` (4) |
| `<CardEyebrow>` | Small-caps category | `textStyles.eyebrow` — wider letter-spacing, uppercase |
| `<CardTitle>` | Primary heading | `textStyles.heading.h3` — Montserrat 20/1.4 semibold |
| `<CardDescription>` | Lede paragraph | `textStyles.body.md` on `text.muted` |
| `<CardMeta>` | Timestamp / byline | `textStyles.caption` on `text.muted` |
| `<CardContent>` | Body region | `margin-top: stack.default` (16) |
| `<CardFooter>` | Action region | `margin-top: stack.default`, flex row, `gap.inline.default` (12) |
| `<CardActions>` | Right-aligned action slot | `margin-left: auto` — used inside Header or Footer to push items right |
| `<CardMedia>` | Image / icon container | `radii.md`, overflow hidden |
| `<CardRow>` | Horizontal layout helper | Flex row, `gap.inline.default`, items: center |

## 4. Props

### Card props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"default" \| "raised" \| "outlined" \| "flat"` | `"default"` | See §5 |
| `density` | `"compact" \| "comfortable" \| "spacious"` | `"comfortable"` | Affects padding only — interactive primitives keep their own sizes |
| `stale` | `boolean` | `false` | P2 contract — see §6 |
| `interactive` | `boolean` | `false` | Hover lift + `cursor: pointer`. Wrap the Card in `<a>` or `<button>` for real interactivity |
| `themeName` | `ThemeName` | inherited via CSS variables | Override only for cross-theme demos |

### Variants (§5)

| Variant | Background | Border | Shadow | Use |
|---|---|---|---|---|
| `default` | `surface.default` | `border.default` | `elevation.sm` | The standard card |
| `raised` | `surface.raised` | `border.default` | `elevation.md` | Hero / featured surface |
| `outlined` | `surface.default` | `border.strong` (3:1+) | `none` | Data tables — borders separate rows under text |
| `flat` | `surface.subtle` | `border.subtle` | `none` | Embedded / nested context (a Card inside a Card) |

## 5. Density contract

| Density | Inset | When |
|---|---|---|
| `compact` | `inset.compact` (8) | Back-office data rows · Sylvie scanning dozens of records (P5) |
| `comfortable` | `inset.default` (16) | Member-facing mobile screens · Julien (P1 default) |
| `spacious` | `inset.comfortable` (24) | Public landing surfaces · Karim + Léa (P7) |

**Density never shifts interactive primitive sizes.** A Button inside a `density="compact"` Card still renders at `size="md"` (48pt) unless the caller explicitly drops to `size="sm"` (40pt). The compact Card lets Sylvie see more rows on a screen; it does not steal touch area from the actions.

## 6. The `stale` contract (P2)

When `stale={true}`, the **inner content area** is rendered at `opacity.stale` (0.6) with a 200ms fade. The Card itself stays at full opacity — so the border, surface, and shadow still read crisply.

**The StatusPill is exempt from the dim.** The user needs to see "Refreshing in background" or "Cached 12 days ago" clearly — that's the whole point of the stale signal. Render the StatusPill inside an absolutely-positioned overlay (`z-index: 1`) so it sits above the dimmed content, OR pass it as a sibling outside the `stale` Card. Both patterns work.

The dim is informational, never punitive — per the P2 contract that offline-cached content is a feature, not a fallback.

## 7. Accessibility

- **Card is not a button by default.** Setting `interactive` only adds hover lift + cursor. For real interactivity, wrap the Card in `<a href>` (navigation) or `<button>` (action) — never both. The stretched-link pattern is the safest: an absolutely positioned `<a>` inside the Card that covers it, with nested Buttons getting `position: relative; z-index: 1`.
- **Focus indicator** travels through to the wrapping element. The Card itself does not show a focus ring; the wrapping `<a>` / `<button>` does.
- **Title is a real heading**: `<h3>` rendered via `<CardTitle>`. Ensure heading levels make sense in the page hierarchy — for a list of news cards under an `<h1>` page title, h3 is correct via an h2 section heading. Pass `as` if you need a different level.
- **`CardMeta` is just a `<div>`**, not a `<time>`. Use a `<time dateTime>` inside it for real timestamps.
- **`stale` is decorative**. The actual machine-readable state lives in the StatusPill (`name="stale"` carries `aria-label`). Don't rely on the dim alone to communicate.
- **Touch targets**: density does not compress Buttons inside the Card. If you need a smaller Button, choose `size="sm"` explicitly.

## 8. Token recipe

| Slot | Token |
|---|---|
| background (default) | `theme.surface.default` (`bg-background` via CSS var) |
| background (raised) | `theme.surface.raised` |
| background (flat) | `theme.surface.subtle` |
| border (default) | `theme.border.default` (`border-border`) |
| border (outlined) | `theme.border.strong` |
| corner radius | `radii.lg` (12) |
| padding (compact) | `inset.compact` (8) |
| padding (comfortable) | `inset.default` (16) |
| padding (spacious) | `inset.comfortable` (24) |
| shadow (default) | `elevation.sm` (light + dark); `none` in sunlight |
| shadow (raised) | `elevation.md` (light + dark); `none` in sunlight |
| header → content gap | `stack.default` (16) |
| content → footer gap | `stack.default` (16) |
| inside-header eyebrow → title | `stack.tight` (4) |
| footer flex gap | `inline.default` (12) |
| `<CardRow>` flex gap | `inline.default` (12) |
| stale dim | `opacity.stale` (0.6) |
| hover transition | `motion.duration.fast` (120ms) |

## 9. Sunlight theme behavior

In sunlight (`data-theme="sunlight"`), Card emits no shadow regardless of `variant`. The **border carries elevation outdoors** (per the sunlight theme contract). `default` and `raised` render with the same `border.default = black`; `outlined` is identical. This is intentional — high ambient light washes out shadows; an outlined card reads at a glance from 60cm under direct sun.

## 10. Composing with StatusPill + Button

Card does not couple to specific components but the canonical FFIE compositions are these three:

### News feed item

```tsx
<Card density="comfortable" interactive>
  <CardHeader>
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <CardEyebrow>News · Worksite</CardEyebrow>
        <CardTitle>New CE-marking requirements…</CardTitle>
      </div>
      <CardActions>
        <StatusPill name="fresh" size="sm" variant="subtle" />
      </CardActions>
    </div>
  </CardHeader>
  <CardContent>
    <CardDescription>…</CardDescription>
  </CardContent>
  <CardFooter>
    <Button size="sm" variant="primary">Read</Button>
    <Button size="sm" variant="ghost">Save</Button>
    <CardActions><CardMeta>2 hours ago · 4 min read</CardMeta></CardActions>
  </CardFooter>
</Card>
```

### Document library row

```tsx
<Card density="comfortable" interactive stale={isStale}>
  <CardRow>
    <Icon />
    <div className="flex-1 min-w-0">
      <CardTitle>NF C 15-100 §7.2 — Cable management</CardTitle>
      <CardMeta>Available offline · cached today</CardMeta>
    </div>
    <CardActions>
      <StatusPill name="success" size="sm">Downloaded</StatusPill>
    </CardActions>
  </CardRow>
</Card>
```

### Back-office data table

For data tables, the Card is the *outer surface* with `variant="outlined"` and `padding: 0`; rows are CSS grid layouts inside with their own padding. See the preview at /components/card for the working example.

## 11. Do · Don't

| Do | Don't |
|---|---|
| Use one Card spec for the news feed, doc library, back-office, and landing — just switch `density` and `variant`. | Build a `NewsCard`, `DocCard`, `RowCard` per surface. |
| Render the StatusPill above the stale dim. | Let the StatusPill be dimmed — the user needs to see it. |
| Wrap in `<a>` or `<button>` for real interactivity. | Add `onClick` directly to Card without a wrapping interactive element. |
| Use `density="compact"` only in back-office data contexts. | Use compact on member-facing mobile rows — read the P5 contract. |
| Drop Buttons inside Card.Footer at their natural size. | Manually shrink the Button to "fit" the compact Card — that breaks P1 touch targets. |
| Use `as` or pass a different element to `<CardTitle>` if heading level needs adjustment. | Default to `<h3>` everywhere regardless of page hierarchy. |

## 12. React Native parity notes

When the RN sibling lands (Stage 3):

- Replace `<div>` with `<View>`. The token recipe is identical.
- `boxShadow` becomes `shadowColor / shadowOffset / shadowOpacity / shadowRadius` on iOS and `elevation` on Android — already structured in `primitives.elevation.{ios,android,web}`.
- `interactive` becomes `Pressable` with `android_ripple` + iOS press scale.
- The hover lift is web-only; on mobile, the press state is the lift (scale: 0.99 + elevation lift via Reanimated).

## 13. Open items

- **`asChild` Slot pattern** — currently Card is a `<div>`. To compose with Next/Link for navigation, callers wrap the Card. Adding Radix Slot would let `<Card asChild><Link>…</Link></Card>` flatten the DOM. Not blocking v1.0.
- **`<CardTitle as="h2">` polymorphic prop** — heading level should be settable per page hierarchy. Currently defaults to h3.
- **Stretched-link helper** — the absolutely-positioned overlay pattern is verbose. A `<CardLinkOverlay href>` sub-component would tidy it up.
- **Skeleton variant** — loading state for Card. Reserved for Stage 3 (real data loading).
- **Real-device sunlight test** — confirm the borderless-shadow contract reads correctly on Julien's phone outdoors. Bundled with the existing sunlight field-tests.

## 14. References

- shadcn Card — https://ui.shadcn.com/docs/components/card (the composable-sub-components pattern)
- Material 3 Card — https://m3.material.io/components/cards/overview
- FFIE design principles P1 (field-ready), P2 (offline-default), P5 (forgive the editor), P6 + P7 (public discovery)
- [SHADCN_INTEGRATION.md](../SHADCN_INTEGRATION.md)
- [SPACING.md](../SPACING.md) §3-§4 — inset / density contracts
- [Button.md](./Button.md), [StatusPill.md](./StatusPill.md) — composed inside Cards

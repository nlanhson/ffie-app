# FFIE × shadcn/ui integration

**Version:** 1.0
**Last updated:** 2026-05-28
**Status:** Foundation bridged — Dialog + Toast live; remaining components added on demand.

---

## 1. What changed and why

The component layer of the FFIE design system now sits on top of **shadcn/ui + Radix UI primitives**. The visual design — colors, typography, spacing, motion — is unchanged; tokens.ts remains the single source of truth. shadcn provides the *structural* layer: accessible, headless, composable Radix primitives plus the conventional CSS-variable theming pattern.

**Why bridge instead of replace:**
- Radix primitives have years of accessibility work baked in (focus traps, ARIA wiring, keyboard navigation, RTL support) that we don't want to hand-roll.
- shadcn components copy *into* the codebase rather than installing as a dep, so we own every line and can adapt to FFIE-specific contracts.
- The CSS-variable theming pattern lets us drive shadcn's whole component set with one bridge file (`globals.css`) — every theme switch flows through immediately.

## 2. The bridge

`globals.css` defines shadcn's role tokens (`--primary`, `--background`, `--ring`, …) **in HSL form** under three selectors — one per FFIE theme:

```css
:root,
[data-theme="light"]   { /* maps each role to a FFIE token */ }
[data-theme="dark"]    { /* dark bindings */ }
[data-theme="sunlight"]{ /* sunlight bindings */ }
```

`ThemeProvider` (`src/lib/theme-context.tsx`) sets `data-theme` on `<html>` so the variables cascade into portals (Dialog, Toast) that render outside the React tree root.

`tailwind.config.ts` exposes these role tokens as Tailwind color utilities: `bg-primary`, `text-foreground`, `border-input`, `ring-ring`, etc. shadcn components reference these utilities; they automatically pick up the active theme's HSL.

### Token mapping table

| shadcn role | Light | Dark | Sunlight |
|---|---|---|---|
| `--background` | white | gray[950] | white |
| `--foreground` | gray[900] | gray[50] | black |
| `--card` | white | gray[800] | white |
| `--popover` | white | gray[900] | white |
| `--primary` | brand.teal[700] (AA on white) | brand.teal[400] | brand.navy[900] |
| `--primary-foreground` | white | gray[950] | white |
| `--accent` | brand.teal[600] (ffie.fr CTA) | brand.teal[300] | brand.teal[800] |
| `--destructive` | red[600] | red[400] | red[800] |
| `--muted` | gray[100] | gray[800] | white |
| `--muted-foreground` | gray[600] (AAA) | gray[400] (AAA) | gray[800] (AAA 13:1) |
| `--border` | gray[200] (decorative) | gray[700] | black |
| `--input` | border.strong gray[400] | gray[500] | black |
| `--ring` | brand.teal[600] | brand.teal[300] | brand.navy[900] |
| `--radius` | 8px (radii.md) | same | same |

If a token in tokens.ts changes, **update both the hex value and its HSL counterpart in globals.css**. The two values are mirrored, not derived.

## 3. Adoption policy — what lives where

| Layer | Owner | Examples |
|---|---|---|
| **Radix primitives** | `@radix-ui/*` packages | Dialog.Root, Dialog.Portal, Dialog.Trigger, etc. |
| **shadcn components** | `src/components/ui/` | `dialog.tsx`, `toaster.tsx` — generated/forked from shadcn, themed by the CSS-variable bridge. |
| **FFIE composite components** | `src/components/ds/` (new) or `src/components/ui/` (existing Button) | Wrappers that compose shadcn primitives with FFIE-specific contracts (density modes, sunlight focus rings, P5 destructive confirm). |
| **Hand-rolled FFIE components** | `src/components/ds/` | Input (density-aware height contract) and Button (multi-variant + loading + reduced-motion-aware) — these encode FFIE contracts not naturally expressed via shadcn defaults. |

**Migration policy:** existing hand-rolled components (Button at `ui/Button.tsx`, Input at `ds/Input.tsx`) stay as-is. When the next FFIE composite needs a Radix primitive that one of them already approximates, we evaluate then — not before.

> **Naming follow-up:** Input lives under `ds/` and Button lives under `ui/`. Normalize before the StatusPill spec lands.

## 4. What's installed

`package.json` adds:
- `clsx`, `tailwind-merge` — class-string utilities
- `class-variance-authority` — variant API used by shadcn-generated components
- `tailwindcss-animate` — keyframes used by Radix `data-state` animations
- `@radix-ui/react-dialog` — the Dialog primitive
- `@radix-ui/react-slot` — the asChild pattern
- `sonner` — toast library (shadcn's recommended toast)

The `components.json` at the repo root is the shadcn CLI config — `style: new-york`, `baseColor: slate`, `cssVariables: true`. Future components can be generated with:

```bash
npx shadcn@latest add <component-name>
```

## 5. What's mounted today

| Component | File | Used by |
|---|---|---|
| Dialog | [`src/components/ui/dialog.tsx`](../../design-system-preview/src/components/ui/dialog.tsx) | Foundation for the FFIE Modal (P5 — destructive confirm + 60s undo). |
| Toaster | [`src/components/ui/toaster.tsx`](../../design-system-preview/src/components/ui/toaster.tsx) | Mounted in the root layout. Foundation for the P5 undo toast (caller passes `duration: motion.duration.undo` = 60_000ms). |

## 6. Reduced motion

shadcn's default Radix animations are wrapped with `motion-reduce:animate-none motion-reduce:transition-none` in our Dialog. The convention for every future shadcn component we adopt:

1. Keep the Radix `data-state` animation as default.
2. Add `motion-reduce:animate-none motion-reduce:transition-none` to neutralize it under `prefers-reduced-motion: reduce`.
3. **Exception:** any animation that *is* the affordance — e.g. a loading spinner — keeps rotating. Document the exception in the component spec.

## 7. Sunlight theme behavior

The sunlight theme replaces shadows with borders (per the design principle that shadows wash out outdoors). The Dialog's `shadow-lg` class still renders in sunlight, but the `--border` token resolves to black so the box reads as a high-contrast outline. Acceptable; no per-theme override needed.

## 8. Open follow-ups

- **`components/Input.md` and `components/Button.md` spec consistency** — both pre-date the shadcn bridge. Their token recipes still reference FFIE theme tokens directly (`theme.border.strong`, etc.); we don't migrate them to `bg-primary` semantic utilities. Document the dual-path convention in the next component spec.
- **shadcn `add` for the rest** — Sheet, Popover, Combobox (for SearchBar autocomplete), Tabs, DropdownMenu — added on demand as the screens that need them are designed.
- **shadcn `Button` evaluation** — once StatusPill / Card / Modal are shipped, decide whether to migrate the hand-rolled Button to the shadcn-cva pattern for consistency or keep it for its loading / destructive-confirm logic.
- **High-contrast variant for Dialog in sunlight** — current implementation renders fine, but field-testing on Julien's phone may surface that the dropshadow needs to be dropped explicitly when `data-theme="sunlight"`.

## 9. References

- shadcn/ui — https://ui.shadcn.com
- Radix UI Dialog — https://www.radix-ui.com/primitives/docs/components/dialog
- sonner — https://sonner.emilkowal.ski/
- Skill of record: `shadcn-ui` (project skills bundle)

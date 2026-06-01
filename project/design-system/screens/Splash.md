# Splash Screen

**Version:** 1.1 — full-bleed home-banner-bg.jpg with a dark legibility scrim. v1.0 entry preserved at §13 for traceability.
**Status:** Spec — reference impls at [`design-system-preview/src/components/screens/Splash.tsx`](../../../design-system-preview/src/components/screens/Splash.tsx) (web) and [`mobile/src/screens/SplashScreen.tsx`](../../../mobile/src/screens/SplashScreen.tsx) (RN).
**Skill of record:** `design-systems--component-spec` + `interaction-design--animation-principles`
**Live preview:** [`/screens/splash`](http://localhost:3001/screens/splash)

---

## 1. Purpose

The first screen the app renders on launch. While the offline cache rehydrates (5–800ms depending on device + signal), the Splash establishes:

1. **Federation identity** — the FFIE logo + wordmark + full federation name. Julien needs to know he opened the right app before the cache is ready.
2. **Brand voice** — the tagline "Construisons l'électricité, ensemble." (the same line that opens the federation website). Institutional, not transactional.
3. **System state** — a calm three-dot loader + status line ("Syncing offline cache…") that signals "we're working" without anxiety.

Splash is **not** marketing. It is the gap-filler between cold start and Doc Library / News Feed. The contracts below preserve that.

## 2. Anatomy

```
                ┌──────────────────────────┐
                │                          │
                │                          │
                │          ┌───┐           │  ← logo @ 96pt, centered
                │          └───┘           │
                │                          │
                │           FFIE           │  ← display.md, text.brand
                │  FÉDÉRATION FRANÇAISE…   │  ← eyebrow, text.muted
                │                          │
                │   Construisons l'élec.   │  ← body.lg italic, text.body
                │                          │
                │           ● ● ●          │  ← three pulsing brand.accent dots
                │   Synchronisation hors…  │  ← caption, text.muted
                │                          │
                │                          │
                │           v0.6           │  ← mono 10px, text.muted opacity 60%
                └──────────────────────────┘
```

## 3. Token recipe

**v1.1 update — background is now `mobile/assets/home-banner-bg.jpg`** (dusk view of Nice + electrical IoT icons; doubles as a brand statement: federation of integrators, networked installations, electricity). The image is painted full-bleed via `ImageBackground` with a vertical `LinearGradient` scrim on top — navy[950] @ 0.55 alpha at the top fading to 0.78 at the bottom — which keeps every text element above the 4.5:1 contrast floor regardless of which area of the image it lands on. Text colors switch to white-on-dark constants (white, white@78%, white@50%) instead of theme-driven `text.body`/`text.muted`. The logo always uses its white-card variant on this screen (the navy block in the SVG would otherwise disappear into the image). All motion + reduced-motion contracts are identical to v1.0.

| Slot | Token (v1.1) |
|---|---|
| surface | `home-banner-bg.jpg` (cover) + LinearGradient scrim navy[950] 0.55 → 0.78 |
| surface (loading flash) | navy[950] solid (`#080C1F`) — paints while the JPG decodes |
| ~~theme.surface.default~~ | _superseded by image+scrim_ |
| logo size | 96 × 81pt (preserves the SVG's 133.4 × 112.3 viewBox ratio) |
| logo wrapper (dark theme only) | white card · `inset.compact` (8) · `radii.md` |
| FFIE wordmark | `textStyles.display.md` (36pt Montserrat bold, lh 1.2, ls −0.010em) on `theme.text.brand` |
| federation name | `textStyles.eyebrow` (12pt brand semibold, lh 1.2, ls +0.060em, uppercase) on `theme.text.muted` |
| tagline | `textStyles.body.lg` italic (20pt brand, lh 1.6) on `theme.text.body` |
| dots | 8×8pt circles, `theme.brand.accent` (teal[600] light / teal[300] dark / teal[800] sunlight) |
| status line | `fontSizes.xs` (12pt) on `theme.text.muted` |
| version stamp | 10pt mono on `theme.text.muted` @ 60% opacity |
| screen padding | `space[8]` (32pt) horizontal |
| stack gaps (between blocks) | `space[6]` (24pt) — overrideable per element |
| logo → title | `space[2]` (8pt) inside the title stack |
| title → tagline | `space[6]` (24pt) — the breathing space that reads "institutional" |
| tagline → loader | `space[10]` (40pt) — clearly separates message from system feedback |

## 4. Motion contract

Three rules, in priority order:

1. **Sequence — never simultaneous.** The four blocks fade in at offsets `0 / 120 / 280 / 440ms`. This guides the eye logo → identity → tagline → loader. Each block uses `motion.duration.slow` (320ms) with `easing.decelerate` (entrance curve).
2. **Pulsing dots, not a spinner.** Three brand-accent dots cycling between opacity 0.4 and 1.0 over 1200ms with 160ms phase offsets between dots. Calmer than a spinner; matches the federation's tone.
3. **Reduced motion is a hard switch.** Under `prefers-reduced-motion: reduce` (web) or `AccessibilityInfo.isReduceMotionEnabled()` (RN), every delay collapses to 0, every translation is dropped, the dot pulse is removed (dots render at static 60% opacity). The splash still works — the user just doesn't see the choreography.

The pulsing dots **continue running** under reduced motion is a deliberate exception that we considered and rejected — reduced-motion users get a static "we're working" indicator that doesn't ping their vestibular system. Compare with Button's loading spinner, where the rotation IS the affordance and continues under reduced motion. Here, the dot pulse is decoration on top of an already-visible "we're working" message.

## 5. Theme behavior

| Theme | Surface | Logo treatment | Tagline color | Dot color |
|---|---|---|---|---|
| `light` | white | original SVG, no wrapper | gray[900] | brand.teal[600] |
| `dark` | gray[950] | **white card wrapper** (`inset.compact` + `radii.md`) so the logo's navy block stays legible against the dark surface | gray[50] | brand.teal[300] |
| `sunlight` | white | original SVG, no wrapper | black | brand.teal[800] (deeper for outdoor) |

The dark-theme card wrapper is the one place where the logo is **not** edge-to-edge on the screen surface. Accepted because shipping a separately-traced "logo on dark" SVG would create two sources of truth.

## 6. Accessibility

- The Splash is announced to screen readers as a single image with the label `"FFIE · {federation full name}"`. The wordmark, federation name, and tagline are also rendered as real Text nodes (web) / `<Text>` (RN), so users on tab/swipe navigation still encounter the content.
- The loader is `aria-hidden` on web (it conveys no information beyond the status line, which is already legible).
- The status line ("Syncing offline cache…") is **not** an `aria-live` region — it would announce on every cold start, which is noise. If a real error occurs during sync (network down, auth expired), that screen replaces the Splash with its own announcement.
- No focusable elements. The user cannot interact with the Splash; it auto-dismisses when the cache finishes or after `min(actualLoad, 3000ms)` whichever is longer (3s is the floor so the brand reads even on a fast cold start).

## 7. Locale + i18n

| Key | French (default) | English |
|---|---|---|
| `Splash.federation` | Fédération Française des Intégrateurs Électriciens | (same — proper noun, never translated) |
| `Splash.tagline` | Construisons l'électricité, ensemble. | Building electricity, together. |
| `Splash.loading` | Synchronisation hors-ligne… | Syncing offline cache… |
| `Splash.version` | v{version} | v{version} |

The French tagline is canonical — it matches the live federation site at ffie.fr. The English tagline is a working approximation for the design-team locale. If FFIE eventually localizes the federation name (they may not), that key moves out of the "proper noun" exception.

Note: the federation full name contains **non-breaking spaces** in real French copy (typographic convention). Our messages file uses regular spaces; the typography layer doesn't enforce NBSP yet. Tracked in I18N.md §5.

## 8. Lifecycle

```
App launch
  ↓
SplashScreen mounts
  ↓ (parallel)
  ├─ Animations start (320ms each, sequential offsets)
  ├─ Cache rehydration starts (in real app)
  └─ 3-second floor timer starts
  ↓
First of: { cache ready AND 3s elapsed }
  ↓
Splash unmounts, next screen mounts
  ↓
On web: /screens/splash is a preview-only route that loops on Replay.
On RN: the host (App.tsx) shows Splash until ready, then swaps.
```

The 3s floor is the lower bound for brand recognition. Without it, on a fast cold start (cache already warm, signal good) the Splash flashes for ~300ms — long enough to flicker, not long enough to register. The floor makes the launch feel intentional.

## 9. React Native parity notes

The web reference and the RN port are intentionally close:

- Same token recipe.
- Same animation timing (320ms / 0-120-280-440ms offsets, 1200ms dot loop, 160ms dot phase).
- Same accessibility role + label.
- Web uses CSS animations + `Image` from next/image. RN uses `Animated.timing` + `Animated.loop` + `expo-image`.
- Both probe their respective reduced-motion source (`matchMedia("(prefers-reduced-motion: reduce)")` vs `AccessibilityInfo.isReduceMotionEnabled()`).
- RN wraps the SVG load in `react-native-svg` (via `expo-image`). The logo asset is at `mobile/assets/logo-ffie.svg`, copied from `design-system-preview/public/logo-ffie.svg` — they should stay in sync.

## 10. Do · Don't

| Do | Don't |
|---|---|
| Show the federation full name. Members will recognize "FFIE" but the full name is the institutional anchor. | Hide the full name behind a "tap to expand" — it's the whole point. |
| Keep the dots pulsing as decoration, removed under reduced motion. | Replace the dots with a spinner. Spinners feel transactional; FFIE is a federation. |
| Floor the visible duration at 3 seconds. | Tear down the splash the instant the cache hands back. Brand recognition is the second job. |
| Match the typography roles exactly (display.md / eyebrow / body.lg). | Use heading.h1 for FFIE — it's a wordmark, not a heading in the document hierarchy. |
| Wrap the logo in a white card under `data-theme="dark"`. | Ship a separate "logo on dark" SVG. Two sources of truth = two sources of drift. |
| Make the version stamp quiet but quotable. | Hide the version. Field-bug reports need it. |

## 11. Open items

- **Real cache-rehydration hook** — currently both reference impls show the splash indefinitely (web loops on Replay; RN is host-driven). The actual cache check + auth probe + service-worker warm-up pipeline lands with the App Shell work later.
- **3-second floor** — currently not enforced in the reference impls (host orchestration). Add when the App Shell is wired.
- **Sunlight field-test** — the loader dot pulse at outdoor luminance hasn't been verified. Bundle with the existing sunlight tests.
- **NBSP in federation name** — replace regular spaces in the messages catalogs with ` ` (French typographic rule).
- **Pre-bundled logo `.png`** for the iOS launch screen and Android `splashscreen_image` — these are statically bundled by the OS at install time, separate from the React/RN Splash. The OS-level static splash should match the dynamic Splash within a frame so the handoff is invisible.

## 12. References

- WCAG 2.2 SC 2.3.3 (Animation from Interactions)
- iOS HIG — Launch Screen — https://developer.apple.com/design/human-interface-guidelines/launching
- Material 3 — Splash screens — https://m3.material.io/components/splash-screens/overview
- FFIE design principles P1 (field-ready) — the splash is field-ready first, marketing not at all
- [SHADCN_INTEGRATION.md](../SHADCN_INTEGRATION.md) — the dark-theme logo wrapper is the one place the theme bridge has a visible exception
- [I18N.md](../I18N.md) — locale + NBSP convention

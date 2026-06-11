// Home dashboard palette + card elevation.
//
// The Home hub uses the CONVENTIONAL iOS grouped look — a recessed grey page
// with raised white cards. This is intentionally the OPPOSITE of the app's
// list screens, whose `useGroupedColors` (components/ui/ios) is inverted
// (white page, grey cards) per the original design direction. The client's
// Home mockup wants the dashboard look, so the hub gets its own mapping here
// rather than bending the shared list-screen helper.
//
// Theme-aware so dark / sunlight stay correct even though v1 ships light only:
//   - light    → grey page (gray50), white cards, hairline outline
//   - dark     → near-black page, raised grey cards
//   - sunlight → white page + white cards carried by a black outline (the
//                high-contrast theme leans on borders, not fills/shadows)

import { Platform, type ViewStyle } from "react-native";
import { primitives, themes, type ThemeName } from "@tokens";

export type HomeColors = {
  /** Recessed dashboard background behind the cards. */
  pageBg: string;
  /** Raised card fill. */
  cardBg: string;
  /** Hairline card outline (keeps white cards legible on the grey page). */
  cardBorder: string;
  /** Inner divider tone (e.g. between rows in a card). */
  hairline: string;
};

export function useHomeColors(themeName: ThemeName): HomeColors {
  const t = themes[themeName];
  switch (themeName) {
    case "dark":
      return {
        pageBg: t.surface.default, // gray950 — recessed base
        cardBg: t.surface.raised, // gray800 — elevated card
        cardBorder: t.border.subtle,
        hairline: t.border.subtle,
      };
    case "sunlight":
      return {
        pageBg: t.surface.default, // white
        cardBg: t.surface.default, // white — separated by the black border
        cardBorder: primitives.colors.black,
        hairline: t.border.subtle,
      };
    default: // light
      return {
        pageBg: t.surface.subtle, // gray50 — recessed grey page
        cardBg: t.surface.default, // white — raised card
        cardBorder: t.border.subtle, // gray100 hairline
        hairline: t.border.default,
      };
  }
}

// Soft card elevation, derived from the token elevation scale (md). Shadows
// don't read on dark surfaces, so dark mode leans on the card border instead;
// the shadow is harmless there but contributes nothing.
// The lifted "dashboard sheet" geometry — bespoke marketing values (the radius
// sits intentionally above the radii.xl=16 scale step for a softer hub feel).
// Shared by HomeScreen and HomeSkeleton so the two never drift.
export const SHEET = { radius: 22, lift: 12, padTop: 22, padBottom: 28 } as const;

const e = primitives.elevation.md;
export const CARD_SHADOW: ViewStyle =
  Platform.OS === "android"
    ? { elevation: e.android.elevation }
    : {
        shadowColor: e.ios.shadowColor,
        shadowOffset: e.ios.shadowOffset,
        shadowOpacity: e.ios.shadowOpacity,
        shadowRadius: e.ios.shadowRadius,
      };

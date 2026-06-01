// Typography loader + weight → fontFamily map.
//
// The canonical spec lives in @tokens (project/design-system/tokens.ts).
// This file is the React-Native runtime side: it imports the Raleway
// weight files from @expo-google-fonts/raleway, exposes them as a single
// `FONTS` object you can hand to `useFonts(...)`, and provides
// `ralewayFamily(weight)` so screens can write
//
//   { fontFamily: ralewayFamily("600"), fontWeight: "600", fontSize: 16 }
//
// without each component re-declaring the weight → family lookup.
//
// Museo Sans is the brand label family (300 + 500 only). It is paid
// (MyFonts / Linotype) — when FFIE supplies the .otf files, drop them
// into `mobile/assets/fonts/` and extend MUSEO_FONTS + museoFamily below.

import {
  Raleway_200ExtraLight,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";
import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export const RALEWAY_FONTS = {
  Raleway_200ExtraLight,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} as const;

// Sora — the display/heading family. Maps to the design system's `display`
// role (TYPOGRAPHY.md §3). A geometric grotesk: confident at headline sizes,
// institutional-modern, a clear contrast against Raleway body so hierarchy
// reads. Interim stand-in for the licensed brand face; swap centrally here
// when Museo Sans lands.
export const SORA_FONTS = {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} as const;

// Museo Sans loader placeholder. Populate when font files are licensed:
//   MuseoSans_300Light: require("../../assets/fonts/MuseoSans-300.otf"),
//   MuseoSans_500Medium: require("../../assets/fonts/MuseoSans-500.otf"),
export const MUSEO_FONTS = {} as const;

export const FONTS = {
  ...RALEWAY_FONTS,
  ...SORA_FONTS,
  ...MUSEO_FONTS,
} as const;

// RN font weights as React Native style strings.
export type Weight = "200" | "300" | "400" | "500" | "600" | "700" | "800";

// Mapping from a numeric weight → the actual loaded Raleway family name.
// Falls back to Raleway_400Regular for any weight outside the loaded set.
export function ralewayFamily(weight: Weight | number = "400"): string {
  const w = String(weight) as Weight;
  switch (w) {
    case "200":
      return "Raleway_200ExtraLight";
    case "300":
      return "Raleway_300Light";
    case "400":
      return "Raleway_400Regular";
    case "500":
      return "Raleway_500Medium";
    case "600":
      return "Raleway_600SemiBold";
    case "700":
      return "Raleway_700Bold";
    case "800":
      return "Raleway_800ExtraBold";
    default:
      return "Raleway_400Regular";
  }
}

// Display family (Sora) → headings, hero titles, big numbers. Maps to the
// `display` role in TYPOGRAPHY.md. Sora ships 400-800; anything below 400
// falls back to Regular.
export function displayFamily(weight: Weight | number = "700"): string {
  const w = String(weight) as Weight;
  switch (w) {
    case "500":
      return "Sora_500Medium";
    case "600":
      return "Sora_600SemiBold";
    case "700":
      return "Sora_700Bold";
    case "800":
      return "Sora_800ExtraBold";
    default:
      return "Sora_400Regular";
  }
}

// Spread helper for headings: family + matching weight so the OS never
// faux-bolds. Use as <Text style={[styles.h, displayText("700")]}>.
export function displayText(weight: Weight | number = "700") {
  const w = String(weight) as Weight;
  return { fontFamily: displayFamily(w), fontWeight: w as Weight };
}

// Museo Sans equivalent. Returns "" while font files are missing so RN
// falls back to the system stack — consumers can still reference it; once
// the files land, this resolves to the real family name.
export function museoFamily(weight: "300" | "500" = "500"): string {
  switch (weight) {
    case "300":
      return "MuseoSans_300Light" in MUSEO_FONTS ? "MuseoSans_300Light" : "";
    case "500":
      return "MuseoSans_500Medium" in MUSEO_FONTS ? "MuseoSans_500Medium" : "";
  }
}

// Spread-friendly helper. Use as:
//   <Text style={[styles.title, ralewayText("700")]}>
// to get the family + matching weight (so OS doesn't faux-bold).
export function ralewayText(weight: Weight | number = "400") {
  const w = String(weight) as Weight;
  return { fontFamily: ralewayFamily(w), fontWeight: w as Weight };
}

// Auth-flow screen tokens.
// Pure spec values for the Splash + Email + OTP screens, all keyed off the
// canonical `@tokens` primitives so any future scale change ripples through.
// Anything that is just a one-off pixel decision (e.g. OTP dot diameter,
// keypad row gap) lives here so the screens stay free of magic numbers.

import { primitives } from "@tokens";

const { space, radii } = primitives;

export const auth = {
  sheet: {
    radius: 24,                       // rounded top corners only
    handleWidth: 36,
    handleHeight: 4,
    handleTopInset: space[2],         // 8 — distance from sheet top to handle
    handleColor: "#D8DCE4",
    scrim: "rgba(0,0,0,0.55)",
    paddingX: space[6],               // 24 — card horizontal padding
    paddingTop: space[6],              // 24
    paddingBottom: space[5],          // 20
    minHeightPct: 0.62,
  },

  splash: {
    paddingX: space[6],               // 24
    buttonsGap: space[3],             // 12 — between stacked auth buttons
    buttonsBottomInset: space[5],     // 20 — above the credit line
    creditMarginTop: space[3],        // 12
    logoTopInsetPct: 0.22,            // logo sits ~22% from top
    titleMarginTop: space[3],         // 12
  },

  field: {
    height: 56,
    radius: radii.md,                 // 8
    paddingX: space[4],               // 16
    fontSize: 16,
    selectedBorderColor: "#1F6FEB",
    selectedBgColor: "#F1F6FE",
  },

  spacing: {
    titleToSubtitle: space[2],        // 8
    subtitleToField: space[5],        // 20 — generous "calm" gap
    fieldToButton: space[16],         // 64 — pushes Continue down toward keyboard
    sectionGap: space[5],             // 20
  },

  otp: {
    dotSize: 52,
    dotGap: space[2],                 // 8
    dotInactiveBg: "#EEF1F6",
    dotActiveBg: "#DEEBFD",
    dotCurrentBg: "#A8C9F5",
    dotInactiveBorder: "transparent",
    dotActiveBorder: "transparent",
    dotDigitColor: "#2B6CD9",
    dotDigitFontSize: 20,
    dotDigitFontWeight: "600" as const,
    resendMarginTop: space[4],        // 16
  },

  keypad: {
    keyHeight: 48,
    keyRadius: 10,
    keyBg: "#FBFCFE",
    keyBorderColor: "#E6EAF1",
    keyGap: space[2],                 // 8
    rowGap: space[2],                 // 8
    digitFontSize: 26,
    digitFontWeight: "400" as const,
    lettersFontSize: 9,
    lettersLetterSpacing: 1.4,
    keypadPaddingX: space[3],         // 12
    keypadPaddingTop: space[4],        // 16
    keypadPaddingBottom: space[3],    // 12
  },
} as const;

export type AuthTokens = typeof auth;

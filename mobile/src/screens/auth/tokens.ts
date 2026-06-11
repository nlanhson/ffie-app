// Auth-flow screen tokens.
// Pure spec values for the Splash + Email + OTP screens, all keyed off the
// canonical `@tokens` primitives so any future scale change ripples through.
// Anything that is just a one-off pixel decision (e.g. OTP dot diameter,
// keypad row gap) lives here so the screens stay free of magic numbers.

import { primitives } from "@tokens";
import { HEADER_SURFACE } from "@/theme/brandHeader";

const { space, radii, colors } = primitives;

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

  // Member sign-in screen (LoginScreen) — a TEAL HERO + WHITE SHEET, matching
  // the Home header (HEADER_SURFACE = teal[600] #0094A9). That mid-teal only
  // gives white text ~3.6:1, so — like the header — small text never sits on
  // the teal: the hero carries only large white display text + a white logo
  // chip, and the whole form drops onto a white sheet where everything clears
  // WCAG AA (dark navy text, teal[700] CTA, navy[400] field borders ≈6:1).
  login: {
    bg: HEADER_SURFACE,                 // teal[600] #0094A9 — hero (lockstep w/ header)
    sheet: colors.white,                // form sheet — all small text rides this
    title: colors.white,                // "Welcome" — large on teal (≥3:1)
    subtitle: colors.white,             // hero subtitle — large-ish on teal
    headerLabel: colors.white,          // top "FFIE" wordmark + back chevron
    radius: radii.lg,                   // 12 — fields, buttons, footer pill

    field: {
      height: 56,
      bg: colors.white,                 // white field reads on teal
      border: colors.brand.navy[400],   // #4F5C95 — ≈3:1+ boundary (1.4.11)
      borderFocus: colors.brand.teal[700], // #027489 — visible on white + teal
      text: colors.brand.navy[900],     // ≈16:1 on white (AAA)
      placeholder: colors.brand.navy[400], // #4F5C95 — ≈6.4:1 on white (AA)
    },

    // Primary "Connect" CTA — teal[700] so the white label clears AA (≈5.45:1;
    // the app's default #3CA9C5 fails AA for small text). Pressed → teal[800].
    cta: {
      height: 56,
      bg: colors.brand.teal[700],         // #027489
      bgPressed: colors.brand.teal[800],  // #045764
      bgDisabled: "rgba(18,24,53,0.12)",  // navy @ 12% (disabled = contrast-exempt)
      fg: colors.white,
      fgDisabled: colors.brand.navy[500],
    },

    // "SSO federation connection" — outlined white button.
    sso: {
      bg: colors.white,
      bgPressed: colors.gray[100],        // #EEF0F4
      border: colors.brand.navy[400],     // ≈3:1+ boundary
      fg: colors.brand.navy[800],         // #1A2349 — high contrast on white
    },

    divider: colors.brand.navy[400],      // #4F5C95 — "or" rule, ≈5:1 (≥3:1)
    link: colors.brand.navy[700],         // #222D5D — Forgot / Help (≈10:1)
    accent: colors.brand.teal[700],       // #027489 — "Join" (≈5.45:1 on white)

    // Bottom note + "Not yet a member?" bar — white pill on the teal page.
    footer: {
      bg: colors.white,
      border: colors.brand.navy[400],     // #4F5C95 — ≈5:1 boundary on teal (1.4.11)
      noteText: colors.brand.navy[700],   // #222D5D — ≈10:1 on teal
      markBg: colors.white,               // FFB mark already sits on white
    },
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

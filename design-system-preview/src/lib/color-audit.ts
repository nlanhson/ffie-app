// Shared helpers for the color-system audit surfaces on /foundations/color.
// All math is render-time. Token edits in tokens.ts flow through immediately.

import { themes, type ThemeName } from "@tokens";
import { contrastRatio, gradeContrast, type ContrastGrade } from "./contrast";
import { simulate, deltaE, type CBType } from "./colorblind";

export type ContrastRow = {
  themeName: ThemeName;
  pair: string;
  fg: string;
  bg: string;
  ratio: number;
  grade: ContrastGrade;
  required: "AA" | "AAA" | "non-text";
};

export function buildContrastCatalog(): ContrastRow[] {
  const rows: ContrastRow[] = [];
  for (const themeName of Object.keys(themes) as ThemeName[]) {
    const t = themes[themeName];
    // The contrasting text on filled pills uses theme.text.inverse — which
    // is defined as the opposite-luminance pair of text.body. This holds
    // across all themes: white-on-dark-feedback in light + sunlight, dark-
    // on-bright-feedback in dark mode.
    const onFeedback = t.text.inverse;
    const pairs: Array<{
      pair: string;
      fg: string;
      bg: string;
      required: "AA" | "AAA" | "non-text";
    }> = [
      // P4 requires AAA for body text on every surface.
      { pair: "text.body / surface.default", fg: t.text.body, bg: t.surface.default, required: "AAA" },
      { pair: "text.body / surface.subtle", fg: t.text.body, bg: t.surface.subtle, required: "AAA" },
      { pair: "text.body / surface.raised", fg: t.text.body, bg: t.surface.raised, required: "AAA" },
      // Muted text needs AA at minimum.
      { pair: "text.muted / surface.default", fg: t.text.muted, bg: t.surface.default, required: "AA" },
      { pair: "text.muted / surface.subtle", fg: t.text.muted, bg: t.surface.subtle, required: "AA" },
      { pair: "text.brand / surface.default", fg: t.text.brand, bg: t.surface.default, required: "AAA" },
      // Action surfaces — UI text on filled buttons.
      { pair: "action.primary.fg / action.primary.bg", fg: t.action.primary.fg, bg: t.action.primary.bg, required: "AA" },
      { pair: "action.destructive.fg / action.destructive.bg", fg: t.action.destructive.fg, bg: t.action.destructive.bg, required: "AA" },
      // Feedback pill text — uses theme.text.inverse (see comment above).
      { pair: `text.inverse / feedback.danger`, fg: onFeedback, bg: t.feedback.danger, required: "AA" },
      { pair: `text.inverse / feedback.success`, fg: onFeedback, bg: t.feedback.success, required: "AA" },
      { pair: `text.inverse / feedback.info`, fg: onFeedback, bg: t.feedback.info, required: "AA" },
      // NB: border.default is intentionally decorative (gray[200] ~1.3:1 on
      // white). Any load-bearing border — focus ring, input outline, divider
      // that conveys meaning — uses a higher-contrast token. We do not test
      // decorative borders against the 3:1 non-text threshold.
    ];
    for (const p of pairs) {
      const ratio = contrastRatio(p.fg, p.bg);
      rows.push({
        themeName,
        pair: p.pair,
        fg: p.fg,
        bg: p.bg,
        ratio,
        grade: gradeContrast(ratio),
        required: p.required,
      });
    }
  }
  return rows;
}

export function passesRequirement(row: ContrastRow): boolean {
  if (row.required === "AAA") return row.ratio >= 7;
  if (row.required === "AA") return row.ratio >= 4.5;
  // non-text (borders, icons, focus rings) — WCAG 1.4.11 requires 3:1.
  return row.ratio >= 3;
}

// Critical state-color pairs that must remain distinguishable under every
// form of dichromacy. These are the colors P4 flags as load-bearing: if two
// of them collapse to near-identical hues under deuteranopia, the system has
// failed colour-independence and must rely on shape/text — but we want to
// know BEFORE shipping whether a glance is enough.

export type CBPairResult = {
  themeName: ThemeName;
  type: CBType;
  pair: [string, string]; // semantic names
  hexA: string;
  hexB: string;
  simA: string;
  simB: string;
  delta: number; // perceptual distance after simulation
  verdict: "distinct" | "marginal" | "indistinguishable";
};

const CRITICAL_PAIRS: Array<[string, string]> = [
  ["feedback.success", "feedback.danger"], // green vs red — the textbook deuteranopia failure
  ["feedback.success", "feedback.warning"], // green vs amber
  ["feedback.offline", "feedback.syncing"], // FFIE-specific: amber vs teal — must NEVER collide
  ["feedback.offline", "feedback.danger"], // amber stale vs red error — informational vs punitive
  ["feedback.stale", "feedback.danger"], // same idea
  ["feedback.syncing", "feedback.info"], // brand teal vs blue info — close hues
  ["feedback.danger", "feedback.warning"], // red error vs amber warning
];

function lookup(theme: (typeof themes)[ThemeName], path: string): string {
  // Navigates a dot-path through the theme object.
  return path.split(".").reduce<unknown>(
    (acc, k) => (acc as Record<string, unknown>)?.[k],
    theme
  ) as string;
}

export function buildColorblindAudit(): CBPairResult[] {
  const out: CBPairResult[] = [];
  const types: CBType[] = ["deuteranopia", "protanopia", "tritanopia"];
  for (const themeName of Object.keys(themes) as ThemeName[]) {
    const t = themes[themeName];
    for (const [aName, bName] of CRITICAL_PAIRS) {
      const hexA = lookup(t, aName);
      const hexB = lookup(t, bName);
      if (!hexA || !hexB) continue;
      for (const type of types) {
        const simA = simulate(hexA, type);
        const simB = simulate(hexB, type);
        const delta = deltaE(simA, simB);
        // CIE thresholds: ΔE<2.3 ≈ same color; 2.3–5 hard to tell apart;
        // >5 distinguishable; >11 obvious.
        const verdict: CBPairResult["verdict"] =
          delta < 5 ? "indistinguishable" : delta < 11 ? "marginal" : "distinct";
        out.push({
          themeName,
          type,
          pair: [aName, bName],
          hexA,
          hexB,
          simA,
          simB,
          delta,
          verdict,
        });
      }
    }
  }
  return out;
}

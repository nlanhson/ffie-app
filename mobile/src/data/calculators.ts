// Technical calculators — the module behind FFIE-CALC-01/02 (🟢 Phase 2,
// members only). FFIE-CALC-01: "a module integrates industry-specific
// calculation tools"; FFIE-CALC-02: "each calculator accepts the necessary
// inputs and displays a result". The PRD names three domains — power,
// sizing, standards — but the exact calculator list is still TBC with
// FFIE (see project/STATE.md). So this registry ships ONE fully-working,
// physics-correct calculator (power ↔ current) and lists the other
// domains honestly as "coming soon", exactly like the rest of the app handles
// not-yet-built content (no fabricated data — see CLAUDE.md conventions).
//
// The compute functions here are pure (no React, no I/O) so the screen can call
// them live as the user types, and so they're trivial to check in isolation.
// They implement standard electrical formulas — NOT FFIE-specific normative
// tables. Cable/breaker sizing per NF C 15-100 needs the federation's reference
// data, which we don't invent; the puissance tool is framed as an aid, with a
// footnote pointing back to the standard for the actual sizing decision.

import { Activity, Cable, Gauge, type LucideIcon } from "lucide-react-native";

// ---------------------------------------------------------------------------
// Registry — what the calculators module offers. The `available` tools each
// have a `kind` the screen switches on; the "soon" entries advertise the
// planned domains so the module reads as a roadmap, not a dead end.
// ---------------------------------------------------------------------------
export type CalculatorKind = "power" | "voltage-drop";

export type CalculatorEntry = {
  id: string;
  title: string;
  /** One-line description of what the tool computes (the row subtitle). */
  subtitle: string;
  icon: LucideIcon;
  /** Domain tag from the PRD (power / sizing / standards). */
  domain: "Power" | "Sizing" | "Standards";
} & ({ available: true; kind: CalculatorKind } | { available: false });

export const CALCULATORS: ReadonlyArray<CalculatorEntry> = [
  {
    id: "power-current",
    title: "Power & current",
    subtitle: "Current and apparent power of a single/three-phase load",
    icon: Activity,
    domain: "Power",
    available: true,
    kind: "power",
  },
  {
    id: "voltage-drop",
    title: "Voltage drop",
    subtitle: "Line ΔU and NF C 15-100 compliance",
    icon: Gauge,
    domain: "Standards",
    available: true,
    kind: "voltage-drop",
  },
  {
    id: "cable-sizing",
    title: "Cable cross-section",
    subtitle: "Sizing according to NF C 15-100",
    icon: Cable,
    domain: "Sizing",
    available: false,
  },
];

// ---------------------------------------------------------------------------
// Power ↔ current — the working calculator.
//
// Given an active power P (kW), a line voltage U (V) and a power factor cos φ,
// compute the line current I (A) and the apparent power S (kVA):
//
//   S = P / cos φ
//   single-phase : I = (P × 1000) / (U × cos φ)
//   three-phase  : I = (P × 1000) / (√3 × U × cos φ)
//
// These are exact, universal electrical relations — no normative assumptions.
// ---------------------------------------------------------------------------
export type Phase = "single" | "three";

/** Default line voltage per phase configuration in France (LV distribution).
 *  Editable by the user — these are just the sensible pre-fills. */
export const DEFAULT_VOLTAGE: Record<Phase, number> = {
  single: 230,
  three: 400,
};

/** Typical inductive load power factor — a safe starting point the user adjusts
 *  to their installation. */
export const DEFAULT_POWER_FACTOR = 0.85;

const SQRT_3 = Math.sqrt(3);

export type PowerInput = {
  phase: Phase;
  /** Active power in kilowatts. */
  powerKw: number;
  /** Line voltage in volts. */
  voltageV: number;
  /** Power factor cos φ, in (0, 1]. */
  powerFactor: number;
};

export type PowerResult = {
  /** Line current in amperes. */
  currentA: number;
  /** Apparent power in kilovolt-amperes. */
  apparentKva: number;
};

/** Parse a user-entered number, accepting the French decimal comma. Returns
 *  NaN for blank / malformed input so callers can show a placeholder state. */
export function parseNumber(raw: string): number {
  const normalised = raw.trim().replace(",", ".");
  if (normalised === "") return NaN;
  return Number(normalised);
}

/** True when every field is present and physically usable. Guards the divide
 *  (U·cos φ > 0) and rejects negative power before we compute. */
export function isValidPowerInput(input: PowerInput): boolean {
  const { powerKw, voltageV, powerFactor } = input;
  return (
    Number.isFinite(powerKw) &&
    Number.isFinite(voltageV) &&
    Number.isFinite(powerFactor) &&
    powerKw >= 0 &&
    voltageV > 0 &&
    powerFactor > 0 &&
    powerFactor <= 1
  );
}

export function computePower(input: PowerInput): PowerResult {
  const { phase, powerKw, voltageV, powerFactor } = input;
  const apparentKva = powerKw / powerFactor;
  const denominator = (phase === "three" ? SQRT_3 * voltageV : voltageV) * powerFactor;
  const currentA = (powerKw * 1000) / denominator;
  return { currentA, apparentKva };
}

// ---------------------------------------------------------------------------
// Voltage drop along a feeder. The NF C 15-100 formula:
//
//   ΔU = b × ( ρ × (L / S) × cos φ  +  λ × L × sin φ ) × I_B
//
//   b   = 2 for single-phase (out-and-back), 1 for three-phase
//   ρ   = conductor resistivity at its operating temperature (Ω·mm²/m)
//   L   = feeder run length (m)
//   S   = conductor cross-section (mm²)
//   λ   = linear reactance (Ω/m) — conventional value 0.08 mΩ/m
//   I_B = operating current (A)
//
// ρ and λ here are the conventional values used by NF C 15-100 (ρ at the
// operating temperature, i.e. 1.25 × ρ₂₀), not invented figures. The relative
// drop ΔU/U is compared to the standard's limits for a public-LV-fed
// installation (§525): 3% lighting, 5% other uses.
// ---------------------------------------------------------------------------
export type Conductor = "copper" | "aluminium";
export type LoadType = "lighting" | "other";

/** Conventional resistivity at service temperature, Ω·mm²/m (NF C 15-100). */
export const RESISTIVITY: Record<Conductor, number> = {
  copper: 0.0225,
  aluminium: 0.036,
};

/** Conventional linear reactance of a conductor, Ω/m (0.08 mΩ/m). */
const REACTANCE_PER_M = 0.00008;

/** Max relative voltage drop for an installation fed from the public LV
 *  network, in % (NF C 15-100 §525). */
export const VOLTAGE_DROP_LIMIT: Record<LoadType, number> = {
  lighting: 3,
  other: 5,
};

export type VoltageDropInput = {
  phase: Phase;
  conductor: Conductor;
  /** Feeder length in metres. */
  lengthM: number;
  /** Conductor cross-section in mm². */
  sectionMm2: number;
  /** Operating current I_B in amperes. */
  currentA: number;
  /** Power factor cos φ, in (0, 1]. */
  powerFactor: number;
  /** Line voltage in volts (for the relative drop). */
  voltageV: number;
};

export type VoltageDropResult = {
  /** Voltage drop ΔU in volts. */
  dropV: number;
  /** Relative drop ΔU / U as a percentage. */
  dropPercent: number;
};

export function isValidVoltageDropInput(i: VoltageDropInput): boolean {
  return (
    Number.isFinite(i.lengthM) &&
    Number.isFinite(i.sectionMm2) &&
    Number.isFinite(i.currentA) &&
    Number.isFinite(i.powerFactor) &&
    Number.isFinite(i.voltageV) &&
    i.lengthM > 0 &&
    i.sectionMm2 > 0 &&
    i.currentA >= 0 &&
    i.powerFactor > 0 &&
    i.powerFactor <= 1 &&
    i.voltageV > 0
  );
}

export function computeVoltageDrop(i: VoltageDropInput): VoltageDropResult {
  const b = i.phase === "single" ? 2 : 1;
  const rho = RESISTIVITY[i.conductor];
  const cosPhi = i.powerFactor;
  // sin φ from cos φ (φ in the first quadrant for a typical inductive load).
  const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
  const dropV =
    b *
    (rho * (i.lengthM / i.sectionMm2) * cosPhi + REACTANCE_PER_M * i.lengthM * sinPhi) *
    i.currentA;
  const dropPercent = (dropV / i.voltageV) * 100;
  return { dropV, dropPercent };
}

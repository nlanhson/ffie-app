// Calculateurs techniques — le module derrière FFIE-CALC-01/02 (🟢 Phase 2,
// réservé aux adhérents). FFIE-CALC-01 : « un module intègre des outils de
// calcul propres au métier » ; FFIE-CALC-02 : « chaque calculateur accepte les
// données nécessaires et affiche un résultat ». Le PRD nomme trois domaines —
// puissance, dimensionnement, normes — mais la liste exacte des calculateurs
// reste à confirmer avec la FFIE (voir project/STATE.md). Ce registre embarque
// donc UN calculateur pleinement fonctionnel et correct physiquement (puissance
// ↔ intensité) et liste honnêtement les autres domaines comme « bientôt »,
// exactement comme le reste de l'app gère les contenus pas encore construits
// (aucune donnée inventée — voir les conventions de CLAUDE.md).
//
// Les fonctions de calcul ici sont pures (pas de React, pas d'E/S) pour que
// l'écran puisse les appeler en direct à mesure que l'utilisateur saisit, et
// pour qu'elles soient triviales à vérifier isolément. Elles implémentent des
// formules électriques standard — PAS des tableaux normatifs propres à la FFIE.
// Le dimensionnement des câbles/disjoncteurs selon la NF C 15-100 nécessite les
// données de référence de la fédération, que nous n'inventons pas ; l'outil de
// puissance est présenté comme une aide, avec une note de bas de page renvoyant
// à la norme pour la décision de dimensionnement effective.

// Le type sur lequel commute une feuille de calculateur fonctionnelle — utilisé
// par les tuiles du hub Outils (ToolsHubView) et les feuilles de CalculatorsView.
export type CalculatorKind = "power" | "voltage-drop";

// ---------------------------------------------------------------------------
// Puissance ↔ intensité — le calculateur fonctionnel.
//
// Étant donné une puissance active P (kW), une tension de ligne U (V) et un
// facteur de puissance cos φ, calculer l'intensité de ligne I (A) et la
// puissance apparente S (kVA) :
//
//   S = P / cos φ
//   monophasé : I = (P × 1000) / (U × cos φ)
//   triphasé  : I = (P × 1000) / (√3 × U × cos φ)
//
// Ce sont des relations électriques exactes et universelles — aucune hypothèse
// normative.
// ---------------------------------------------------------------------------
export type Phase = "single" | "three";

/** Tension de ligne par défaut selon la configuration du régime en France
 *  (distribution BT). Modifiable par l'utilisateur — ce ne sont que des
 *  pré-remplissages raisonnables. */
export const DEFAULT_VOLTAGE: Record<Phase, number> = {
  single: 230,
  three: 400,
};

/** Facteur de puissance typique d'une charge inductive — un point de départ sûr
 *  que l'utilisateur ajuste à son installation. */
export const DEFAULT_POWER_FACTOR = 0.85;

const SQRT_3 = Math.sqrt(3);

export type PowerInput = {
  phase: Phase;
  /** Puissance active en kilowatts. */
  powerKw: number;
  /** Tension de ligne en volts. */
  voltageV: number;
  /** Facteur de puissance cos φ, dans (0, 1]. */
  powerFactor: number;
};

export type PowerResult = {
  /** Intensité de ligne en ampères. */
  currentA: number;
  /** Puissance apparente en kilovoltampères. */
  apparentKva: number;
};

/** Parse un nombre saisi par l'utilisateur, en acceptant la virgule décimale
 *  française. Renvoie NaN pour une saisie vide / mal formée afin que les
 *  appelants puissent afficher un état de remplissage par défaut. */
export function parseNumber(raw: string): number {
  const normalised = raw.trim().replace(",", ".");
  if (normalised === "") return NaN;
  return Number(normalised);
}

/** Vrai lorsque chaque champ est présent et physiquement exploitable. Protège la
 *  division (U·cos φ > 0) et rejette une puissance négative avant le calcul. */
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
// Chute de tension le long d'un départ. La formule NF C 15-100 :
//
//   ΔU = b × ( ρ × (L / S) × cos φ  +  λ × L × sin φ ) × I_B
//
//   b   = 2 en monophasé (aller-retour sur phase + neutre, ΔU vs 230 V)
//         √3 en triphasé équilibré (ΔU entre lignes, comparée vs 400 V) — la
//         forme du tableau Schneider / NF C 15-100 ΔU = √3·I·(R cosφ + X sinφ)·L.
//         Utiliser b = 1 sous-estimerait la chute relative en triphasé d'un
//         facteur √3, car dropPercent ci-dessous divise par la tension
//         entre phases (voltageV).
//   ρ   = résistivité du conducteur à sa température de service (Ω·mm²/m)
//   L   = longueur du départ (m)
//   S   = section du conducteur (mm²)
//   λ   = réactance linéique (Ω/m) — valeur conventionnelle 0,08 mΩ/m
//   I_B = intensité d'emploi (A)
//
// ρ et λ sont ici les valeurs conventionnelles utilisées par la NF C 15-100 (ρ à
// la température de service, soit 1,25 × ρ₂₀), pas des chiffres inventés. La
// chute relative ΔU/U est comparée aux limites de la norme pour une installation
// alimentée par le réseau public BT (§525) : 3 % éclairage, 5 % autres usages.
// ---------------------------------------------------------------------------
export type Conductor = "copper" | "aluminium";
export type LoadType = "lighting" | "other";

/** Résistivité conventionnelle à la température de service, Ω·mm²/m (NF C 15-100). */
export const RESISTIVITY: Record<Conductor, number> = {
  copper: 0.0225,
  aluminium: 0.036,
};

/** Réactance linéique conventionnelle d'un conducteur, Ω/m (0,08 mΩ/m). */
const REACTANCE_PER_M = 0.00008;

/** Chute de tension relative maximale pour une installation alimentée par le
 *  réseau public BT, en % (NF C 15-100 §525). */
export const VOLTAGE_DROP_LIMIT: Record<LoadType, number> = {
  lighting: 3,
  other: 5,
};

export type VoltageDropInput = {
  phase: Phase;
  conductor: Conductor;
  /** Longueur du départ en mètres. */
  lengthM: number;
  /** Section du conducteur en mm². */
  sectionMm2: number;
  /** Intensité d'emploi I_B en ampères. */
  currentA: number;
  /** Facteur de puissance cos φ, dans (0, 1]. */
  powerFactor: number;
  /** Tension de ligne en volts (pour la chute relative). */
  voltageV: number;
};

export type VoltageDropResult = {
  /** Chute de tension ΔU en volts. */
  dropV: number;
  /** Chute relative ΔU / U en pourcentage. */
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
  const b = i.phase === "single" ? 2 : SQRT_3;
  const rho = RESISTIVITY[i.conductor];
  const cosPhi = i.powerFactor;
  // sin φ à partir de cos φ (φ dans le premier quadrant pour une charge inductive typique).
  const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
  const dropV =
    b *
    (rho * (i.lengthM / i.sectionMm2) * cosPhi + REACTANCE_PER_M * i.lengthM * sinPhi) *
    i.currentA;
  const dropPercent = (dropV / i.voltageV) * 100;
  return { dropV, dropPercent };
}

// Feuilles de calculateurs (FFIE-CALC-01/02, 🟢 Phase 2, adhérents uniquement) —
// les outils fonctionnels lancés depuis les tuiles du hub Outils (ToolsHubView). Le
// segment autonome « Calculateurs » a été retiré lorsque les calculateurs ont fusionné
// dans le hub Outils ; ce module ne fournit désormais que les feuilles (le fichier garde
// son nom pour la stabilité des imports).
//
// PowerCalculatorSheet (puissance ↔ intensité) et VoltageDropSheet calculent en direct
// au fur et à mesure de la saisie, en utilisant les fonctions pures de
// data/calculators.ts. Ils sont présentés comme des aides : les notes de bas de page
// renvoient à la NF C 15-100 pour le véritable choix de dimensionnement plutôt que
// d'inventer des tableaux normatifs (CLAUDE.md : pas de données réelles fabriquées). Les
// invités sont filtrés en amont par le hub Outils avant l'ouverture d'un calculateur.

import React, { useMemo, useState } from "react";
import { X } from "lucide-react-native";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  DEFAULT_POWER_FACTOR,
  DEFAULT_VOLTAGE,
  VOLTAGE_DROP_LIMIT,
  computePower,
  computeVoltageDrop,
  isValidPowerInput,
  isValidVoltageDropInput,
  parseNumber,
  type CalculatorKind,
  type Conductor,
  type LoadType,
  type Phase,
} from "@/data/calculators";

// ---------------------------------------------------------------------------
// PowerCalculatorSheet — puissance ↔ intensité. Le résultat est placé en haut pour
// rester visible pendant que le pavé numérique est ouvert ; les contrôles sont en
// dessous. Calcule en direct à partir des fonctions pures ; affiche un texte d'attente
// tant que les entrées ne sont pas physiquement valides.
//
// Mouvement réduit (P5) : la feuille apparaît sans glissement quand le réglage de l'OS
// est activé, comme les autres feuilles de l'app.
//
// Exporté pour que le hub Outils (ToolsHubView) puisse réutiliser la même feuille depuis
// sa tuile « Calcul de puissance » — un calculateur, deux points d'entrée.
// ---------------------------------------------------------------------------
export function PowerCalculatorSheet({
  visible,
  themeName,
  onClose,
}: {
  visible: boolean;
  themeName: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("single");
  const [powerKw, setPowerKw] = useState("");
  const [voltageV, setVoltageV] = useState(String(DEFAULT_VOLTAGE.single));
  const [powerFactor, setPowerFactor] = useState(String(DEFAULT_POWER_FACTOR));

  // Changer de phase réinitialise la tension à la valeur BT standard de cette phase.
  const onPhaseChange = (next: Phase) => {
    setPhase(next);
    setVoltageV(String(DEFAULT_VOLTAGE[next]));
  };

  const input = useMemo(
    () => ({
      phase,
      powerKw: parseNumber(powerKw),
      voltageV: parseNumber(voltageV),
      powerFactor: parseNumber(powerFactor),
    }),
    [phase, powerKw, voltageV, powerFactor],
  );

  const valid = isValidPowerInput(input);
  const result = valid ? computePower(input) : null;

  return (
    <Modal
      visible={visible}
      animationType={reduceMotion ? "none" : "slide"}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
        {/* Affordance de fermeture — X en haut à droite (cible tactile ≥ 44 pt). */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 8, paddingTop: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <X size={26} color={t.text.body} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: GUTTER }}>
            <Text
              accessibilityRole="header"
              style={{
                color: t.text.body,
                fontSize: 28,
                lineHeight: 34,
                fontFamily: displayFamily("700"),
                fontWeight: "700",
                letterSpacing: -0.6,
              }}
            >
              Puissance & intensité
            </Text>
            <Text style={{ color: t.text.muted, fontSize: 14.5, lineHeight: 22, marginTop: 8 }}>
              Intensité de ligne et puissance apparente d'une charge à partir de sa
              puissance active.
            </Text>
          </View>

          {/* Résultat — gardé en haut pour rester visible au-dessus du clavier. */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: c.cardBg,
                borderRadius: primitives.radii.lg,
                borderWidth: c.cardBorder ? 1 : 0,
                borderColor: c.cardBorder,
                padding: 18,
              }}
            >
              <ResultCell
                label="Intensité"
                value={result ? formatFr(result.currentA, 1) : "—"}
                unit="A"
                themeName={themeName}
                emphasis
              />
              <View style={{ width: 1, backgroundColor: t.border.subtle, marginHorizontal: 18 }} />
              <ResultCell
                label="Puissance apparente"
                value={result ? formatFr(result.apparentKva, 2) : "—"}
                unit="kVA"
                themeName={themeName}
              />
            </View>
            {!valid ? (
              <Text style={{ color: t.text.muted, fontSize: 12.5, lineHeight: 17, marginTop: 8, marginHorizontal: 4 }}>
                Saisissez une puissance, une tension et un facteur de puissance
                (entre 0 et 1) pour obtenir le résultat.
              </Text>
            ) : null}
          </View>

          {/* Phase — monophasé (230 V) vs triphasé (400 V). */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 28 }}>
            <FieldLabel label="Phase" themeName={themeName} />
            <SegmentedControl
              themeName={themeName}
              value={phase}
              options={[
                { key: "single", label: "Monophasé" },
                { key: "three", label: "Triphasé" },
              ]}
              onChange={onPhaseChange}
            />
          </View>

          {/* Entrées. */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 20, rowGap: 16 }}>
            <Input
              themeName={themeName}
              type="decimal"
              label="Puissance active (kW)"
              value={powerKw}
              onChangeText={setPowerKw}
              placeholder="p. ex. 7,5"
            />
            <Input
              themeName={themeName}
              type="decimal"
              label="Tension (V)"
              value={voltageV}
              onChangeText={setVoltageV}
              helperText={phase === "three" ? "Tension entre phases" : "Tension phase-neutre"}
            />
            <Input
              themeName={themeName}
              type="decimal"
              label="Facteur de puissance (cos φ)"
              value={powerFactor}
              onChangeText={setPowerFactor}
              placeholder="p. ex. 0,85"
            />
          </View>

          {/* Note de bas de page — la formule employée + la limite de portée honnête. */}
          <View
            style={{
              marginHorizontal: GUTTER,
              marginTop: 24,
              backgroundColor: c.cardBg,
              borderWidth: c.cardBorder ? 1 : 0,
              borderColor: c.cardBorder,
              borderRadius: primitives.radii.lg,
              padding: 16,
            }}
          >
            <Text style={{ color: t.text.muted, fontSize: 12.5, lineHeight: 19 }}>
              {phase === "three"
                ? "Formule : I = P / (√3 × U × cos φ),  S = P / cos φ."
                : "Formule : I = P / (U × cos φ),  S = P / cos φ."}
              {"\n"}Aide au pré-dimensionnement uniquement : le choix final de la
              protection et de la section de câble est régi par la NF C 15-100.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// VoltageDropSheet — chute de tension. Même forme que la feuille de puissance :
// résultat en haut (ΔU en volts + le % relatif), puis les contrôles. Ajoute une
// pastille de conformité comparant ΔU/U à la limite NF C 15-100 pour l'usage
// sélectionné — l'angle « normes » du module.
//
// Exporté pour que le hub Outils (ToolsHubView) puisse le réutiliser depuis sa tuile
// « Chute de tension ».
// ---------------------------------------------------------------------------
export function VoltageDropSheet({
  visible,
  themeName,
  onClose,
}: {
  visible: boolean;
  themeName: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("single");
  const [conductor, setConductor] = useState<Conductor>("copper");
  const [loadType, setLoadType] = useState<LoadType>("other");
  const [lengthM, setLengthM] = useState("");
  const [sectionMm2, setSectionMm2] = useState("");
  const [currentA, setCurrentA] = useState("");
  const [powerFactor, setPowerFactor] = useState(String(DEFAULT_POWER_FACTOR));
  const [voltageV, setVoltageV] = useState(String(DEFAULT_VOLTAGE.single));

  const onPhaseChange = (next: Phase) => {
    setPhase(next);
    setVoltageV(String(DEFAULT_VOLTAGE[next]));
  };

  const input = useMemo(
    () => ({
      phase,
      conductor,
      lengthM: parseNumber(lengthM),
      sectionMm2: parseNumber(sectionMm2),
      currentA: parseNumber(currentA),
      powerFactor: parseNumber(powerFactor),
      voltageV: parseNumber(voltageV),
    }),
    [phase, conductor, lengthM, sectionMm2, currentA, powerFactor, voltageV],
  );

  const valid = isValidVoltageDropInput(input);
  const result = valid ? computeVoltageDrop(input) : null;
  const limit = VOLTAGE_DROP_LIMIT[loadType];
  const conforme = result ? result.dropPercent <= limit : false;

  return (
    <Modal
      visible={visible}
      animationType={reduceMotion ? "none" : "slide"}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 8, paddingTop: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <X size={26} color={t.text.body} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: GUTTER }}>
            <Text
              accessibilityRole="header"
              style={{
                color: t.text.body,
                fontSize: 28,
                lineHeight: 34,
                fontFamily: displayFamily("700"),
                fontWeight: "700",
                letterSpacing: -0.6,
              }}
            >
              Chute de tension
            </Text>
            <Text style={{ color: t.text.muted, fontSize: 14.5, lineHeight: 22, marginTop: 8 }}>
              Chute de tension d'une canalisation et vérification de sa conformité
              à la NF C 15-100.
            </Text>
          </View>

          {/* Résultat — ΔU et le % relatif, avec une pastille de conformité. */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: c.cardBg,
                borderRadius: primitives.radii.lg,
                borderWidth: c.cardBorder ? 1 : 0,
                borderColor: c.cardBorder,
                padding: 18,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <ResultCell
                  label="Chute ΔU"
                  value={result ? formatFr(result.dropV, 2) : "—"}
                  unit="V"
                  themeName={themeName}
                />
                <View style={{ width: 1, backgroundColor: t.border.subtle, marginHorizontal: 18 }} />
                <ResultCell
                  label="Relative ΔU/U"
                  value={result ? formatFr(result.dropPercent, 2) : "—"}
                  unit="%"
                  themeName={themeName}
                  emphasis
                />
              </View>

              {result ? (
                <ConformityPill conforme={conforme} limit={limit} themeName={themeName} />
              ) : null}
            </View>
            {!valid ? (
              <Text style={{ color: t.text.muted, fontSize: 12.5, lineHeight: 17, marginTop: 8, marginHorizontal: 4 }}>
                Saisissez la longueur, la section, l'intensité d'emploi et le
                facteur de puissance pour obtenir le résultat.
              </Text>
            ) : null}
          </View>

          {/* Phase. */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 28 }}>
            <FieldLabel label="Phase" themeName={themeName} />
            <SegmentedControl
              themeName={themeName}
              value={phase}
              options={[
                { key: "single", label: "Monophasé" },
                { key: "three", label: "Triphasé" },
              ]}
              onChange={onPhaseChange}
            />
          </View>

          {/* Matériau du conducteur. */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 20 }}>
            <FieldLabel label="Conducteur" themeName={themeName} />
            <SegmentedControl
              themeName={themeName}
              value={conductor}
              options={[
                { key: "copper", label: "Cuivre" },
                { key: "aluminium", label: "Aluminium" },
              ]}
              onChange={setConductor}
            />
          </View>

          {/* Usage — fixe la limite de conformité (3 % éclairage / 5 % autre). */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 20 }}>
            <FieldLabel label="Usage" themeName={themeName} />
            <SegmentedControl
              themeName={themeName}
              value={loadType}
              options={[
                { key: "other", label: "Autre usage" },
                { key: "lighting", label: "Éclairage" },
              ]}
              onChange={setLoadType}
            />
          </View>

          {/* Entrées. */}
          <View style={{ paddingHorizontal: GUTTER, marginTop: 20, rowGap: 16 }}>
            <Input
              themeName={themeName}
              type="decimal"
              label="Longueur de ligne (m)"
              value={lengthM}
              onChangeText={setLengthM}
              placeholder="p. ex. 35"
            />
            <Input
              themeName={themeName}
              type="decimal"
              label="Section du conducteur (mm²)"
              value={sectionMm2}
              onChangeText={setSectionMm2}
              placeholder="p. ex. 6"
            />
            <Input
              themeName={themeName}
              type="decimal"
              label="Intensité d'emploi I_B (A)"
              value={currentA}
              onChangeText={setCurrentA}
              placeholder="p. ex. 32"
            />
            <Input
              themeName={themeName}
              type="decimal"
              label="Facteur de puissance (cos φ)"
              value={powerFactor}
              onChangeText={setPowerFactor}
              placeholder="p. ex. 0,85"
            />
            <Input
              themeName={themeName}
              type="decimal"
              label="Tension (V)"
              value={voltageV}
              onChangeText={setVoltageV}
              helperText={phase === "three" ? "Tension entre phases" : "Tension phase-neutre"}
            />
          </View>

          {/* Note de bas de page — formule + la base de la limite. */}
          <View
            style={{
              marginHorizontal: GUTTER,
              marginTop: 24,
              backgroundColor: c.cardBg,
              borderWidth: c.cardBorder ? 1 : 0,
              borderColor: c.cardBorder,
              borderRadius: primitives.radii.lg,
              padding: 16,
            }}
          >
            <Text style={{ color: t.text.muted, fontSize: 12.5, lineHeight: 19 }}>
              ΔU = {phase === "single" ? "2" : "√3"} × (ρ × L/S × cos φ + λ × L × sin φ) × I_B,
              avec ρ et λ aux valeurs conventionnelles de la NF C 15-100.
              {"\n"}Limites pour une installation alimentée par le réseau public BT
              (§525) : 3 % pour l'éclairage, 5 % pour les autres usages.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ConformityPill — le verdict NF C 15-100 sous le résultat de chute de tension.
// La couleur ET le texte portent tous deux le sens (P-indépendance-couleur) : jamais la
// couleur seule. Utilise le jeu de tokens feedback « subtle » pour une pastille teintée
// lisible niveau AA.
function ConformityPill({
  conforme,
  limit,
  themeName,
}: {
  conforme: boolean;
  limit: number;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  const tone = conforme ? t.feedback.subtle.success : t.feedback.subtle.danger;
  const label = conforme ? `Conforme (limite ${limit} %)` : `Dépasse la limite (${limit} %)`;
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{
        alignSelf: "flex-start",
        marginTop: 16,
        backgroundColor: tone.bg,
        borderWidth: 1,
        borderColor: tone.border,
        borderRadius: primitives.radii.full,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text
        style={{
          color: tone.fg,
          fontSize: 12.5,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ResultCell — une valeur étiquetée dans la carte de résultat (valeur + unité + légende).
function ResultCell({
  label,
  value,
  unit,
  themeName,
  emphasis = false,
}: {
  label: string;
  value: string;
  unit: string;
  themeName: ThemeName;
  emphasis?: boolean;
}) {
  const t = themes[themeName];
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: t.text.muted,
          fontSize: 11,
          fontFamily: ralewayFamily("600"),
          fontWeight: "600",
          letterSpacing: 0.4,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 8, columnGap: 4 }}>
        <Text
          style={{
            color: emphasis ? t.brand.accent : t.text.body,
            fontSize: 28,
            lineHeight: 32,
            fontFamily: displayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.6,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        <Text style={{ color: t.text.muted, fontSize: 14, fontFamily: ralewayFamily("600"), fontWeight: "600" }}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

// FieldLabel — reprend le libellé du composant Input pour que le contrôle segmenté
// se lise comme faisant partie du même formulaire.
function FieldLabel({ label, themeName }: { label: string; themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <Text
      style={{
        color: t.text.body,
        fontSize: 13,
        fontFamily: ralewayFamily("600"),
        fontWeight: "600",
        letterSpacing: -0.05,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}

// Formate un nombre avec une précision fixe (point comme séparateur décimal).
function formatFr(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

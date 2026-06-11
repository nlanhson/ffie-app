// Feuilles de réglages du profil — les éditeurs derrière les lignes actionnables
// de l'onglet Profil (Région affichée, Centres d'intérêt, Modifier le profil,
// Changer le mot de passe).
//
// La v1 est une UI simulée sans backend de profil/auth (voir CLAUDE.md →
// « Auth and membership are mocked UI »). Ces feuilles sont donc pleinement
// FONCTIONNELLES mais LOCALES : elles valident et animent, et leurs résultats
// sont conservés dans l'état de ProfileScreen pour la session — elles n'appellent
// pas de serveur. Chaque feuille le précise dans une note de bas de page pour ne
// pas tromper le testeur TestFlight.
//
// Les quatre partagent une même ossature (SettingsSheet) : un Modal plein écran
// qui glisse vers le haut avec son propre SafeAreaProvider neuf (le correctif de
// compounding d'inset utilisé dans toute l'app), une barre de navigation façon
// iOS Annuler / Titre / Enregistrer, et un corps défilant. Les listes réutilisent
// les primitives partagées InsetGroup / InsetRow ; les formulaires utilisent un
// petit Field étiqueté.
//
// Mouvement réduit (P5) : l'animation de glissement se réduit à une présentation
// instantanée quand le réglage « Réduire les animations » de l'OS est activé.

import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";
import { Check } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  GUTTER,
  InsetGroup,
  InsetRow,
  useGroupedColors,
} from "@/components/ui/ios";

// ---------------------------------------------------------------------------
// SettingsSheet — ossature partagée (Modal + barre de navigation + corps défilant).
// ---------------------------------------------------------------------------
function SettingsSheet({
  visible,
  title,
  onClose,
  onSave,
  saveLabel = "Enregistrer",
  saveDisabled = false,
  themeName,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  /** À omettre pour les listes à application immédiate (ex. le sélecteur de région) — pas de bouton Enregistrer. */
  onSave?: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  themeName: ThemeName;
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const t = themes[themeName];
  const c = useGroupedColors(themeName);

  return (
    <Modal
      visible={visible}
      animationType={reducedMotion ? "none" : "slide"}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      {/* Provider neuf par surcouche pour que l'inset du haut ne soit pas compté
          en double à travers l'hôte de modal natif (le correctif de compounding
          d'inset utilisé dans toute l'app). */}
      <SafeAreaProvider>
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
          <StatusBar style={themeName === "dark" ? "light" : "dark"} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            {/* Barre de navigation — Annuler · Titre · Enregistrer, colonnes latérales équilibrées. */}
            <View style={styles.navBar}>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Annuler"
                style={styles.navSide}
              >
                <Text style={[styles.navAction, { color: t.text.muted }]}>Annuler</Text>
              </Pressable>
              <Text
                style={[styles.navTitle, { color: t.text.body }]}
                numberOfLines={1}
                accessibilityRole="header"
              >
                {title}
              </Text>
              <View style={[styles.navSide, { alignItems: "flex-end" }]}>
                {onSave ? (
                  <Pressable
                    onPress={onSave}
                    disabled={saveDisabled}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={saveLabel}
                    accessibilityState={{ disabled: saveDisabled }}
                  >
                    <Text
                      style={[
                        styles.navAction,
                        styles.navSave,
                        { color: saveDisabled ? t.text.placeholder : t.brand.accent },
                      ]}
                    >
                      {saveLabel}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.border.default }} />

            <ScrollView
              contentContainerStyle={{ paddingVertical: 20 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Field — un champ de saisie étiqueté pour les feuilles de formulaire.
// ---------------------------------------------------------------------------
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  themeName,
  autoFocus = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = "sentences",
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  themeName: ThemeName;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}) {
  const t = themes[themeName];
  return (
    <View style={{ marginBottom: 18, paddingHorizontal: GUTTER }}>
      <Text style={[styles.fieldLabel, { color: t.text.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.text.placeholder}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        accessibilityLabel={label}
        style={[
          styles.fieldInput,
          {
            backgroundColor: t.surface.subtle,
            color: t.text.body,
            borderColor: error ? t.feedback.danger : t.border.default,
          },
        ]}
      />
      {error ? (
        <Text style={[styles.fieldError, { color: t.feedback.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

// Une courte note de bas de page explicative sous un formulaire/une liste,
// précisant le comportement local uniquement (simulé) pour que l'aperçu reste honnête.
function Footnote({ children, themeName }: { children: string; themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <Text style={[styles.footnote, { color: t.text.muted }]}>{children}</Text>
  );
}

// ---------------------------------------------------------------------------
// EditProfileSheet — nom / intitulé de poste / entreprise.
// ---------------------------------------------------------------------------
export type EditableProfile = {
  fullName: string;
  jobTitle: string;
  companyName: string;
};

export function EditProfileSheet({
  visible,
  initial,
  onClose,
  onSave,
  themeName,
}: {
  visible: boolean;
  initial: EditableProfile;
  onClose: () => void;
  onSave: (next: EditableProfile) => void;
  themeName: ThemeName;
}) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [jobTitle, setJobTitle] = useState(initial.jobTitle);
  const [companyName, setCompanyName] = useState(initial.companyName);

  // Réinitialise le brouillon à chaque ouverture de la feuille pour qu'une
  // modification annulée ne persiste pas à l'ouverture suivante.
  useEffect(() => {
    if (visible) {
      setFullName(initial.fullName);
      setJobTitle(initial.jobTitle);
      setCompanyName(initial.companyName);
    }
  }, [visible, initial.fullName, initial.jobTitle, initial.companyName]);

  const trimmed = {
    fullName: fullName.trim(),
    jobTitle: jobTitle.trim(),
    companyName: companyName.trim(),
  };
  const dirty =
    trimmed.fullName !== initial.fullName ||
    trimmed.jobTitle !== initial.jobTitle ||
    trimmed.companyName !== initial.companyName;
  const valid = trimmed.fullName.length > 0;

  return (
    <SettingsSheet
      visible={visible}
      title="Modifier le profil"
      onClose={onClose}
      onSave={() => onSave(trimmed)}
      saveDisabled={!dirty || !valid}
      themeName={themeName}
    >
      <Field
        label="Nom complet"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Votre nom"
        autoFocus
        autoCapitalize="words"
        error={fullName.length > 0 && !valid ? "Le nom ne peut pas être vide." : undefined}
        themeName={themeName}
      />
      <Field
        label="Intitulé de poste"
        value={jobTitle}
        onChangeText={setJobTitle}
        placeholder="ex. Responsable technique"
        autoCapitalize="words"
        themeName={themeName}
      />
      <Field
        label="Raison sociale"
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Entreprise"
        autoCapitalize="characters"
        themeName={themeName}
      />
      <Footnote themeName={themeName}>
        Enregistré sur cet appareil pour l'aperçu — les modifications du profil ne
        sont pas encore synchronisées avec la FFIE.
      </Footnote>
    </SettingsSheet>
  );
}

// ---------------------------------------------------------------------------
// ChangePasswordSheet — actuel / nouveau / confirmation, avec validation locale.
// ---------------------------------------------------------------------------
const MIN_PASSWORD = 8;

export function ChangePasswordSheet({
  visible,
  onClose,
  onUpdated,
  themeName,
}: {
  visible: boolean;
  onClose: () => void;
  /** Appelé lorsqu'un nouveau mot de passe valide est soumis (simulation locale — pas de serveur). */
  onUpdated: () => void;
  themeName: ThemeName;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (visible) {
      setCurrent("");
      setNext("");
      setConfirm("");
    }
  }, [visible]);

  const longEnough = next.length >= MIN_PASSWORD;
  const matches = next.length > 0 && next === confirm;
  const canSave = current.length > 0 && longEnough && matches;

  const nextError =
    next.length > 0 && !longEnough ? `Utilisez au moins ${MIN_PASSWORD} caractères.` : undefined;
  const confirmError =
    confirm.length > 0 && next !== confirm ? "Les mots de passe ne correspondent pas." : undefined;

  return (
    <SettingsSheet
      visible={visible}
      title="Changer le mot de passe"
      saveLabel="Mettre à jour"
      onClose={onClose}
      onSave={onUpdated}
      saveDisabled={!canSave}
      themeName={themeName}
    >
      <Field
        label="Mot de passe actuel"
        value={current}
        onChangeText={setCurrent}
        placeholder="Mot de passe actuel"
        secureTextEntry
        autoCapitalize="none"
        autoFocus
        themeName={themeName}
      />
      <Field
        label="Nouveau mot de passe"
        value={next}
        onChangeText={setNext}
        placeholder={`Au moins ${MIN_PASSWORD} caractères`}
        secureTextEntry
        autoCapitalize="none"
        error={nextError}
        themeName={themeName}
      />
      <Field
        label="Confirmer le nouveau mot de passe"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Saisissez à nouveau le nouveau mot de passe"
        secureTextEntry
        autoCapitalize="none"
        error={confirmError}
        themeName={themeName}
      />
      <Footnote themeName={themeName}>
        Cet aperçu valide votre saisie mais ne change pas un vrai mot de passe —
        la connexion est simulée en v1.
      </Footnote>
    </SettingsSheet>
  );
}

// ---------------------------------------------------------------------------
// RegionPickerSheet — liste à sélection unique des régions de la fédération
// française. Ce sont de vraies régions administratives publiques (pas des données
// fabriquées) ; la région de l'adhérent est un état de compte simulé.
// ---------------------------------------------------------------------------
export const FR_REGIONS = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
  "Guadeloupe",
  "Martinique",
  "Guyane",
  "La Réunion",
  "Mayotte",
] as const;

export function RegionPickerSheet({
  visible,
  selected,
  onClose,
  onSelect,
  themeName,
}: {
  visible: boolean;
  selected: string;
  onClose: () => void;
  /** Application immédiate : sélectionner une région la valide et ferme la feuille. */
  onSelect: (region: string) => void;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  return (
    <SettingsSheet visible={visible} title="Région affichée" onClose={onClose} themeName={themeName}>
      <InsetGroup
        themeName={themeName}
        footer="La région dont les actualités et les événements apparaissent en premier dans toute l'app."
      >
        {FR_REGIONS.map((region, i) => (
          <InsetRow
            key={region}
            title={region}
            themeName={themeName}
            isLast={i === FR_REGIONS.length - 1}
            showChevron={false}
            trailing={
              region === selected ? <Check size={20} color={t.brand.accent} strokeWidth={2.5} /> : undefined
            }
            onPress={() => onSelect(region)}
            accessibilityLabel={`${region}${region === selected ? ", sélectionnée" : ""}`}
          />
        ))}
      </InsetGroup>
    </SettingsSheet>
  );
}

// ---------------------------------------------------------------------------
// InterestsSheet — liste à sélection multiple, validée à l'enregistrement.
// ---------------------------------------------------------------------------
export const INTEREST_OPTIONS = [
  { key: "regulatory", label: "Actualités réglementaires" },
  { key: "training", label: "Formation et certification" },
  { key: "events", label: "Événements et réseautage" },
  { key: "partners", label: "Offres partenaires" },
  { key: "technical", label: "Ressources techniques" },
  { key: "news", label: "Actualités de la fédération" },
] as const;

export type InterestKey = (typeof INTEREST_OPTIONS)[number]["key"];

export function InterestsSheet({
  visible,
  selected,
  onClose,
  onSave,
  themeName,
}: {
  visible: boolean;
  selected: InterestKey[];
  onClose: () => void;
  onSave: (next: InterestKey[]) => void;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  const [draft, setDraft] = useState<InterestKey[]>(selected);

  useEffect(() => {
    if (visible) setDraft(selected);
  }, [visible, selected]);

  const toggle = (key: InterestKey) =>
    setDraft((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const dirty =
    draft.length !== selected.length || draft.some((k) => !selected.includes(k));

  return (
    <SettingsSheet
      visible={visible}
      title="Centres d'intérêt"
      onClose={onClose}
      onSave={() => onSave(draft)}
      saveDisabled={!dirty}
      themeName={themeName}
    >
      <InsetGroup
        themeName={themeName}
        footer="Nous utilisons vos centres d'intérêt pour prioriser ce que vous voyez dans toute l'app."
      >
        {INTEREST_OPTIONS.map((opt, i) => {
          const on = draft.includes(opt.key);
          return (
            <InsetRow
              key={opt.key}
              title={opt.label}
              themeName={themeName}
              isLast={i === INTEREST_OPTIONS.length - 1}
              showChevron={false}
              trailing={on ? <Check size={20} color={t.brand.accent} strokeWidth={2.5} /> : undefined}
              onPress={() => toggle(opt.key)}
              accessibilityLabel={`${opt.label}${on ? ", sélectionné" : ", non sélectionné"}`}
            />
          );
        })}
      </InsetGroup>
    </SettingsSheet>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GUTTER,
    minHeight: 52,
    columnGap: 8,
  },
  navSide: {
    minWidth: 72,
    justifyContent: "center",
  },
  navAction: {
    fontSize: 16,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
  },
  navSave: {
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 7,
    marginLeft: 2,
  },
  fieldInput: {
    height: 52,
    borderRadius: primitives.radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: ralewayFamily("400"),
  },
  fieldError: {
    marginTop: 6,
    marginLeft: 2,
    fontSize: 12.5,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
  },
  footnote: {
    paddingHorizontal: GUTTER + 2,
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 17,
  },
});

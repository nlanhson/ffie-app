// Profile settings sheets — the editors behind the Profile tab's actionable
// rows (Region displayed, Interests, Edit profile, Change password).
//
// v1 is mocked UI with no profile/auth backend (see CLAUDE.md → "Auth and
// membership are mocked UI"). These sheets are therefore fully FUNCTIONAL but
// LOCAL: they validate and animate, and their results are held in ProfileScreen
// state for the session — they don't call a server. Each sheet says so in a
// footnote so the TestFlight tester isn't misled.
//
// All four share one scaffold (SettingsSheet): a full-screen slide-up Modal with
// its own fresh SafeAreaProvider (the inset-compounding fix used app-wide), an
// iOS-style Cancel / Title / Save nav bar, and a scrolling body. Lists reuse the
// shared InsetGroup / InsetRow primitives; forms use a small labelled Field.
//
// Reduced motion (P5): the slide animation collapses to an instant present when
// the OS "Reduce Motion" setting is on.

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
// SettingsSheet — shared scaffold (Modal + nav bar + scrolling body).
// ---------------------------------------------------------------------------
function SettingsSheet({
  visible,
  title,
  onClose,
  onSave,
  saveLabel = "Save",
  saveDisabled = false,
  themeName,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  /** Omit for tap-to-apply lists (e.g. the region picker) — no Save button. */
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
      {/* Fresh provider per overlay so the top inset isn't double-counted
          through the native modal host (the app-wide inset-compounding fix). */}
      <SafeAreaProvider>
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
          <StatusBar style={themeName === "dark" ? "light" : "dark"} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            {/* Nav bar — Cancel · Title · Save, balanced side columns. */}
            <View style={styles.navBar}>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                style={styles.navSide}
              >
                <Text style={[styles.navAction, { color: t.text.muted }]}>Cancel</Text>
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
// Field — a labelled text input for the form sheets.
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

// A short explanatory footnote under a form/list, clarifying the local-only
// (mock) behaviour so the preview build reads honestly.
function Footnote({ children, themeName }: { children: string; themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <Text style={[styles.footnote, { color: t.text.muted }]}>{children}</Text>
  );
}

// ---------------------------------------------------------------------------
// EditProfileSheet — name / job title / company.
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

  // Re-seed the draft each time the sheet opens so a cancelled edit doesn't
  // persist into the next open.
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
      title="Edit profile"
      onClose={onClose}
      onSave={() => onSave(trimmed)}
      saveDisabled={!dirty || !valid}
      themeName={themeName}
    >
      <Field
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Your name"
        autoFocus
        autoCapitalize="words"
        error={fullName.length > 0 && !valid ? "Name can't be empty." : undefined}
        themeName={themeName}
      />
      <Field
        label="Job title"
        value={jobTitle}
        onChangeText={setJobTitle}
        placeholder="e.g. Technical Manager"
        autoCapitalize="words"
        themeName={themeName}
      />
      <Field
        label="Company name"
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Company"
        autoCapitalize="characters"
        themeName={themeName}
      />
      <Footnote themeName={themeName}>
        Saved on this device for the preview — profile changes don't sync to FFIE
        yet.
      </Footnote>
    </SettingsSheet>
  );
}

// ---------------------------------------------------------------------------
// ChangePasswordSheet — current / new / confirm, with local validation.
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
  /** Called when a valid new password is submitted (local mock — no server). */
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
    next.length > 0 && !longEnough ? `Use at least ${MIN_PASSWORD} characters.` : undefined;
  const confirmError =
    confirm.length > 0 && next !== confirm ? "Passwords don't match." : undefined;

  return (
    <SettingsSheet
      visible={visible}
      title="Change password"
      saveLabel="Update"
      onClose={onClose}
      onSave={onUpdated}
      saveDisabled={!canSave}
      themeName={themeName}
    >
      <Field
        label="Current password"
        value={current}
        onChangeText={setCurrent}
        placeholder="Current password"
        secureTextEntry
        autoCapitalize="none"
        autoFocus
        themeName={themeName}
      />
      <Field
        label="New password"
        value={next}
        onChangeText={setNext}
        placeholder={`At least ${MIN_PASSWORD} characters`}
        secureTextEntry
        autoCapitalize="none"
        error={nextError}
        themeName={themeName}
      />
      <Field
        label="Confirm new password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Re-enter new password"
        secureTextEntry
        autoCapitalize="none"
        error={confirmError}
        themeName={themeName}
      />
      <Footnote themeName={themeName}>
        This preview validates your entry but doesn't change a real password —
        sign-in is mocked in v1.
      </Footnote>
    </SettingsSheet>
  );
}

// ---------------------------------------------------------------------------
// RegionPickerSheet — single-select list of the French federation regions.
// These are real public administrative regions (not fabricated data); the
// member's region is mock account state.
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
  /** Tap-to-apply: selecting a region commits it and closes the sheet. */
  onSelect: (region: string) => void;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  return (
    <SettingsSheet visible={visible} title="Region displayed" onClose={onClose} themeName={themeName}>
      <InsetGroup
        themeName={themeName}
        footer="The region whose news and events appear first across the app."
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
            accessibilityLabel={`${region}${region === selected ? ", selected" : ""}`}
          />
        ))}
      </InsetGroup>
    </SettingsSheet>
  );
}

// ---------------------------------------------------------------------------
// InterestsSheet — multi-select list, committed on Save.
// ---------------------------------------------------------------------------
export const INTEREST_OPTIONS = [
  { key: "regulatory", label: "Regulatory updates" },
  { key: "training", label: "Training & certification" },
  { key: "events", label: "Events & networking" },
  { key: "partners", label: "Partner offers" },
  { key: "technical", label: "Technical resources" },
  { key: "news", label: "Federation news" },
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
      title="Interests"
      onClose={onClose}
      onSave={() => onSave(draft)}
      saveDisabled={!dirty}
      themeName={themeName}
    >
      <InsetGroup
        themeName={themeName}
        footer="We use your interests to prioritise what you see across the app."
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
              accessibilityLabel={`${opt.label}${on ? ", selected" : ", not selected"}`}
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

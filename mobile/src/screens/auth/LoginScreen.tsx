// Member sign-in — the "Member & Professional Space" login screen.
//
// A teal hero + white sheet, matching the Home header (HEADER_SURFACE teal).
// The teal band up top carries only large white display text (logo chip +
// "Welcome"); the whole form drops onto a white sheet below where every label
// and control clears WCAG AA. Colors live in auth.login (tokens.ts). Reached
// two ways, both as a full-screen slide-up Modal with its own SafeAreaProvider:
//   - Onboarding: PathSelection → "Sign in" → here → (Connect) authenticated.
//   - Guest shell: "I already have an account" → here (SignInFlow).
//
// Layout (top → bottom):
//   - Header bar: subtle back chevron (left) + centered "FFIE" wordmark.
//   - Brand: FFIE logo in a white card, "Welcome", "Member & Professional Space".
//   - Identifier field + password field.
//   - "Connect" CTA — disabled until both fields have content.
//   - "Forgot your password?" / "Help & contact" link row.
//   - "or" divider → "SSO federation connection" (lock).
//   - Footer: "The FFIE is a member of the FFB" note + "Not yet a member?
//     Join the FFIE →" bar.
//
// v1 mock: any well-formed identifier + password authenticates (no backend);
// SSO opens the federation picker → federation sign-in (verification) before
// authenticating; Forgot / Help are inert. Don't wire these to a real API
// without explicit instruction (see TESTFLIGHT.md / CLAUDE.md).

import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArrowRight, ChevronLeft, Lock } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "@/screens/auth/tokens";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { FFBLogo } from "@/components/ui/FFBLogo";
import { SSOFlow } from "@/screens/auth/SSOFlow";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

const L = auth.login;

export function LoginScreen({
  initialIdentifier,
  onBack,
  onSubmit,
  onSso,
  onForgotPassword,
  onHelp,
  onJoin,
}: {
  initialIdentifier?: string;
  onBack: () => void;
  // Connect with a well-formed identifier + password — v1 accepts any.
  onSubmit: (identifier: string) => void;
  onSso?: () => void;
  onForgotPassword?: () => void;
  onHelp?: () => void;
  onJoin?: () => void;
}) {
  const [identifier, setIdentifier] = useState(initialIdentifier ?? "");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"identifier" | "password" | null>(null);
  // The "SSO federation connection" button opens the SSO flow in-place: pick
  // your federation → sign in to it (verification) → onSso fires. Selecting a
  // federation alone no longer authenticates.
  const [ssoOpen, setSsoOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const trimmedId = identifier.trim();
  const canConnect = trimmedId.length > 0 && password.length > 0;
  const submit = () => canConnect && onSubmit(trimmedId);

  if (ssoOpen) {
    return (
      <SSOFlow
        onCancel={() => setSsoOpen(false)}
        onAuthenticated={() => {
          setSsoOpen(false);
          onSso?.();
        }}
      />
    );
  }

  return (
    // Only the TOP edge here — the white form sheet runs to the very bottom and
    // pads its own content for the home indicator (insets.bottom).
    <SafeAreaView edges={["top"]} style={styles.root}>
      {/* Teal hero surface — force light status-bar content (white clock /
          battery). The deepest-mounted StatusBar wins while this screen shows. */}
      <StatusBar style="light" />

      {/* Header — subtle back affordance (the modal needs a way out; the
          mockup's centered wordmark stays) + centered "FFIE". */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.pressedDim]}
        >
          <ChevronLeft size={24} color={L.headerLabel} />
        </Pressable>
        <Text style={styles.headerTitle}>FFIE</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero — white logo chip + "Welcome" on the teal band. */}
          <View style={styles.brand}>
            <View style={styles.logoCard}>
              <FFIELogo size={56} themeName="light" />
            </View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Member &amp; Professional Space</Text>
          </View>

          {/* White form sheet — rounded top, runs to the bottom edge. Every
              small label + control rides this white surface so it clears AA
              (the teal hero above only carries large white display text). */}
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Credentials */}
          <View style={styles.fields}>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              onFocus={() => setFocused("identifier")}
              onBlur={() => setFocused(null)}
              placeholder="Email address or identifier FFIE"
              placeholderTextColor={L.field.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              accessibilityLabel="Email address or FFIE identifier"
              style={[styles.field, focused === "identifier" && styles.fieldFocused]}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Password"
              placeholderTextColor={L.field.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={submit}
              accessibilityLabel="Password"
              style={[styles.field, focused === "password" && styles.fieldFocused]}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canConnect }}
            accessibilityLabel="Connect"
            disabled={!canConnect}
            onPress={submit}
            style={({ pressed }) => [
              styles.cta,
              canConnect ? styles.ctaActive : styles.ctaDisabled,
              canConnect && pressed && styles.ctaPressed,
            ]}
          >
            <Text style={[styles.ctaLabel, !canConnect && styles.ctaLabelDisabled]}>
              Connect
            </Text>
          </Pressable>

          {/* Recovery + help — inert in v1. */}
          <View style={styles.linkRow}>
            <Pressable
              accessibilityRole="link"
              onPress={onForgotPassword}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressedDim}
            >
              <Text style={styles.link}>Forgot your password?</Text>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              onPress={onHelp}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressedDim}
            >
              <Text style={styles.link}>Help &amp; contact</Text>
            </Pressable>
          </View>

          {/* "or" divider */}
          <View style={styles.dividerRow}>
            <View style={styles.rule} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.rule} />
          </View>

          {/* SSO — opens the federation picker; confirming there authenticates. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="SSO federation connection"
            onPress={() => {
              Keyboard.dismiss();
              setSsoOpen(true);
            }}
            style={({ pressed }) => [styles.sso, pressed && styles.ssoPressed]}
          >
            <Lock size={18} color={L.sso.fg} />
            <Text style={styles.ssoLabel}>SSO federation connection</Text>
          </Pressable>

          {/* Pushes the footer to the bottom when content is short. */}
          <View style={styles.flex} />

          {/* Footer — FFB affiliation note + join bar. */}
          <View style={styles.footer}>
            <View style={styles.fbbNote}>
              {/* Logo carries its own white background; clip to a rounded tile
                  so it reads as a white chip on the navy footer. */}
              <View style={styles.fbbMark}>
                <FFBLogo size={32} />
              </View>
              <Text style={styles.fbbText}>
                The FFIE is a member{"\n"}of the FFB
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Not yet a member? Join the FFIE"
              onPress={() => {
                Keyboard.dismiss();
                onJoin?.();
              }}
              style={({ pressed }) => [styles.joinBar, pressed && styles.joinBarPressed]}
            >
              <Text style={styles.joinText}>
                Not yet a member? <Text style={styles.joinAccent}>Join the FFIE</Text>
              </Text>
              <ArrowRight size={16} color={L.accent} />
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: L.bg },
  flex: { flex: 1 },
  pressedDim: { opacity: 0.6 },

  header: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    position: "absolute",
    left: 12,
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: L.headerLabel,
    fontSize: 15,
    fontFamily: displayFamily("600"),
    fontWeight: "600",
    letterSpacing: 1,
  },

  scroll: {
    flexGrow: 1,
  },

  // White form sheet — rounded top, grows to fill below the teal hero.
  sheet: {
    flexGrow: 1,
    backgroundColor: L.sheet,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  brand: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  logoCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 16,
    color: L.title,
    fontSize: 26,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    color: L.subtitle,
    fontSize: 14,
    fontFamily: ralewayFamily("400"),
  },

  fields: {
    rowGap: 12,
  },
  field: {
    height: L.field.height,
    borderRadius: L.radius,
    paddingHorizontal: 16,
    backgroundColor: L.field.bg,
    borderWidth: 1,
    borderColor: L.field.border,
    color: L.field.text,
    fontSize: 16,
    fontFamily: ralewayFamily("400"),
  },
  fieldFocused: {
    borderColor: L.field.borderFocus,
  },

  cta: {
    marginTop: 16,
    height: L.cta.height,
    borderRadius: L.radius,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaActive: { backgroundColor: L.cta.bg },
  ctaPressed: { backgroundColor: L.cta.bgPressed },
  ctaDisabled: { backgroundColor: L.cta.bgDisabled },
  ctaLabel: {
    color: L.cta.fg,
    fontSize: 16,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  ctaLabelDisabled: { color: L.cta.fgDisabled },

  linkRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    color: L.link,
    fontSize: 13,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  dividerRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: L.divider,
  },
  dividerLabel: {
    color: L.footer.noteText, // navy on the white sheet (not the white hero subtitle)
    fontSize: 13,
    fontFamily: ralewayFamily("400"),
  },

  sso: {
    marginTop: 24,
    height: 52,
    borderRadius: L.radius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: L.sso.bg,
    borderWidth: 1,
    borderColor: L.sso.border,
  },
  ssoPressed: { backgroundColor: L.sso.bgPressed },
  ssoLabel: {
    color: L.sso.fg,
    fontSize: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
  },

  footer: {
    marginTop: 24,
    rowGap: 16,
  },
  fbbNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  fbbMark: {
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  fbbText: {
    color: L.footer.noteText,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: ralewayFamily("400"),
  },
  joinBar: {
    height: 52,
    borderRadius: L.radius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
    backgroundColor: L.footer.bg,
    borderWidth: 1,
    borderColor: L.footer.border,
  },
  joinBarPressed: { opacity: 0.7 },
  joinText: {
    color: L.footer.noteText, // navy on the white sheet (not the white hero subtitle)
    fontSize: 14,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
  },
  joinAccent: {
    color: L.accent,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
  },
});

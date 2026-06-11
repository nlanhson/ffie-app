// Biometric Prompt — offers Face ID / Touch ID after a successful sign-in.
// Per Julien's persona: "Will use FaceID/TouchID 100% of the time once set up.
// Will rage-quit if forced to re-type his password weekly." Primary CTA is
// enable; the "Later" ghost gives him an out without friction.
//
// Trust messaging:
//   - "Your credentials stay protected on your device" addresses
//     his "doesn't trust new apps with credentials" pain point.
//   - No checkmark list, no marketing slides — one screen, one decision.
//
// Implementation note: this is a UI-only scaffold. Wiring to expo-local-
// authentication (LocalAuthentication.authenticateAsync) lands when the
// real auth flow does.

import React from "react";
import {
  ChevronLeft,
  Fingerprint,
  ScanFace,
  ShieldCheck,
} from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { ralewayFamily } from "@/theme/fonts";

export function BiometricPromptScreen({
  themeName = "light",
  memberIdentifier,
  onBack,
  onEnable,
  onSkip,
}: {
  themeName?: ThemeName;
  memberIdentifier?: string;
  onBack?: () => void;
  onEnable: () => void;
  onSkip: () => void;
}) {
  const t = themes[themeName];

  const isiOS = Platform.OS === "ios";
  const BioIcon = isiOS ? ScanFace : Fingerprint;
  const biometricName = isiOS ? "Face ID" : "biometric data";

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
        {/* Back row — returns to the sign-in screen so the user can correct
            their identifier before binding biometrics. Optional: in flows
            where the previous screen is irrecoverable (e.g. SSO success),
            the caller omits `onBack` and we render nothing here. */}
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              columnGap: 4,
              paddingVertical: 8,
              paddingRight: 12,
              marginBottom: 8,
            }}
          >
            <ChevronLeft size={20} color={t.text.muted} />
            <Text style={{ fontSize: 15, color: t.text.muted }}>Back</Text>
          </Pressable>
        ) : null}

        {/* Spacer for visual centering of the hero */}
        <View style={{ flex: 0.25 }} />

        {/* Hero: large biometric icon */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
              borderWidth: 2,
              borderColor: t.brand.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <BioIcon size={48} color={t.brand.accent} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: ralewayFamily("700"), fontWeight: "700",
              color: t.text.body,
              textAlign: "center",
              letterSpacing: -0.3,
              lineHeight: 30,
              maxWidth: 320,
            }}
          >
            {isiOS ? "Enable Face ID?" : "Enable biometric sign-in?"}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: t.text.muted,
              textAlign: "center",
              lineHeight: 22,
              marginTop: 12,
              maxWidth: 320,
            }}
          >
            Open the app in an instant, without entering your credentials every time.
          </Text>

          {memberIdentifier ? (
            <View
              style={{
                marginTop: 24,
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
                backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
                borderRadius: primitives.radii.md,
                paddingHorizontal: 12,
                paddingVertical: 8,
                maxWidth: 320,
              }}
            >
              <ShieldCheck size={16} color={t.feedback.success} />
              <Text style={{ fontSize: 13, color: t.text.muted, flexShrink: 1 }} numberOfLines={1}>
                Signed in as {memberIdentifier}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Trust paragraph */}
        <View
          style={{
            marginTop: 32,
            padding: 16,
            borderRadius: primitives.radii.md,
            backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
            borderWidth: 1,
            borderColor: t.border.subtle,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: t.text.muted,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Your credentials stay protected on your device. FFIE never receives your {biometricName}.
          </Text>
        </View>

        {/* Spacer pushes actions to the bottom (P1: one-handed bottom reach) */}
        <View style={{ flex: 1 }} />

        {/* Actions */}
        <View style={{ rowGap: 8 }}>
          <Button
            themeName={themeName}
            size="lg"
            fullWidth
            onPress={onEnable}
            iconLeading={BioIcon}
            accessibilityLabel={`Enable ${biometricName}`}
          >
            {isiOS ? "Enable Face ID" : "Enable biometric data"}
          </Button>
          <Button
            themeName={themeName}
            variant="ghost"
            size="md"
            fullWidth
            onPress={onSkip}
            accessibilityHint="You can enable it later from Settings."
          >
            Later
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

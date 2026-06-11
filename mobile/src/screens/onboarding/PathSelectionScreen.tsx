// Welcome / Path Selection — v2.
//
// Layout (Mobbin-style poster + bottom card):
//   - Full-bleed home-banner-bg.jpg behind everything.
//   - Thin scrim so the top-left header reads on the dark sky band.
//   - Header: small FFIE logo + wordmark, anchored top-left.
//   - Bottom card: white, rounded top corners only, "Get started" heading
//     + one-line subtitle, then two stacked CTAs (Log in / Browse freely).
//
// Sign-up is deliberately omitted — FFIE federation members are admitted
// by FFIE staff, not self-onboarded on the app. If self-signup is later
// enabled, add a ghost "Sign up" button under the primary "Log in" CTA.

import React from "react";
import { ArrowRight } from "lucide-react-native";
import {
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes, type ThemeName } from "@tokens";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

const BG = require("../../../assets/home-banner-bg.jpg");

export type OnboardingPath = "member" | "discover";

export function PathSelectionScreen({
  themeName = "light",
  onSelect,
}: {
  themeName?: ThemeName;
  onSelect: (path: OnboardingPath) => void;
}) {
  const t = themes[themeName];

  return (
    <View style={styles.root}>
      {/* This screen is a fixed dark photo in every theme, so the status bar
          must always use light (white) content — independent of the app's
          theme-driven global StatusBar. The deepest-mounted StatusBar wins
          while this screen is shown, then reverts on navigate-away. */}
      <StatusBar style="light" />
      <ImageBackground source={BG} resizeMode="cover" style={StyleSheet.absoluteFill} />
      {/* Subtle scrim — keeps the white header text readable on the
          image without dulling the photo. */}
      <View style={styles.scrim} pointerEvents="none" />

      <View style={styles.layout}>
        <SafeAreaView edges={["top"]} style={styles.posterArea}>
          {/* Centered logo + welcome text sit roughly in the upper third
              of the visible image, above the white card. */}
          <View style={{ flex: 1 }} />
          <View style={styles.poster}>
            <FFIELogo size={104} themeName="dark" />
            <Text style={styles.posterTitle}>Welcome to FFIE</Text>
          </View>
          <View style={{ flex: 1.4 }} />
        </SafeAreaView>

        <View style={[styles.card, Platform.OS === "android" && styles.cardAndroid]}>
          <Text style={styles.cardHeading}>Get started</Text>
          <Text style={styles.subtitle}>
            Members and visitors alike — everyone has their own path from here.
          </Text>

          <View style={styles.actions}>
            <PrimaryAction
              label="Sign in"
              accessibilityLabel="Sign in as an FFIE member"
              onPress={() => onSelect("member")}
              bg={t.action.primary.bg}
              bgPressed={t.action.primary.bgPressed}
            />
            <SecondaryAction
              label="Browse freely"
              accessibilityLabel="Continue as a visitor"
              onPress={() => onSelect("discover")}
            />
          </View>

          <SafeAreaView edges={["bottom"]} />
        </View>
      </View>
    </View>
  );
}

function PrimaryAction({
  label,
  accessibilityLabel,
  onPress,
  bg,
  bgPressed,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: (e: GestureResponderEvent) => void;
  bg: string;
  bgPressed: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cta,
        { backgroundColor: pressed ? bgPressed : bg },
      ]}
    >
      <Text style={styles.ctaLabelPrimary}>{label}</Text>
      <ArrowRight size={18} color="#FFFFFF" />
    </Pressable>
  );
}

function SecondaryAction({
  label,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: (e: GestureResponderEvent) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.ctaOutline,
        pressed && styles.ctaOutlinePressed,
      ]}
    >
      <Text style={styles.ctaLabelSecondary}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0E18" },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  layout: { flex: 1, justifyContent: "space-between" },

  posterArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  poster: {
    alignItems: "center",
    rowGap: 16,
  },
  posterTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: displayFamily("600"), fontWeight: "600",
    letterSpacing: -0.4,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 8,
  },
  // Android's bottom safe-area inset is much smaller than iOS's home-indicator
  // inset, so the empty SafeAreaView spacer below the CTAs leaves the card
  // hugging the screen edge. Add breathing room on Android only (iOS is fine).
  cardAndroid: {
    paddingBottom: 28,
  },
  cardHeading: {
    fontSize: 22,
    fontFamily: displayFamily("700"), fontWeight: "700",
    color: "#0A0E18",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#5B6577",
    lineHeight: 20,
  },

  actions: {
    marginTop: 24,
    rowGap: 12,
  },

  cta: {
    height: 56,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  ctaLabelPrimary: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: ralewayFamily("600"), fontWeight: "600",
    letterSpacing: -0.1,
  },
  ctaOutline: {
    height: 56,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: "#D8DCE4",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaOutlinePressed: {
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  ctaLabelSecondary: {
    color: "#0A0E18",
    fontSize: 16,
    fontFamily: ralewayFamily("600"), fontWeight: "600",
    letterSpacing: -0.1,
  },
});

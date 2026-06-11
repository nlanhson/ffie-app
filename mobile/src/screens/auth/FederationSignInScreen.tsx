// Federation sign-in — the SSO hand-off step.
//
// After the member picks their federation, this screen represents the OAuth /
// OIDC hand-off: FFIE redirects to THAT federation's own secure sign-in (the
// FFB identity network), the federation verifies the member, and returns a
// token. Crucially, FFIE never collects the member's password — that's entered
// on the federation's page, not here. (Why no password field: the WBS leaves
// the auth model open — "member number? email-based SSO? something else?"
// [DESIGN_BRIEF open questions] — and a real SSO app must not proxy the
// federation's password. So we model the redirect, not a credential form.)
//
// v1 mock: there's no backend and no real redirect, so "Continue" simply
// completes (authenticates locally) — see TESTFLIGHT.md / CLAUDE.md. In
// production this kicks off an expo-auth-session redirect to the federation's
// IdP. Don't wire it to a real IdP without explicit instruction.
//
// Light surface (themes.light), WCAG AA.

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ExternalLink, ShieldCheck } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { themes, primitives } from "@tokens";
import { type Federation } from "@/data/federations";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

const t = themes.light;
const RADIUS = primitives.radii.lg; // 12
const TEAL = primitives.colors.brand.teal[700]; // #027489 — white label ≈5.4:1 (AA)
const TEAL_PRESSED = primitives.colors.brand.teal[800]; // #045764

export function FederationSignInScreen({
  federation,
  onBack,
  onSignIn,
}: {
  federation: Federation;
  onBack: () => void;
  // The federation has verified the member (v1 mock: Continue completes it).
  onSignIn: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      <StatusBar style="dark" />

      {/* Header — back returns to the federation list. */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to federation list"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.dim]}
        >
          <ChevronLeft size={24} color={t.text.body} />
        </Pressable>
        <Text style={styles.headerTitle}>Federation sign-in</Text>
      </View>

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Secure framing — this happens on the federation's side, not ours. */}
          <View style={styles.secureBadge}>
            <ShieldCheck size={16} color={TEAL} />
            <Text style={styles.secureText}>
              Secure sign-in via the FFB federation network
            </Text>
          </View>

          <Text accessibilityRole="header" style={styles.title}>
            Sign in with your federation
          </Text>
          <Text style={styles.subtitle}>
            You'll be securely redirected to your federation to confirm your
            identity, then brought back to FFIE.
          </Text>

          {/* Which federation will verify you */}
          <View style={styles.fedCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{federation.code}</Text>
            </View>
            <View style={styles.fedText}>
              <Text style={styles.fedArea} numberOfLines={1}>
                {federation.area}
              </Text>
              <Text style={styles.fedName} numberOfLines={2}>
                {federation.name}
              </Text>
            </View>
          </View>

          {/* Reassurance — why there's no password here. */}
          <View style={styles.reassure}>
            <ShieldCheck size={18} color={TEAL} style={styles.reassureIcon} />
            <Text style={styles.reassureText}>
              You sign in on your federation's own page — FFIE never sees your
              password. Your federation confirms your membership and grants
              access.
            </Text>
          </View>
        </ScrollView>

        {/* Continue → the redirect (mock: completes sign-in). */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Continue to ${federation.area} sign-in`}
            onPress={onSignIn}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaLabel}>Continue to sign in</Text>
            <ExternalLink size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: t.surface.default },
  dim: { opacity: 0.6 },

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
    color: t.text.body,
    fontSize: 15,
    fontFamily: displayFamily("600"),
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  body: { flex: 1, paddingHorizontal: 24 },
  scroll: { paddingTop: 8, paddingBottom: 16 },

  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: primitives.radii.md,
    backgroundColor: primitives.colors.brand.teal[50], // #E6F8FB
    alignSelf: "flex-start",
  },
  secureText: {
    color: t.text.muted,
    fontSize: 13,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
  },

  title: {
    marginTop: 16,
    color: t.text.body,
    fontSize: 24,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    color: t.text.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: ralewayFamily("400"),
  },

  fedCard: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    padding: 12,
    borderRadius: RADIUS,
    backgroundColor: t.surface.subtle,
    borderWidth: 1,
    borderColor: t.border.default,
  },
  badge: {
    minWidth: 40,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: t.border.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: t.text.body,
    fontSize: 13,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  fedText: { flex: 1 },
  fedArea: {
    color: t.text.body,
    fontSize: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
  },
  fedName: {
    marginTop: 2,
    color: t.text.muted,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: ralewayFamily("400"),
  },

  reassure: {
    marginTop: 20,
    flexDirection: "row",
    columnGap: 10,
    padding: 14,
    borderRadius: RADIUS,
    backgroundColor: t.surface.subtle,
  },
  reassureIcon: { marginTop: 1 },
  reassureText: {
    flex: 1,
    color: t.text.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: ralewayFamily("400"),
  },

  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.border.default,
  },
  cta: {
    height: 56,
    borderRadius: RADIUS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: TEAL,
  },
  ctaPressed: { backgroundColor: TEAL_PRESSED },
  ctaLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});

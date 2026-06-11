// Notifications — minimal pass-through settings page (option A).
//
// FFIE-PUSH-01 says members should be able to receive federation alerts.
// We don't yet have `expo-notifications` wired up, and the back-office
// notification taxonomy (FFIE-BO-07) isn't defined yet — so building
// 4 category toggles here would be premature.
//
// This page does the honest minimum: explain what FFIE sends, surface
// the OS-level permission state (managed by the device), and offer a
// deep-link button that opens the system settings page for this app.
// Upgrade to per-category opt-outs once the back-office contract lands.
//
// Wrapping into a slide-up Modal is the caller's job — see App.tsx
// MemberShell.

import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BellRing, ChevronLeft, ExternalLink } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

const t = themes.light;

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      // Silently fail — the deep link is best-effort. The user can
      // still navigate to Settings → FFIE manually on iOS / Android.
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      {/* White screen — keep dark status-bar icons even when opened over the
          navy Home hero (which sets them light). */}
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <ChevronLeft size={20} color={t.text.muted} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            FFIE sends alerts about federation news, document updates and urgent
            regulatory changes. Manage the alerts received on this device from
            your system settings.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <BellRing size={20} color={t.brand.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>Managed by your device</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notification settings in your device's system settings"
          onPress={openSystemSettings}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaLabel}>Open device settings</Text>
          <ExternalLink size={18} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.footer}>
          Per-category settings — federation news, document updates, regulatory
          alerts — will appear here once configured by FFIE.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 32,
  },
  back: {
    height: 44,
    alignSelf: "flex-start",
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  backPressed: { opacity: 0.6 },
  backLabel: { color: t.text.muted, fontSize: 15 },
  header: {
    marginTop: 16,
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    color: "#0A0E18",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#5B6577",
    lineHeight: 20,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
    padding: 16,
    backgroundColor: "#F2F4F8",
    marginBottom: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    color: "#5B6577",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  statusValue: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    color: "#0A0E18",
  },
  cta: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: t.action.primary.bg,
  },
  ctaPressed: { backgroundColor: t.action.primary.bgPressed },
  ctaLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  footer: {
    marginTop: 28,
    fontSize: 12,
    color: t.text.muted,
    lineHeight: 18,
  },
});

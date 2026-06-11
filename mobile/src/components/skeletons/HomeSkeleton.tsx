// HomeSkeleton — loading placeholder for HomeScreen. Mirrors the navy hero
// header (HomeHeader) AND the dashboard sheet below it (the lifted grey sheet
// with the Quick access grid, the two Public space gradient cards + FFB card,
// and the Recent news rail), so the layout doesn't jump when the real screen
// swaps in. Metrics here track HomeScreen / the home components — keep them in
// sync when the dashboard layout changes.

import React from "react";
import { Platform, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER } from "@/components/ui/ios";
import { SHEET, useHomeColors } from "@/components/home/homeColors";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import { SkeletonBlock, SkeletonCircle, SkeletonGroup } from "@/components/ui/Skeleton";

const NAVY = HEADER_SURFACE; // matches HomeHeader's surface
const TOP_GAP = Platform.OS === "android" ? 10 : 8; // matches HomeHeader
const GRID_GAP = 12;
const NEWS_CARD_W = 264;

// A muted section-eyebrow placeholder (mirrors SectionLabel's metrics).
function LabelPlaceholder({ themeName }: { themeName: ThemeName }) {
  return (
    <SkeletonBlock
      width={120}
      height={11}
      radius={primitives.radii.sm}
      themeName={themeName}
      style={{ marginLeft: GUTTER, marginBottom: 12 }}
    />
  );
}

export function HomeSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useHomeColors(themeName);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <StatusBar style="light" />
      {/* Navy backstop behind the status bar (mirrors HomeScreen). */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400, backgroundColor: NAVY }}
      />
      <SkeletonGroup>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Navy hero placeholder — matches HomeHeader's metrics. */}
          <View
            style={{
              backgroundColor: NAVY,
              paddingHorizontal: GUTTER,
              paddingTop: insets.top + TOP_GAP,
              paddingBottom: 38, // matches HomeHeader's root paddingBottom
            }}
          >
            {/* Brand row: logo chip + wordmark | two action discs */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 40,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
                <SkeletonBlock width={30} height={30} radius={primitives.radii.md} themeName={themeName} />
                <SkeletonBlock width={54} height={18} radius={primitives.radii.sm} themeName={themeName} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                <SkeletonCircle size={26} themeName={themeName} />
                <SkeletonCircle size={26} themeName={themeName} />
              </View>
            </View>

            {/* Identity block: greeting, name, pill — heights/margins mirror
                HomeHeader's text metrics so nothing shifts on the swap-in. */}
            <View style={{ marginTop: 18 }}>
              <SkeletonBlock width={48} height={14} radius={primitives.radii.sm} themeName={themeName} />
              <SkeletonBlock width={196} height={28} radius={primitives.radii.sm} themeName={themeName} style={{ marginTop: 8 }} />
              <SkeletonBlock width={168} height={28} radius={primitives.radii.full} themeName={themeName} style={{ marginTop: 12 }} />
            </View>
          </View>

          {/* Dashboard sheet — mirrors HomeScreen's lifted grey sheet. */}
          <View
            style={{
              flex: 1,
              backgroundColor: c.pageBg,
              borderTopLeftRadius: SHEET.radius,
              borderTopRightRadius: SHEET.radius,
              marginTop: -SHEET.lift,
              paddingTop: SHEET.padTop,
              paddingBottom: SHEET.padBottom,
            }}
          >
            {/* Quick access — 2×2 grid */}
            <View style={{ marginBottom: 28 }}>
              <LabelPlaceholder themeName={themeName} />
              <View style={{ paddingHorizontal: GUTTER, rowGap: GRID_GAP }}>
                {[0, 1].map((row) => (
                  <View key={row} style={{ flexDirection: "row", columnGap: GRID_GAP }}>
                    {[0, 1].map((col) => (
                      <View key={col} style={{ flex: 1 }}>
                        <SkeletonBlock width="100%" height={104} radius={primitives.radii.lg} themeName={themeName} />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Public space — two gradient cards + FFB affiliation card */}
            <View style={{ marginBottom: 28 }}>
              <LabelPlaceholder themeName={themeName} />
              <View style={{ flexDirection: "row", columnGap: GRID_GAP, paddingHorizontal: GUTTER }}>
                {[0, 1].map((col) => (
                  <View key={col} style={{ flex: 1 }}>
                    <SkeletonBlock width="100%" height={124} radius={primitives.radii.xl} themeName={themeName} />
                  </View>
                ))}
              </View>
              <View style={{ paddingHorizontal: GUTTER, marginTop: 12 }}>
                <SkeletonBlock width="100%" height={64} radius={primitives.radii.lg} themeName={themeName} />
              </View>
            </View>

            {/* Recent news — horizontal rail */}
            <View>
              <LabelPlaceholder themeName={themeName} />
              <View style={{ flexDirection: "row", columnGap: 14, paddingHorizontal: GUTTER }}>
                {[0, 1].map((i) => (
                  <SkeletonBlock
                    key={i}
                    width={NEWS_CARD_W}
                    height={228}
                    radius={primitives.radii.lg}
                    themeName={themeName}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SkeletonGroup>
    </View>
  );
}

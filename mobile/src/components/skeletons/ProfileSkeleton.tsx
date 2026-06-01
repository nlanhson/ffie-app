// ProfileSkeleton — loading placeholder for ProfileScreen. Mirrors it: large
// title, the account header card (round avatar + name + member line), then the
// Account, Preferences, and Sign-out grouped cards with icon-tile rows. Same
// gutters, card radii, and 30×30 icon tiles as the real screen.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, LargeTitleHeader, useGroupedColors } from "@/components/ui/ios";
import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonGroup,
  SkeletonTextLine,
} from "@/components/ui/Skeleton";

// One settings row: 30×30 leading icon tile + a title line, hairline inset
// past the tile (matching InsetRow).
function SettingsRowSkeleton({
  isLast,
  withSubtitle = false,
  themeName,
}: {
  isLast: boolean;
  withSubtitle?: boolean;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  const separatorInset = GUTTER + 30 + 12;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 12,
          paddingHorizontal: GUTTER,
          minHeight: 48,
          paddingVertical: 14,
        }}
      >
        <SkeletonBlock width={30} height={30} radius={7} themeName={themeName} />
        <View style={{ flex: 1, rowGap: 6 }}>
          <SkeletonTextLine width="55%" height={14} themeName={themeName} />
          {withSubtitle ? <SkeletonTextLine width="35%" height={11} themeName={themeName} /> : null}
        </View>
      </View>
      {!isLast ? (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: c.separator,
            marginLeft: separatorInset,
          }}
        />
      ) : null}
    </View>
  );
}

function GroupCard({ children, themeName }: { children: React.ReactNode; themeName: ThemeName }) {
  const c = useGroupedColors(themeName);
  return (
    <View
      style={{
        marginHorizontal: GUTTER,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: c.cardBorder ? 1 : 0,
        borderColor: c.cardBorder,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

function GroupHeader({ width, themeName }: { width: number; themeName: ThemeName }) {
  return (
    <View style={{ marginLeft: GUTTER + 4, marginBottom: 7 }}>
      <SkeletonBlock width={width} height={11} themeName={themeName} />
    </View>
  );
}

export function ProfileSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} scrollEnabled={false}>
          <LargeTitleHeader title="Profil" themeName={themeName} />

          {/* Account header card — avatar + identity */}
          <View
            style={{
              marginHorizontal: GUTTER,
              marginBottom: 28,
              backgroundColor: c.cardBg,
              borderRadius: primitives.radii.lg,
              borderWidth: c.cardBorder ? 1 : 0,
              borderColor: c.cardBorder,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 14,
            }}
          >
            <SkeletonCircle size={60} themeName={themeName} />
            <View style={{ flex: 1, rowGap: 8 }}>
              <SkeletonTextLine width="60%" height={18} themeName={themeName} />
              <SkeletonTextLine width="45%" height={13} themeName={themeName} />
            </View>
          </View>

          {/* Account group */}
          <View style={{ marginBottom: 28 }}>
            <GroupHeader width={80} themeName={themeName} />
            <GroupCard themeName={themeName}>
              <SettingsRowSkeleton isLast={false} themeName={themeName} />
              <SettingsRowSkeleton isLast themeName={themeName} />
            </GroupCard>
          </View>

          {/* Preferences group */}
          <View style={{ marginBottom: 28 }}>
            <GroupHeader width={110} themeName={themeName} />
            <GroupCard themeName={themeName}>
              <SettingsRowSkeleton isLast={false} themeName={themeName} />
              <SettingsRowSkeleton isLast withSubtitle themeName={themeName} />
            </GroupCard>
            <View style={{ marginTop: 7, marginHorizontal: GUTTER + 4 }}>
              <SkeletonTextLine width="80%" height={12} themeName={themeName} />
            </View>
          </View>

          {/* Sign-out group */}
          <View style={{ marginBottom: 28 }}>
            <GroupCard themeName={themeName}>
              <SettingsRowSkeleton isLast themeName={themeName} />
            </GroupCard>
          </View>
        </ScrollView>
      </SkeletonGroup>
    </SafeAreaView>
  );
}

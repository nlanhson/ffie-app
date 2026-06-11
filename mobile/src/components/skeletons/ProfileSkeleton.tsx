// ProfileSkeleton — loading placeholder for ProfileScreen. Mirrors the new
// layout: the navy identity hero (round avatar + name/role/member lines) then
// the My company, Qualifications, Push notifications, Alert types, Preferences
// and Account grouped cards. Same gutters, card radii, and leading-visual
// widths as the real screen so the swap doesn't jump.
//
// The hero sits on the fixed navy brand surface, so its placeholders are flat
// translucent-white blocks (no shimmer) rather than the grey SkeletonBlock —
// the same reasoning as HomeHeader being static. The grouped content below
// uses the shared shimmer skeleton.

import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import {
  SkeletonBlock,
  SkeletonGroup,
  SkeletonTextLine,
} from "@/components/ui/Skeleton";
import { HEADER_SURFACE } from "@/theme/brandHeader";

const NAVY = HEADER_SURFACE;
const HERO_BLOCK = "rgba(255,255,255,0.18)"; // flat placeholder on navy
const TOP_GAP = Platform.OS === "android" ? 14 : 12;
const LEAD_ICON_W = 24;
const LEAD_DOT_W = 12;

// One grouped-list row: a leading visual (icon box or dot), a title line, and
// an optional trailing block (value / badge / switch). The hairline separator
// insets past the leading visual to align under the title, matching InsetRow.
function RowSkeleton({
  isLast,
  leadingWidth = LEAD_ICON_W,
  trailingWidth,
  themeName,
}: {
  isLast: boolean;
  leadingWidth?: number;
  trailingWidth?: number;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  const separatorInset = GUTTER + leadingWidth + 12;
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
        <SkeletonBlock width={leadingWidth} height={leadingWidth >= 20 ? 20 : 10} radius={leadingWidth >= 20 ? 6 : 5} themeName={themeName} />
        <View style={{ flex: 1 }}>
          <SkeletonTextLine width="50%" height={14} themeName={themeName} />
        </View>
        {trailingWidth ? (
          <SkeletonBlock width={trailingWidth} height={26} radius={primitives.radii.full} themeName={themeName} />
        ) : null}
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

function Group({
  headerWidth,
  children,
  themeName,
}: {
  headerWidth: number;
  children: React.ReactNode;
  themeName: ThemeName;
}) {
  return (
    <View style={{ marginBottom: 28 }}>
      <GroupHeader width={headerWidth} themeName={themeName} />
      <GroupCard themeName={themeName}>{children}</GroupCard>
    </View>
  );
}

export function ProfileSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Teal backstop for the overscroll bounce above the hero, matching the
          real screen (the page-coloured wrapper below the hero covers it). */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, backgroundColor: NAVY }}
      />
      <SkeletonGroup>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={false}
        >
          {/* Identity header — flat translucent placeholders on the teal band.
              Matches ProfileScreen's compact hero (44pt avatar, paddingBottom
              16, tight three-line identity). */}
          <View
            style={{
              backgroundColor: NAVY,
              paddingTop: insets.top + TOP_GAP,
              paddingHorizontal: GUTTER,
              paddingBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 12,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: HERO_BLOCK }} />
            <View style={{ flex: 1, rowGap: 6 }}>
              <View style={{ width: "55%", height: 17, borderRadius: 5, backgroundColor: HERO_BLOCK }} />
              <View style={{ width: "38%", height: 12, borderRadius: 4, backgroundColor: HERO_BLOCK }} />
              <View style={{ width: "68%", height: 11, borderRadius: 4, backgroundColor: HERO_BLOCK }} />
            </View>
          </View>

          {/* Page-coloured wrapper below the hero — paints over the teal
              backstop so the header colour wraps the identity block only. */}
          <View style={{ flexGrow: 1, backgroundColor: c.pageBg, paddingBottom: 32 }}>
          <View style={{ height: 12 }} />

          {/* My company — 3 fact rows (icon + value). */}
          <Group headerWidth={95} themeName={themeName}>
            <RowSkeleton isLast={false} trailingWidth={88} themeName={themeName} />
            <RowSkeleton isLast={false} trailingWidth={88} themeName={themeName} />
            <RowSkeleton isLast trailingWidth={70} themeName={themeName} />
          </Group>

          {/* Qualifications — 2 rows (check + Valid badge). */}
          <Group headerWidth={110} themeName={themeName}>
            <RowSkeleton isLast={false} trailingWidth={48} themeName={themeName} />
            <RowSkeleton isLast trailingWidth={48} themeName={themeName} />
          </Group>

          {/* Push notifications — 1 toggle row (dot + switch). */}
          <Group headerWidth={130} themeName={themeName}>
            <RowSkeleton isLast leadingWidth={LEAD_DOT_W} trailingWidth={48} themeName={themeName} />
          </Group>

          {/* Alert types — 5 toggle rows. */}
          <Group headerWidth={80} themeName={themeName}>
            <RowSkeleton isLast={false} leadingWidth={LEAD_DOT_W} trailingWidth={48} themeName={themeName} />
            <RowSkeleton isLast={false} leadingWidth={LEAD_DOT_W} trailingWidth={48} themeName={themeName} />
            <RowSkeleton isLast={false} leadingWidth={LEAD_DOT_W} trailingWidth={48} themeName={themeName} />
            <RowSkeleton isLast={false} leadingWidth={LEAD_DOT_W} trailingWidth={48} themeName={themeName} />
            <RowSkeleton isLast leadingWidth={LEAD_DOT_W} trailingWidth={48} themeName={themeName} />
          </Group>

          {/* Preferences — 2 rows. */}
          <Group headerWidth={100} themeName={themeName}>
            <RowSkeleton isLast={false} trailingWidth={80} themeName={themeName} />
            <RowSkeleton isLast themeName={themeName} />
          </Group>

          {/* Account — 3 rows. */}
          <Group headerWidth={75} themeName={themeName}>
            <RowSkeleton isLast={false} themeName={themeName} />
            <RowSkeleton isLast={false} themeName={themeName} />
            <RowSkeleton isLast themeName={themeName} />
          </Group>
          </View>
        </ScrollView>
      </SkeletonGroup>
    </View>
  );
}

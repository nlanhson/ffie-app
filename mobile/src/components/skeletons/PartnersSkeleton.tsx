// PartnersSkeleton — loading placeholder for PartnersScreen. Mirrors the new
// segmented showcase: the Ecosystem / Lab_FFIE / Partners toggle, then the
// default (Ecosystem) segment's grouped lists — Distributors (2), Manufacturers
// (3) and Member federation (1). Each row is a square logo chip, two text
// lines, and a trailing chevron. Same gutters / chip size / row min-height as
// the real screen so the swap to content doesn't shift the layout.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { SkeletonBlock, SkeletonGroup, SkeletonTextLine } from "@/components/ui/Skeleton";

const TILE = 46;

// One grouped-list partner row: logo chip, two text lines, trailing chevron.
// Hairline separator inset past the chip (matches PartnerRow).
function PartnerRowSkeleton({
  isLast,
  themeName,
}: {
  isLast: boolean;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  const separatorInset = GUTTER + TILE + 12;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 12,
          paddingHorizontal: GUTTER,
          minHeight: 64,
          paddingVertical: 12,
        }}
      >
        <SkeletonBlock width={TILE} height={TILE} radius={11} themeName={themeName} />
        <View style={{ flex: 1, rowGap: 7 }}>
          <SkeletonTextLine width="50%" height={14} themeName={themeName} />
          <SkeletonTextLine width="78%" height={12} themeName={themeName} />
        </View>
        <SkeletonBlock width={10} height={16} themeName={themeName} />
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

// One section: uppercase header placeholder + a grouped card of rows.
function GroupSkeleton({
  rows,
  headerWidth,
  themeName,
}: {
  rows: number;
  headerWidth: number;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  return (
    <View style={{ marginBottom: 28 }}>
      <View style={{ marginLeft: GUTTER + 4, marginBottom: 7 }}>
        <SkeletonBlock width={headerWidth} height={11} themeName={themeName} />
      </View>
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
        {Array.from({ length: rows }).map((_, i) => (
          <PartnerRowSkeleton key={i} isLast={i === rows - 1} themeName={themeName} />
        ))}
      </View>
    </View>
  );
}

export function PartnersSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }} scrollEnabled={false}>
          {/* Segmented control */}
          <View style={{ paddingHorizontal: GUTTER, paddingTop: 6, paddingBottom: 16 }}>
            <SkeletonBlock
              width="100%"
              height={40}
              radius={primitives.radii.md}
              themeName={themeName}
            />
          </View>

          {/* Default (Ecosystem) segment: Distributors / Manufacturers / Member federation */}
          <GroupSkeleton rows={2} headerWidth={96} themeName={themeName} />
          <GroupSkeleton rows={3} headerWidth={120} themeName={themeName} />
          <GroupSkeleton rows={1} headerWidth={132} themeName={themeName} />
        </ScrollView>
      </SkeletonGroup>
    </View>
  );
}

// LibrarySkeleton — loading placeholder for DocLibraryScreen. Mirrors it:
// large title, the rounded search field + filter button, then two grouped
// inset sections of document rows (PDF-thumbnail leading, two text lines,
// a trailing "saved" badge). Same gutters, thumb size, and row min-height.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, LargeTitleHeader, SectionHeader, useGroupedColors } from "@/components/ui/ios";
import { SkeletonBlock, SkeletonGroup, SkeletonTextLine } from "@/components/ui/Skeleton";

const THUMB_WIDTH = 50;
const THUMB_HEIGHT = 66;

// One grouped-list document row: thumbnail + title/subtitle + trailing badge,
// with the iOS hairline separator inset past the thumbnail.
function DocRowSkeleton({
  isLast,
  themeName,
}: {
  isLast: boolean;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  const separatorInset = GUTTER + THUMB_WIDTH + 12;
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
        <SkeletonBlock
          width={THUMB_WIDTH}
          height={THUMB_HEIGHT}
          radius={3}
          themeName={themeName}
        />
        <View style={{ flex: 1, rowGap: 7 }}>
          <SkeletonTextLine width="80%" height={14} themeName={themeName} />
          <SkeletonTextLine width="50%" height={12} themeName={themeName} />
        </View>
        <SkeletonBlock width={52} height={20} radius={primitives.radii.full} themeName={themeName} />
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

// One grouped section: a faint section header bar + a card of rows.
function DocGroupSkeleton({
  rows,
  themeName,
}: {
  rows: number;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  return (
    <View style={{ marginBottom: 28 }}>
      <View style={{ marginLeft: GUTTER + 4, marginBottom: 7 }}>
        <SkeletonBlock width={140} height={11} themeName={themeName} />
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
          <DocRowSkeleton key={i} isLast={i === rows - 1} themeName={themeName} />
        ))}
      </View>
    </View>
  );
}

export function LibrarySkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} scrollEnabled={false}>
          <LargeTitleHeader title="Bibliothèque" themeName={themeName} />

          {/* Search field + filter button */}
          <View
            style={{
              paddingHorizontal: GUTTER,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <SkeletonBlock width="100%" height={38} radius={10} themeName={themeName} style={{ flex: 1 }} />
            <SkeletonBlock width={38} height={38} radius={10} themeName={themeName} />
          </View>

          <DocGroupSkeleton rows={3} themeName={themeName} />
          <DocGroupSkeleton rows={2} themeName={themeName} />
          <DocGroupSkeleton rows={3} themeName={themeName} />
        </ScrollView>
      </SkeletonGroup>
    </SafeAreaView>
  );
}

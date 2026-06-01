// PartnersSkeleton — loading placeholder for PartnersScreen. Mirrors it:
// large title, the "Quick access" grouped card (3 featured rows with a square
// monogram tile), then the "All partners" header, search field + filter, a
// description line, and the directory card of partner rows (monogram + name +
// category label + chevron). Same gutters / monogram size / row min-height.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, LargeTitleHeader, useGroupedColors } from "@/components/ui/ios";
import { SkeletonBlock, SkeletonGroup, SkeletonTextLine } from "@/components/ui/Skeleton";

const MONO = 38;

// One grouped-list partner row: square monogram tile, two text lines, and a
// trailing accessory (category label + chevron). Hairline inset past the tile.
function PartnerRowSkeleton({
  isLast,
  themeName,
}: {
  isLast: boolean;
  themeName: ThemeName;
}) {
  const c = useGroupedColors(themeName);
  const separatorInset = GUTTER + MONO + 12;
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
        <SkeletonBlock width={MONO} height={MONO} radius={9} themeName={themeName} />
        <View style={{ flex: 1, rowGap: 7 }}>
          <SkeletonTextLine width="55%" height={14} themeName={themeName} />
          <SkeletonTextLine width="82%" height={12} themeName={themeName} />
        </View>
        <SkeletonBlock width={44} height={12} themeName={themeName} />
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

function GroupedCard({
  rows,
  themeName,
}: {
  rows: number;
  themeName: ThemeName;
}) {
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
      {Array.from({ length: rows }).map((_, i) => (
        <PartnerRowSkeleton key={i} isLast={i === rows - 1} themeName={themeName} />
      ))}
    </View>
  );
}

export function PartnersSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} scrollEnabled={false}>
          <LargeTitleHeader title="Partenaires" themeName={themeName} />

          {/* Quick access section */}
          <View style={{ marginBottom: 28 }}>
            <View style={{ marginLeft: GUTTER + 4, marginBottom: 7 }}>
              <SkeletonBlock width={110} height={11} themeName={themeName} />
            </View>
            <GroupedCard rows={3} themeName={themeName} />
          </View>

          {/* "All partners" header */}
          <View style={{ marginLeft: GUTTER + 4, marginBottom: 12 }}>
            <SkeletonBlock width={96} height={11} themeName={themeName} />
          </View>

          {/* Search field + filter button */}
          <View
            style={{
              paddingHorizontal: GUTTER,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <SkeletonBlock width="100%" height={38} radius={10} themeName={themeName} style={{ flex: 1 }} />
            <SkeletonBlock width={38} height={38} radius={10} themeName={themeName} />
          </View>

          {/* Description line */}
          <View style={{ marginHorizontal: GUTTER + 4, marginBottom: 16 }}>
            <SkeletonTextLine width="70%" height={13} themeName={themeName} />
          </View>

          {/* Directory */}
          <GroupedCard rows={7} themeName={themeName} />
        </ScrollView>
      </SkeletonGroup>
    </SafeAreaView>
  );
}

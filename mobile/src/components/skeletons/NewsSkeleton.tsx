// NewsSkeleton — loading placeholder for NewsScreen. Mirrors its layout 1:1:
// large title, the horizontal category pill rail, then a single column of
// full-width article cards (16:9 image + tag + headline + date), and the
// bottom pagination. Same gutters / aspect ratios as NewsScreen, so nothing
// shifts when the real feed lands.

import React from "react";
import { ScrollView, View } from "react-native";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonGroup,
  SkeletonTextLine,
} from "@/components/ui/Skeleton";

const ROW_GAP = 18;

// Varied pill widths so the rail reads as labels, not a uniform strip.
const PILL_WIDTHS = [56, 96, 88, 130, 92];

// One full-width card placeholder: 16:9 image, a small tag, a 2-line title,
// a date.
function ArticleCardSkeleton({ themeName }: { themeName: ThemeName }) {
  const c = useGroupedColors(themeName);
  return (
    <View
      style={{
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: c.cardBorder ? 1 : 0,
        borderColor: c.cardBorder,
        overflow: "hidden",
      }}
    >
      <SkeletonBlock width="100%" aspectRatio={16 / 9} radius={0} themeName={themeName} />
      <View style={{ padding: 14 }}>
        <SkeletonBlock width={84} height={18} radius={primitives.radii.full} themeName={themeName} />
        <View style={{ marginTop: 10, rowGap: 6 }}>
          <SkeletonTextLine width="92%" height={14} themeName={themeName} />
          <SkeletonTextLine width="64%" height={14} themeName={themeName} />
        </View>
        <SkeletonTextLine width={56} height={10} themeName={themeName} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

export function NewsSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);

  return (
    // Title is shown by the persistent AppHeader (shell); the skeleton fills
    // only the content area beneath it.
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }} scrollEnabled={false}>
          {/* Category pill rail. Clipped at the
              screen edge like the real rail's scroll overflow. */}
          <View
            style={{
              flexDirection: "row",
              columnGap: 8,
              paddingHorizontal: GUTTER,
              marginTop: 6,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            {PILL_WIDTHS.map((w, i) => (
              <SkeletonBlock
                key={i}
                width={w}
                height={38}
                radius={primitives.radii.full}
                themeName={themeName}
              />
            ))}
          </View>

          {/* Single-column article cards */}
          <View style={{ paddingHorizontal: GUTTER, paddingTop: 4, rowGap: ROW_GAP }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} themeName={themeName} />
            ))}
          </View>

          {/* Pagination — arrows + page tokens */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 14,
              marginTop: 28,
            }}
          >
            <SkeletonCircle size={40} themeName={themeName} />
            <View style={{ flexDirection: "row", columnGap: 6 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} width={30} height={30} radius={15} themeName={themeName} />
              ))}
            </View>
            <SkeletonCircle size={40} themeName={themeName} />
          </View>
        </ScrollView>
      </SkeletonGroup>
    </View>
  );
}

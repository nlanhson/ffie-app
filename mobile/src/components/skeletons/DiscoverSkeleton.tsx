// DiscoverSkeleton — espace réservé de chargement pour DiscoverScreen (onglet
// Outils). Le reflète : la grille de lancement Outils (ToolsHubView) — deux
// sections titrées, chacune coiffée d'un sur-titre en majuscules et d'une grille
// de tuiles sur 2 colonnes (tuile d'icône carrée + titre). Mêmes gouttières,
// hauteur de tuile et rythme que la vraie grille, pour que rien ne se décale.

import React from "react";
import { ScrollView, View } from "react-native";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER } from "@/components/ui/ios";
import { useHomeColors } from "@/components/home/homeColors";
import { SkeletonBlock, SkeletonGroup, SkeletonTextLine } from "@/components/ui/Skeleton";

const GRID_GAP = 12;

// Une tuile de lancement : carte surélevée avec une tuile d'icône carrée et un
// titre — assortie à ToolCard (minHeight 116).
function ToolCardSkeleton({ themeName }: { themeName: ThemeName }) {
  const c = useHomeColors(themeName);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: 1,
        borderColor: c.cardBorder,
        padding: 16,
        minHeight: 116,
      }}
    >
      <SkeletonBlock width={40} height={40} radius={primitives.radii.md} themeName={themeName} />
      <View style={{ marginTop: 14, rowGap: 6 }}>
        <SkeletonTextLine width="80%" height={15} themeName={themeName} />
        <SkeletonTextLine width="55%" height={15} themeName={themeName} />
      </View>
    </View>
  );
}

// Une section titrée : un sur-titre en majuscules + deux rangées de deux tuiles.
function ToolSectionSkeleton({ themeName }: { themeName: ThemeName }) {
  return (
    <View style={{ paddingHorizontal: GUTTER, marginTop: 18 }}>
      <SkeletonBlock width={150} height={12} themeName={themeName} style={{ marginBottom: 12 }} />
      <View style={{ rowGap: GRID_GAP }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <View key={i} style={{ flexDirection: "row", columnGap: GRID_GAP }}>
            <ToolCardSkeleton themeName={themeName} />
            <ToolCardSkeleton themeName={themeName} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function DiscoverSkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useHomeColors(themeName);

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }} scrollEnabled={false}>
          {/* Deux sections d'outils, comme TOOL_SECTIONS. */}
          <ToolSectionSkeleton themeName={themeName} />
          <ToolSectionSkeleton themeName={themeName} />
        </ScrollView>
      </SkeletonGroup>
    </View>
  );
}

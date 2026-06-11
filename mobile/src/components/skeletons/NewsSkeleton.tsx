// NewsSkeleton — espace réservé de chargement pour NewsScreen. Reflète sa mise en page au
// pixel près : grand titre, le rail horizontal de pastilles de catégorie, puis une seule
// colonne de cartes d'article pleine largeur (image 16:9 + étiquette + titre + date), et la
// pagination du bas. Mêmes gouttières / ratios d'aspect que NewsScreen, donc rien ne se
// décale quand le vrai fil arrive.

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

// Largeurs de pastilles variées pour que le rail se lise comme des libellés, pas une bande uniforme.
const PILL_WIDTHS = [56, 96, 88, 130, 92];

// Un espace réservé de carte pleine largeur : image 16:9, une petite étiquette, un titre
// sur 2 lignes, une date.
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
    // Le titre est affiché par l'AppHeader persistant (coquille) ; le squelette ne remplit
    // que la zone de contenu en dessous.
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }} scrollEnabled={false}>
          {/* Rail de pastilles de catégorie. Rogné au bord de l'écran comme le
              débordement de défilement du vrai rail. */}
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

          {/* Cartes d'article sur une seule colonne */}
          <View style={{ paddingHorizontal: GUTTER, paddingTop: 4, rowGap: ROW_GAP }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} themeName={themeName} />
            ))}
          </View>

          {/* Pagination — flèches + jetons de page */}
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

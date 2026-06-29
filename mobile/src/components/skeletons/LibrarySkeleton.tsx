// LibrarySkeleton — espace réservé de chargement pour DocLibraryScreen. Le reflète :
// grand titre, le champ de recherche arrondi + bouton de filtre, une ligne de compteur de
// résultats, puis UNE carte encartée groupée de lignes de document (vignette PDF en tête, deux
// lignes de texte, un badge « enregistré »/cadenas de fin), un bouton « voir plus », et la
// pagination du bas. Mêmes gouttières, taille de vignette, hauteur minimale de ligne et rythme
// de page — pour que rien ne se décale quand la vraie liste paginée arrive.

import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonGroup,
  SkeletonTextLine,
} from "@/components/ui/Skeleton";

const THUMB_WIDTH = 50;
const THUMB_HEIGHT = 66;
// L'écran s'ouvre en affichant INITIAL_VISIBLE lignes avant « Voir plus ».
const VISIBLE_ROWS = 10;

// Une ligne de document en liste groupée : vignette + titre/sous-titre + badge de fin,
// avec le séparateur en fine ligne iOS décalé au-delà de la vignette.
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
        <SkeletonBlock width={44} height={18} radius={primitives.radii.full} themeName={themeName} />
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

export function LibrarySkeleton({ themeName = "light" }: { themeName?: ThemeName }) {
  const c = useGroupedColors(themeName);
  const searchH = Platform.OS === "android" ? 46 : 38;

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <SkeletonGroup>
        <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 18 }} scrollEnabled={false}>

          {/* Contrôle segmenté Docs / Métiers (barre fixe au-dessus de la liste). */}
          <View style={{ paddingHorizontal: GUTTER, marginBottom: 18 }}>
            <SkeletonBlock width="100%" height={40} radius={primitives.radii.md} themeName={themeName} />
          </View>

          {/* Champ de recherche + bouton de filtre */}
          <View
            style={{
              paddingHorizontal: GUTTER,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <SkeletonBlock width="100%" height={searchH} radius={10} themeName={themeName} style={{ flex: 1 }} />
            <SkeletonBlock width={searchH} height={searchH} radius={10} themeName={themeName} />
          </View>

          {/* Ligne de compteur de résultats (« 335 documents ») */}
          <View style={{ paddingHorizontal: GUTTER + 4, marginBottom: 14 }}>
            <SkeletonBlock width={104} height={13} themeName={themeName} />
          </View>

          {/* Une carte encartée groupée pour la tranche (paginée) courante. */}
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
            {Array.from({ length: VISIBLE_ROWS }).map((_, i) => (
              <DocRowSkeleton key={i} isLast={i === VISIBLE_ROWS - 1} themeName={themeName} />
            ))}
          </View>

          {/* Bouton « Voir plus » */}
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <SkeletonBlock width={170} height={40} radius={20} themeName={themeName} />
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

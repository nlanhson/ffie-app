// HomeSkeleton — espace réservé de chargement pour HomeScreen. Reflète l'en-tête hero bleu
// marine (HomeHeader) ET la feuille de tableau de bord en dessous (la feuille grise soulevée
// avec la grille Accès rapide, les deux cartes en dégradé Espace public + la carte FFB, et le
// rail Actualités récentes), pour que la mise en page ne saute pas quand le vrai écran s'y
// substitue. Les métriques ici suivent HomeScreen / les composants d'accueil — les garder
// synchronisées quand la mise en page du tableau de bord change.

import React from "react";
import { Platform, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER } from "@/components/ui/ios";
import { SHEET, useHomeColors } from "@/components/home/homeColors";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import { SkeletonBlock, SkeletonCircle, SkeletonGroup } from "@/components/ui/Skeleton";

const NAVY = HEADER_SURFACE; // correspond à la surface de HomeHeader
const TOP_GAP = Platform.OS === "android" ? 10 : 8; // correspond à HomeHeader
const GRID_GAP = 12;
const NEWS_CARD_W = 264;

// Un espace réservé de sur-titre de section atténué (reflète les métriques de SectionLabel).
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
      {/* Fond bleu marine derrière la barre de statut (reflète HomeScreen). */}
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
          {/* Espace réservé du hero bleu marine — correspond aux métriques de HomeHeader. */}
          <View
            style={{
              backgroundColor: NAVY,
              paddingHorizontal: GUTTER,
              paddingTop: insets.top + TOP_GAP,
              paddingBottom: 38, // correspond au paddingBottom racine de HomeHeader
            }}
          >
            {/* Ligne de marque : puce de logo + logotype | deux disques d'action */}
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

            {/* Bloc d'identité : salutation, nom, pastille — les hauteurs/marges reflètent
                les métriques de texte de HomeHeader pour que rien ne se décale à la substitution. */}
            <View style={{ marginTop: 18 }}>
              <SkeletonBlock width={48} height={14} radius={primitives.radii.sm} themeName={themeName} />
              <SkeletonBlock width={196} height={28} radius={primitives.radii.sm} themeName={themeName} style={{ marginTop: 8 }} />
              <SkeletonBlock width={168} height={28} radius={primitives.radii.full} themeName={themeName} style={{ marginTop: 12 }} />
            </View>
          </View>

          {/* Feuille de tableau de bord — reflète la feuille grise soulevée de HomeScreen. */}
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
            {/* Accès rapide — grille 2×2 */}
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

            {/* Espace public — deux cartes en dégradé + carte d'affiliation FFB */}
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

            {/* Actualités récentes — rail horizontal */}
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

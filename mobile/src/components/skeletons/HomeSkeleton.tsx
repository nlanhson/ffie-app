// HomeSkeleton — espace réservé de chargement pour HomeScreen. Reflète l'en-tête hero bleu
// marine (HomeHeader) ET la feuille de tableau de bord en dessous (la feuille grise soulevée
// avec la grille Accès rapide, les deux cartes en dégradé Espace public, et le rail Actualités
// récentes), pour que la mise en page ne saute pas quand le vrai écran s'y substitue. Les
// métriques ici suivent HomeScreen / les composants d'accueil — les garder synchronisées quand
// la mise en page du tableau de bord change.
//
// Le hero se pose sur la surface de marque bleu marine fixe (HomeHeader est statique, sans
// animation), ses espaces réservés sont donc des blocs blanc translucide PLATS (sans
// scintillement) plutôt que le SkeletonBlock gris — même raisonnement que ProfileSkeleton. Le
// contenu de la feuille en dessous utilise le squelette à scintillement partagé (SkeletonBlock).

import React from "react";
import { Platform, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER } from "@/components/ui/ios";
import { SHEET, useHomeColors } from "@/components/home/homeColors";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";

const NAVY = HEADER_SURFACE; // correspond à la surface de HomeHeader
// Écart sous le bord de la zone sûre avant la rangée de marque — identique au TOP_GAP de
// HomeHeader pour que le verrou de logo atterrisse à la même hauteur.
const TOP_GAP = Platform.OS === "android" ? 14 : 12;
const GRID_GAP = 12;
const NEWS_CARD_W = 264;

// Espaces réservés plats sur le hero bleu marine. La pastille de logo est une boîte
// BLANCHE dans HomeHeader → un blanc plus opaque ; le texte (accueil, nom) est du texte
// blanc translucide → un voile plus discret.
const HERO_CHIP = "rgba(255,255,255,0.55)";
const HERO_LINE = "rgba(255,255,255,0.20)";

// Pastille de logo FFIE (FFIE-01) — rendue à ≈ 35 de haut dans une pastille blanche de
// 5 px de marge → ≈ 45 px de haut ; la largeur suit le ratio intrinsèque (FFIE ≈ 42 + marge).
const CHIP_H = 45;
const FFIE_CHIP_W = 52;

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
              paddingBottom: 28, // correspond au paddingBottom racine de HomeHeader
            }}
          >
            {/* Rangée de marque : pastille de logo FFIE blanche (FFIE-01). Plus aucune
                action en haut à droite — le Profil (adhérent) et l'adhésion (invité)
                vivent désormais dans la barre d'onglets. */}
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8, minHeight: 44 }}>
              <View style={{ width: FFIE_CHIP_W, height: CHIP_H, borderRadius: 6, backgroundColor: HERO_CHIP }} />
            </View>

            {/* Bloc d'identité : accueil + nom + pastille — les hauteurs/marges reflètent les
                métriques de texte de HomeHeader pour que rien ne se décale à la substitution. */}
            <View style={{ marginTop: 14 }}>
              <View style={{ width: 64, height: 14, borderRadius: 4, backgroundColor: HERO_LINE }} />
              <View style={{ width: 200, height: 28, borderRadius: 5, backgroundColor: HERO_LINE, marginTop: 6 }} />
              <View
                style={{
                  width: 172,
                  height: 28,
                  borderRadius: primitives.radii.full,
                  backgroundColor: HERO_CHIP,
                  marginTop: 12,
                }}
              />
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
            {/* Accès rapide — grille de raccourcis à 4 tuiles (2 rangées de deux), pour les
                deux rôles : QuickAccessGrid donne 4 cartes à l'adhérent ET à l'invité. */}
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

            {/* Espace public — deux cartes en dégradé */}
            <View style={{ marginBottom: 28 }}>
              <LabelPlaceholder themeName={themeName} />
              <View style={{ flexDirection: "row", columnGap: GRID_GAP, paddingHorizontal: GUTTER }}>
                {[0, 1].map((col) => (
                  <View key={col} style={{ flex: 1 }}>
                    <SkeletonBlock width="100%" height={124} radius={primitives.radii.xl} themeName={themeName} />
                  </View>
                ))}
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

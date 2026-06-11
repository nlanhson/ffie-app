// PartnersSkeleton — espace réservé de chargement pour PartnersScreen. Reflète la nouvelle
// vitrine segmentée : le sélecteur Écosystème / Lab_FFIE / Partenaires, puis les listes
// groupées du segment par défaut (Écosystème) — Distributeurs (2), Fabricants (3) et
// Fédération adhérente (1). Chaque ligne est une puce de logo carrée, deux lignes de texte,
// et un chevron de fin. Mêmes gouttières / taille de puce / hauteur minimale de ligne que
// le vrai écran pour que la substitution au contenu ne décale pas la mise en page.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { primitives, type ThemeName } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { SkeletonBlock, SkeletonGroup, SkeletonTextLine } from "@/components/ui/Skeleton";

const TILE = 46;

// Une ligne de partenaire en liste groupée : puce de logo, deux lignes de texte, chevron de fin.
// Séparateur en fine ligne décalé au-delà de la puce (correspond à PartnerRow).
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

// Une section : espace réservé d'en-tête en majuscules + une carte groupée de lignes.
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
          {/* Contrôle segmenté */}
          <View style={{ paddingHorizontal: GUTTER, paddingTop: 6, paddingBottom: 16 }}>
            <SkeletonBlock
              width="100%"
              height={40}
              radius={primitives.radii.md}
              themeName={themeName}
            />
          </View>

          {/* Segment par défaut (Écosystème) : Distributeurs / Fabricants / Fédération adhérente */}
          <GroupSkeleton rows={2} headerWidth={96} themeName={themeName} />
          <GroupSkeleton rows={3} headerWidth={120} themeName={themeName} />
          <GroupSkeleton rows={1} headerWidth={132} themeName={themeName} />
        </ScrollView>
      </SkeletonGroup>
    </View>
  );
}

// QuickAccessGrid — le bloc « Accès rapide » 2×2 en haut du hub Accueil.
//
// Quatre cartes de raccourci (Documents / Outils FFIE / Partenaires / Agenda)
// qui mènent directement aux surfaces porteuses. Chacune est une carte blanche
// surélevée avec une icône fine, un titre en gras et un descripteur discret sur
// une ligne. Les cartes naviguent via l'union de cibles partagée `onNavigate`
// (résolue en onglet/action par le shell) : ce bloc reste donc présentationnel
// et piloté par les données.
//
// Pour modifier les raccourcis, éditez SHORTCUTS ci-dessous — l'ordre suit les
// lignes (haut-gauche, haut-droite, bas-gauche, bas-droite).

import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import {
  CalendarDays,
  FileText,
  Landmark,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { CARD_SHADOW, useHomeColors } from "./homeColors";
import type { HomeNavTarget } from "@/screens/HomeScreen";

const GRID_GAP = 12;

type Shortcut = {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  target: HomeNavTarget;
};

const SHORTCUTS: ReadonlyArray<Shortcut> = [
  { key: "docs", icon: FileText, title: "Documents", subtitle: "Normes & guides", target: "docs" },
  { key: "tools", icon: Wrench, title: "Outils FFIE", subtitle: "Calculs & aides", target: "tools" },
  { key: "partners", icon: Landmark, title: "Partenaires", subtitle: "Écosystème & Lab", target: "partners" },
  { key: "agenda", icon: CalendarDays, title: "Agenda", subtitle: "Événements", target: "agenda" },
];

export function QuickAccessGrid({
  themeName = "light",
  onNavigate,
}: {
  themeName?: ThemeName;
  onNavigate?: (target: HomeNavTarget) => void;
}) {
  // Rendu par paires (ligne par ligne) pour que chaque ligne étire ses deux
  // cartes à la même hauteur, quelle que soit la façon dont le descripteur se
  // répartit sur plusieurs lignes.
  const rows: Shortcut[][] = [SHORTCUTS.slice(0, 2), SHORTCUTS.slice(2, 4)];

  return (
    <View style={{ paddingHorizontal: GUTTER, rowGap: GRID_GAP }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row", columnGap: GRID_GAP }}>
          {row.map((item) => (
            <ShortcutCard
              key={item.key}
              item={item}
              themeName={themeName}
              onPress={() => onNavigate?.(item.target)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function ShortcutCard({
  item,
  themeName,
  onPress,
}: {
  item: Shortcut;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const Icon = item.icon;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint={item.subtitle}
      style={({ pressed }): ViewStyle => ({
        flex: 1,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: 1,
        borderColor: c.cardBorder,
        padding: 16,
        minHeight: 104,
        opacity: pressed ? 0.85 : 1,
        ...(CARD_SHADOW as ViewStyle),
      })}
    >
      {/* L'icône occupe une tuile carrée à coins arrondis avec une bordure +
          une légère teinte de marque — le même traitement que les cartes de
          l'Espace public, adapté à la carte blanche (glyphe marine sur un voile
          marine clair plutôt que blanc-sur-dégradé). Le glyphe est atténué
          (alpha < 1) pour que le tracé marine foncé n'attire pas trop l'œil sur
          la tuile pâle. */}
      <View
        style={[
          styles.iconTile,
          {
            backgroundColor: tint(t.brand.institutional, 0.07),
            borderColor: tint(t.brand.institutional, 0.18),
          },
        ]}
      >
        <Icon size={22} color={tint(t.brand.institutional, 0.68)} strokeWidth={1.8} />
      </View>
      <Text
        numberOfLines={1}
        style={{
          color: t.text.body,
          fontSize: 15,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: -0.2,
        }}
      >
        {item.title}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color: t.text.muted,
          fontSize: 12.5,
          fontFamily: ralewayFamily("400"),
          marginTop: 2,
        }}
      >
        {item.subtitle}
      </Text>
    </Pressable>
  );
}

// Couleur de token à alpha réduit — permet à la tuile d'icône marine de se lire
// comme un léger voile de marque + bordure sur la carte blanche (les tokens
// n'ont pas de variantes alpha).
function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: primitives.radii.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
});

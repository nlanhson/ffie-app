// PublicSpaceCards — les deux cartes à dégradé vif de la section « Espace
// public » de l'Accueil : « Trouver un pro » (émeraude, l'annuaire géolocalisé
// des fédérations) et « Nos métiers » (violet, la surface de découverte des
// carrières / Métiers).
//
// Ce sont les points d'entrée publics, sans restriction (P6/P7) — mis en avant
// avec des dégradés marketing affirmés pour se distinguer des cartes utilitaires
// blanches au-dessus. Les dégradés sont des tokens de décoration de marque FIXES
// (primitives.gradients), à l'image du héros marine qui est une surface fixe ;
// les couleurs de premier plan sont blanches partout.

import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GraduationCap, MapPin, type LucideIcon } from "lucide-react-native";
import { primitives, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { CARD_SHADOW } from "./homeColors";
import type { HomeNavTarget } from "@/screens/HomeScreen";

const WHITE = primitives.colors.white;
const GRID_GAP = 12;
// Blanc de token à alpha réduit : une tuile translucide derrière le glyphe, un
// sous-titre à peine atténué (gardé quasi opaque pour tenir le WCAG AA sur le
// dégradé), et un liseré ténu qui remplace la bordure 1 px des cartes sur le
// dégradé.
const TILE = "rgba(255, 255, 255, 0.18)";
const SUBTITLE = "rgba(255, 255, 255, 0.92)";
const EDGE = "rgba(255, 255, 255, 0.22)";

type GradientCard = {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  colors: readonly [string, string];
  target: HomeNavTarget;
};

const CARDS: ReadonlyArray<GradientCard> = [
  {
    key: "find-pro",
    icon: MapPin,
    title: "Trouver un pro",
    subtitle: "Annuaire géolocalisé",
    colors: primitives.gradients.findPro,
    target: "find-pro",
  },
  {
    key: "trades",
    icon: GraduationCap,
    title: "Nos métiers",
    subtitle: "Découvrir les métiers",
    colors: primitives.gradients.trades,
    target: "trades",
  },
];

export function PublicSpaceCards({
  themeName: _themeName = "light",
  onNavigate,
}: {
  themeName?: ThemeName;
  onNavigate?: (target: HomeNavTarget) => void;
}) {
  void _themeName; // les cartes à dégradé ignorent le thème (surfaces de marque fixes)
  return (
    <View style={{ flexDirection: "row", columnGap: GRID_GAP, paddingHorizontal: GUTTER }}>
      {CARDS.map((card) => (
        <Card key={card.key} card={card} onPress={() => onNavigate?.(card.target)} />
      ))}
    </View>
  );
}

function Card({ card, onPress }: { card: GradientCard; onPress: () => void }) {
  const Icon = card.icon;
  // L'ombre se trouve sur un conteneur EXTÉRIEUR tandis que la découpe arrondie
  // (overflow: hidden, nécessaire pour que le dégradé respecte le rayon des
  // coins) se trouve sur le Pressable intérieur. Sur une seule vue, iOS découpe
  // sa propre ombre quand overflow est masqué — les séparer préserve l'ombre. Le
  // fond opaque du conteneur (la couleur de départ du dégradé) donne aussi à
  // l'ombre une forme solide à projeter.
  return (
    <View style={[styles.shadowWrap, { backgroundColor: card.colors[0] }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={card.title}
        accessibilityHint={card.subtitle}
        style={({ pressed }): ViewStyle => ({
          flex: 1,
          // Même géométrie de carte que toutes les autres : radii.lg + un liseré
          // de 1 px. Un filet gris serait invisible sur le dégradé, donc le bord
          // est un liseré blanc translucide ténu — l'équivalent, sur dégradé, de
          // la bordure des cartes.
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: EDGE,
          overflow: "hidden",
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <LinearGradient
          colors={card.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          <View style={styles.tile}>
            <Icon size={22} color={WHITE} strokeWidth={2} />
          </View>
          <View style={{ marginTop: 18 }}>
            <Text
              numberOfLines={1}
              style={{
                color: WHITE,
                fontSize: 16,
                fontFamily: displayFamily("700"),
                fontWeight: "700",
                letterSpacing: -0.2,
              }}
            >
              {card.title}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                color: SUBTITLE,
                fontSize: 12.5,
                lineHeight: 17,
                fontFamily: ralewayFamily("500"),
                fontWeight: "500",
                marginTop: 3,
              }}
            >
              {card.subtitle}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    flex: 1,
    borderRadius: primitives.radii.lg, // identique au coin de toutes les autres cartes (12)
    ...CARD_SHADOW,
  },
  fill: {
    flex: 1,
    minHeight: 124,
    padding: 16,
    justifyContent: "flex-start",
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: primitives.radii.md,
    backgroundColor: TILE,
    alignItems: "center",
    justifyContent: "center",
  },
});

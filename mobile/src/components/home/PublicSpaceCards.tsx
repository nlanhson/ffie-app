// PublicSpaceCards — the two vivid gradient cards in the Home "Public space"
// section: "Find a pro" (emerald, the geolocated federation directory) and
// "Our trades" (violet, the careers / Métiers discovery surface).
//
// These are the public, non-gated entry points (P6/P7) — surfaced with bold
// marketing gradients to stand apart from the white utility cards above. The
// gradients are FIXED brand-decoration tokens (primitives.gradients), the same
// way the navy hero is a fixed surface; on-colors are white throughout.

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
// Token white at reduced alpha: a translucent tile behind the glyph, a
// barely-dimmed subtitle (kept near-solid so it holds WCAG AA on the gradient),
// and a faint rim that stands in for the cards' 1px border on the gradient.
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
    title: "Find a pro",
    subtitle: "Geolocated Directory",
    colors: primitives.gradients.findPro,
    target: "find-pro",
  },
  {
    key: "trades",
    icon: GraduationCap,
    title: "Our trades",
    subtitle: "Discovering the trades",
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
  void _themeName; // gradient cards are theme-agnostic (fixed brand surfaces)
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
  // The shadow lives on an OUTER wrapper while the rounded clip (overflow:
  // hidden, needed so the gradient honours the corner radius) lives on the
  // inner Pressable. On a single view iOS clips its own shadow when overflow is
  // hidden — splitting them keeps the shadow. The wrapper's opaque bg (the
  // gradient's start colour) also gives the shadow a solid shape to cast.
  return (
    <View style={[styles.shadowWrap, { backgroundColor: card.colors[0] }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={card.title}
        accessibilityHint={card.subtitle}
        style={({ pressed }): ViewStyle => ({
          flex: 1,
          // Same card geometry as every other card: radii.lg + a 1px edge.
          // A grey hairline is invisible on the gradient, so the edge is a faint
          // translucent-white rim — the gradient analogue of the cards' border.
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
    borderRadius: primitives.radii.lg, // match every other card's corner (12)
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

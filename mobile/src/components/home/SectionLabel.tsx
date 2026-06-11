// SectionLabel — la petite étiquette en majuscules qui coiffe chaque section du
// tableau de bord Accueil (« ACCÈS RAPIDE », « ESPACE PUBLIC », « ACTUALITÉS
// RÉCENTES »). Action « Tout voir » optionnelle à droite pour les sections qui
// disposent d'une surface de débordement.
//
// Marquée comme en-tête d'accessibilité afin que les utilisateurs de lecteur
// d'écran puissent naviguer dans le tableau de bord section par section (le
// visuel est une étiquette discrète, mais c'est BIEN le titre structurel du
// groupe situé en dessous).

import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";

export function SectionLabel({
  title,
  themeName = "light",
  actionLabel,
  onActionPress,
}: {
  title: string;
  themeName?: ThemeName;
  /** Action optionnelle alignée à droite (ex. « Tout voir »). */
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  const t = themes[themeName];
  const hasAction = actionLabel != null && onActionPress != null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: GUTTER,
        marginBottom: 12,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{
          color: t.text.muted,
          fontSize: 12,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: 0.7,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>

      {hasAction ? (
        <Pressable
          onPress={onActionPress}
          // Élargit la petite cible texte à une zone tactile ≥ 44 pt (WCAG 2.5.5).
          hitSlop={{ top: 14, bottom: 14, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}, ${title}`}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 1,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text
            style={{
              color: t.brand.accent,
              fontSize: 13,
              fontFamily: ralewayFamily("600"),
              fontWeight: "600",
            }}
          >
            {actionLabel}
          </Text>
          <ChevronRight size={15} color={t.brand.accent} strokeWidth={2.4} />
        </Pressable>
      ) : null}
    </View>
  );
}

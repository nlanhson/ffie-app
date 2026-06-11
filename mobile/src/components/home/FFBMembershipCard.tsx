// FFBMembershipCard — la carte institutionnelle « membre de la FFB » qui clôt la
// section « Espace public » de l'Accueil. La FFIE est membre de la Fédération
// Française du Bâtiment (FFB) ; cette carte met en avant cette affiliation et
// renvoie vers le site de la FFB (ouvert par le parent, via le navigateur
// intégré).
//
// Carte blanche pleine largeur : le logo FFB dans une tuile encadrée, la ligne
// d'affiliation et un descripteur discret. Un léger glyphe de lien externe
// signale qu'elle ouvre le site web de la FFB plutôt qu'un écran intégré.

import React from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";
import { ExternalLink } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { FFBLogo } from "@/components/ui/FFBLogo";
import { CARD_SHADOW, useHomeColors } from "./homeColors";

export function FFBMembershipCard({
  themeName = "light",
  onPress,
}: {
  themeName?: ThemeName;
  onPress?: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);

  return (
    <View style={{ paddingHorizontal: GUTTER }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="La FFIE est membre de la FFB, Fédération Française du Bâtiment"
        accessibilityHint="Ouvre le site web de la FFB"
        style={({ pressed }): ViewStyle => ({
          flexDirection: "row",
          alignItems: "center",
          columnGap: 14,
          backgroundColor: c.cardBg,
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: c.cardBorder,
          paddingVertical: 14,
          paddingHorizontal: 16,
          opacity: pressed ? 0.85 : 1,
          ...(CARD_SHADOW as ViewStyle),
        })}
      >
        {/* La marque FFB s'affiche directement — l'asset du logo porte son propre
            fond blanc, si bien que sur la carte blanche il se lit comme le logo
            sans cadre (une tuile à filet créerait ici une jointure
            carte-dans-la-carte). */}
        <FFBLogo size={36} />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              color: t.text.body,
              fontSize: 14.5,
              lineHeight: 19,
              fontFamily: ralewayFamily("600"),
              fontWeight: "600",
              letterSpacing: -0.1,
            }}
          >
            La FFIE est membre de la FFB
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
            Fédération Française du Bâtiment
          </Text>
        </View>

        {/* Indice de lien externe — à pleine intensité (sans atténuation) pour
            qu'il se lise clairement comme « ouvre le site FFB » plutôt que comme
            une décoration ténue. */}
        <ExternalLink size={18} color={t.text.muted} strokeWidth={2.25} />
      </Pressable>
    </View>
  );
}

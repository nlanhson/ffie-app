// SavedBadge — l'indicateur hors-ligne à deux états de la bibliothèque de documents.
//
// Portée : la surface visible de FFIE-DOC-03 (« télécharger des documents pour les garder
// en local ») + Principe 2 (hors-ligne d'abord). Volontairement seulement deux états —
// enregistré / non enregistré — pas une taxonomie de cache plus riche (hors périmètre).
//
// Accessibilité (Principe 4) : le statut est porté par ICÔNE + TEXTE, jamais la couleur
// seule. « Enregistré » se lit comme une coche sur un vert subtil ; « Non enregistré »
// comme une icône de téléchargement sur une surface neutre.

import React from "react";
import { Text, View } from "react-native";
import { CheckCircle2, ArrowDownToLine } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

export function SavedBadge({
  saved,
  themeName = "light",
  size = "sm",
}: {
  saved: boolean;
  themeName?: ThemeName;
  size?: "sm" | "md";
}) {
  const t = themes[themeName];
  const sz =
    size === "md"
      ? { height: 24, icon: 14, font: 12, padX: 8 }
      : { height: 20, icon: 12, font: 11, padX: 6 };

  // Enregistré → teinte de réussite subtile ; Non enregistré → surface neutre. Les deux
  // associent la couleur à une icône + un mot pour que le sens survive sans la couleur.
  const palette = saved
    ? { bg: t.feedback.subtle.success.bg, fg: t.feedback.subtle.success.fg, border: t.feedback.subtle.success.border }
    : { bg: t.surface.subtle, fg: t.text.muted, border: t.border.default };

  const Icon = saved ? CheckCircle2 : ArrowDownToLine;
  const label = saved ? "Enregistré" : "Non enregistré";

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={saved ? "Enregistré hors ligne" : "Non enregistré hors ligne"}
      style={{
        height: sz.height,
        paddingHorizontal: sz.padX,
        backgroundColor: palette.bg,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: primitives.radii.full,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
        alignSelf: "flex-start",
      }}
    >
      <Icon size={sz.icon} color={palette.fg} />
      <Text
        style={{
          color: palette.fg,
          fontSize: sz.font,
          fontFamily: ralewayFamily("600"),
          fontWeight: "600",
          lineHeight: sz.font * 1.1,
          includeFontPadding: false,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

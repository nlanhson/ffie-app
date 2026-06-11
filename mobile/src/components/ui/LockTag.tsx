// LockTag — indicateur réservé aux adhérents : un cadenas + le libellé « Adhérents ».
// Reflète le badge « Contenu réservé aux adhérents » du site FFIE. Affiché uniquement
// aux visiteurs qui ne peuvent pas accéder au contenu adhérent (invités), selon la
// convention Actualités/Bibliothèque.
//
// Icône + mot (jamais la couleur seule, P4) pour que le cadenas soit lisible par tous.
// Partagé par les cartes d'Actualités et la liste de la Bibliothèque pour qu'elles soient identiques.

import React from "react";
import { Text, View } from "react-native";
import { Lock } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

export function LockTag({
  themeName,
  small = false,
  label = "Adhérents",
}: {
  themeName: ThemeName;
  small?: boolean;
  label?: string;
}) {
  const t = themes[themeName];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
      <Lock size={small ? 11 : 12} color={t.text.muted} />
      <Text
        style={{
          fontSize: small ? 10 : 11,
          color: t.text.muted,
          fontFamily: ralewayFamily("500"),
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

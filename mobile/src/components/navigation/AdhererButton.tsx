// AdhererButton — l'avatar de compte persistant (en haut à droite), affiché sur chaque
// page dans les deux coquilles. Un bouton circulaire façon avatar dont l'icône et la
// destination dépendent du rôle :
//   - Invité (non adhérent) : une icône user-plus → ouvre l'annuaire des fédérations
//     (BecomeMemberScreen : la carte + la liste départementale, avec un bouton de
//     connexion « Se connecter » en bas).
//   - Adhérent : une icône user simple → ouvre la page Profil / réglages personnelle.
//
// La coquille décide ce que « ouvrir » signifie (elle passe onPress) ; ce composant n'est
// que le disque flottant. Ancré à la safe area en haut à droite (reflète le dock du
// RoleDebugSwitcher), il se place dans l'espace vide à droite du grand titre aligné à
// gauche de chaque écran, donc il ne chevauche jamais le texte du titre.

import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, UserPlus } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";

// Écart sous le bord supérieur de la safe area. L'inset de statut d'Android est plus serré,
// il reçoit donc un peu plus de respiration qu'iOS (même logique que la puce de débogage).
const TOP_GAP = Platform.OS === "android" ? 12 : 2;
// Retrait depuis le bord droit de l'écran — correspond à la gouttière de page.
const EDGE = 16;
// Diamètre de l'avatar. 40 + hitSlop garde la cible tactile confortablement ≥44pt.
const SIZE = 40;

export function AdhererButton({
  themeName = "light",
  variant = "guest",
  onPress,
}: {
  themeName?: ThemeName;
  // « guest » → user-plus (adhérer) ; « member » → user simple (profil).
  variant?: "guest" | "member";
  onPress: () => void;
}) {
  const t = themes[themeName];
  const insets = useSafeAreaInsets();

  const isMember = variant === "member";
  const Icon = isMember ? User : UserPlus;
  const label = isMember ? "Mon profil" : "Adhérer à la FFIE";

  return (
    // box-none : l'hôte couvre la bande supérieure mais seul le disque est cliquable, donc
    // les appuis ailleurs passent à travers vers l'écran en dessous.
    <View
      style={[styles.host, { top: insets.top + TOP_GAP }]}
      pointerEvents="box-none"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        hitSlop={10}
        style={({ pressed }) => [
          styles.avatar,
          {
            backgroundColor: pressed
              ? t.action.primary.bgPressed
              : t.action.primary.bg,
            // Anneau couleur-page pour que le disque se lise comme un élément flottant
            // distinct par-dessus le contenu qui défile en dessous.
            borderColor: t.surface.default,
          },
        ]}
      >
        <Icon size={20} color={t.action.primary.fg} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 0,
    right: EDGE,
    // Ancrer le disque au bord droit de la bande supérieure.
    alignItems: "flex-end",
    // Se placer au-dessus du contenu des onglets (les Modals natives s'affichent quand même au-dessus).
    zIndex: 1000,
    elevation: 1000,
  },
  avatar: {
    width: SIZE,
    height: SIZE,
    borderRadius: primitives.radii.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
});

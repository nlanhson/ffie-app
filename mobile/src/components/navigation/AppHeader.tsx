// AppHeader — la « barre de marque » marine persistante affichée en haut de
// chaque page d'onglet principale SAUF l'Accueil (l'Accueil a son propre héros
// plus riche, HomeHeader).
//
// C'est la même surface de marque que le héros de l'Accueil, réduite à une barre
// de navigation fixe :
//   [pastille logo]  Titre de la page ……………  [actions]
// où les actions dépendent du rôle :
//   - adhérent → notifications (cloche) · profil
//   - invité   → adhésion
//
// Rendue UNE SEULE fois par le shell (App.tsx), au-dessus du contenu défilant de
// l'onglet, afin de rester en place quand on change d'onglet et de garder la
// barre d'état sur le marine (les icônes claires restent lisibles quelle que soit
// la distance de défilement d'une liste). Le bloc d'accueil / identité est
// délibérément réservé à l'Accueil — les autres pages n'affichent ici que leur
// titre.
//
// Comme FFIELogo / HomeHeader, le marine + les couleurs de premier plan sont des
// constantes de marque fixes, pas des tokens de thème : c'est une surface de
// marque, pas une surface thématisée.

import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, User, UserPlus, type LucideIcon } from "lucide-react-native";
import { primitives } from "@tokens";
import { displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { HEADER_SURFACE } from "@/theme/brandHeader";

// --- couleurs de surface de marque fixes (partagées avec HomeHeader) -------
const WHITE = primitives.colors.white;

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const PRESS_BG = withAlpha(WHITE, 0.12); // teinte du bouton icône à l'appui
const CIRCLE_BG = withAlpha(WHITE, 0.2); // fond au repos derrière le glyphe de profil — assez visible pour se lire comme un bouton et ancrer le bord droit à la marge (reflet de la pastille blanche du logo à gauche)

const TOP_GAP = Platform.OS === "android" ? 14 : 12; // gardé identique à HomeHeader
const LOGO_SIZE = 42; // correspond au logo du héros de l'Accueil

export type AppHeaderProps = {
  title: string;
  variant: "member" | "guest";
  hasUnread?: boolean;
  /** Adhérent : ouvrir les notifications (cloche). Omettre pour masquer la cloche. */
  onPressNotifications?: () => void;
  /** Ouvrir la recherche. Omettre pour masquer le bouton de recherche. */
  onPressSearch?: () => void;
  /** Adhérent : ouvrir la page de Profil personnelle. Omettre pour masquer le bouton profil. */
  onPressProfile?: () => void;
  /** Invité : ouvrir le parcours d'adhésion. Omettre pour masquer le bouton d'adhésion. */
  onPressJoin?: () => void;
};

// Un simple bouton icône de barre supérieure (glyphe blanc sur la surface de
// marque). hitSlop élargit le disque visible de 40 pt à une cible accessible de
// ≥ 44 pt.
function IconButton({
  icon: Icon,
  label,
  hint,
  onPress,
  filled = false,
  dot = false,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  onPress?: () => void;
  /** Affiche un cercle translucide au repos derrière le glyphe (action profil). */
  filled?: boolean;
  /** Affiche une pastille « non lu » en surimpression (cloche de notifications). */
  dot?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconBtn,
        filled ? styles.iconBtnFilled : null,
        pressed && onPress ? { backgroundColor: PRESS_BG } : null,
      ]}
    >
      <Icon size={22} color={WHITE} strokeWidth={2} />
      {dot ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

export function AppHeader({
  title,
  variant,
  hasUnread = false,
  onPressNotifications,
  onPressSearch,
  onPressProfile,
  onPressJoin,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const isMember = variant === "member";

  return (
    <View style={[styles.root, { paddingTop: insets.top + TOP_GAP }]}>
      <View style={styles.logoChip} accessibilityRole="image" accessibilityLabel="FFIE">
        <FFIELogo size={LOGO_SIZE} themeName="light" />
      </View>

      <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.actions}>
        {isMember && onPressNotifications ? (
          <IconButton
            icon={Bell}
            label="Notifications"
            hint="Ouvre le centre de notifications"
            onPress={onPressNotifications}
            dot={hasUnread}
          />
        ) : null}
        {isMember && onPressProfile ? (
          <IconButton
            icon={User}
            label="Mon profil"
            hint="Ouvre votre profil et vos réglages"
            onPress={onPressProfile}
            filled
          />
        ) : null}
        {!isMember && onPressJoin ? (
          <IconButton
            icon={UserPlus}
            label="Adhérer à la FFIE"
            hint="Ouvre les informations d'adhésion"
            onPress={onPressJoin}
            filled
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: HEADER_SURFACE,
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
    columnGap: 10,
  },
  logoChip: {
    backgroundColor: WHITE,
    borderRadius: 6, // entre radii.sm (4) et radii.md (8) — pas de token exact
    padding: 5,
  },
  title: {
    flex: 1, // occupe le centre ; tronque avant les actions
    color: WHITE,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    fontSize: 22,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 2,
    // L'action de fin est un cercle plein ; aligner son bord extérieur sur la
    // marge pour que le rembourrage droit reflète la pastille du logo à gauche
    // (correspond à HomeHeader).
    marginRight: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: primitives.radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnFilled: {
    backgroundColor: CIRCLE_BG,
  },
  // Pastille « non lu » sur la cloche — point rouge cerclé de blanc pour rester
  // lisible sur le bandeau bleu marine.
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: primitives.radii.full,
    backgroundColor: primitives.colors.red[500],
    borderWidth: 1.5,
    borderColor: HEADER_SURFACE,
  },
});

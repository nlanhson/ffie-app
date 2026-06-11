// RoleDebugSwitcher — puces réservées à la préview qui font défiler le Role courant et
// réinitialisent les données de session enregistrées.
//
// Flotte au-dessus de toute l'application (rendu en dernier dans AppRoot, positionné en
// absolu) pour que la préview client puisse basculer entre Julien (member),
// Karim (guest-company), Léa (guest-public) sans relancer l'onboarding.
// Déclenche les barrières RequireRole en temps réel — faire défiler jusqu'à « guest-public »
// en regardant la Bibliothèque et le MemberOnlyPrompt apparaît.
//
// Déplaçable : le groupe démarre ancré en haut à droite mais peut être glissé n'importe où
// pour qu'il ne se pose jamais par-dessus ce que vous prévisualisez. Les appuis atteignent
// toujours les puces individuelles — le conteneur ne réclame le geste qu'une fois que le
// doigt dépasse un petit seuil (onStartShouldSetPanResponder reste à false ;
// onMoveShouldSetPanResponder se déclenche au glissement). Bâti sur le PanResponder + Animated
// du cœur de RN, donc aucune dépendance gesture-handler/reanimated.
//
// Conditionné par ENABLE_ROLE_DEBUG dans App.tsx. PAS pour les builds de production.

import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bug } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { useRole, type Role } from "@/auth/roleContext";
import { ralewayFamily } from "@/theme/fonts";

// Ordre de défilement choisi pour la narration de la préview client — commencer dans l'état
// invité public, puis adhérent (le cas d'usage phare). guest-company est omis du défilement
// car il est aujourd'hui comportementalement identique à guest-public (canAccess traite les
// deux comme public uniquement) ; il reste dans le type Role pour la surface de conversion
// des non-adhérents prévue. Admin est aussi exclu : c'est un rôle de back-office web
// uniquement qui n'apparaît jamais dans une session mobile.
const CYCLE: Role[] = ["guest-public", "member"];

const LABEL: Record<Role, string> = {
  "guest-public": "Grand public",
  "guest-company": "Entreprise non adhérente",
  member: "Adhérent",
  admin: "Admin (web uniquement)",
};

// Retrait de bord gardé entre le groupe et les limites de l'écran lors de l'ancrage/du serrage.
// Définit l'écart d'ancrage par défaut en haut à droite (≈16px de marge à droite) et les limites de glissement.
const MARGIN = 16;
// Mouvement (en pt) au-delà duquel un geste devient un glissement plutôt qu'un appui de puce.
const DRAG_THRESHOLD = 6;
// Écart sous le bord supérieur de la safe area avant le groupe ancré. L'inset de statut
// d'Android est plus serré, on lui donne donc un peu plus de respiration qu'iOS.
const TOP_GAP = Platform.OS === "android" ? 24 : 4;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function RoleDebugSwitcher({ themeName = "light" }: { themeName?: ThemeName }) {
  const { role, setRole } = useRole();
  const t = themes[themeName];
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();

  const next = () => {
    const i = CYCLE.indexOf(role);
    const nextRole = CYCLE[(i + 1) % CYCLE.length] ?? CYCLE[0];
    setRole(nextRole);
  };

  // --- Tuyauterie de glissement ----------------------------------------------
  // Les valeurs de layout vivent dans des refs pour que le PanResponder à longue durée de
  // vie lise la taille d'écran / l'inset courants au relâchement (par ex. après un changement d'orientation).
  const winW = useRef(screenW);
  const winH = useRef(screenH);
  const topInset = useRef(insets.top + 4);
  winW.current = screenW;
  winH.current = screenH;
  topInset.current = insets.top + TOP_GAP;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const posRef = useRef({ x: 0, y: 0 }); // position validée (post-relâchement)
  const sizeRef = useRef({ w: 0, h: 0 });
  const placedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      // Laisser les appuis passer vers les puces ; ne réclamer le geste qu'au glissement.
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > DRAG_THRESHOLD || Math.abs(g.dy) > DRAG_THRESHOLD,
      onPanResponderGrant: () => {
        setDragging(true);
        pan.setOffset(posRef.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_, g) => {
        setDragging(false);
        pan.flattenOffset();
        // Ramener la position lâchée à l'intérieur de la safe area.
        const maxX = winW.current - sizeRef.current.w - MARGIN;
        const maxY = winH.current - sizeRef.current.h - MARGIN;
        const x = clamp(posRef.current.x + g.dx, MARGIN, Math.max(MARGIN, maxX));
        const y = clamp(
          posRef.current.y + g.dy,
          topInset.current,
          Math.max(topInset.current, maxY)
        );
        posRef.current = { x, y };
        Animated.spring(pan, {
          toValue: { x, y },
          useNativeDriver: false,
          friction: 8,
          tension: 90,
        }).start();
      },
      onPanResponderTerminate: () => setDragging(false),
    })
  ).current;

  return (
    <View style={styles.host} pointerEvents="box-none">
      <Animated.View
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          sizeRef.current = { w: width, h: height };
          // Premier cadre mesuré : ancrer à la safe area en haut à droite.
          if (!placedRef.current && width > 0) {
            const x = screenW - width - MARGIN;
            const y = insets.top + TOP_GAP;
            posRef.current = { x, y };
            pan.setValue({ x, y });
            placedRef.current = true;
            setReady(true);
          }
        }}
        {...panResponder.panHandlers}
        style={[
          styles.cluster,
          {
            opacity: ready ? 1 : 0,
            transform: pan.getTranslateTransform(),
            shadowOpacity: dragging ? 0.28 : 0.15,
            shadowRadius: dragging ? 12 : 6,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Débogage : changer de rôle. Actuel : ${LABEL[role]}. Glisser pour déplacer.`}
          onPress={next}
          style={({ pressed }) => [
            styles.chip,
            styles.roleChip,
            {
              backgroundColor: pressed ? t.action.primary.bgPressed : t.action.primary.bg,
              borderColor: t.action.primary.bg,
            },
          ]}
        >
          {/* Grand titre à fort contraste — « Rôle - Persona » */}
          <View style={styles.roleTitleRow}>
            <Bug size={13} color={t.action.primary.fg} style={{ marginTop: 2 }} />
            <Text
              numberOfLines={2}
              style={[styles.title, { color: t.action.primary.fg }]}
            >
              {LABEL[role]}
            </Text>
          </View>
          {/* Petit indice d'action teinté */}
          <Text style={[styles.hint, { color: t.action.primary.fg }]} numberOfLines={1}>
appuyer pour changer · glisser pour déplacer
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    // Se placer au-dessus du contenu de l'application. (Les Modals natives s'affichent dans
    // leur propre fenêtre au-dessus de ceci — inhérent à RN ; pas un combat de puce de débogage.)
    zIndex: 9999,
    elevation: 9999,
  },
  cluster: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 8,
    // L'ombre vit sur le groupe pour qu'il se soulève d'un seul tenant pendant le glissement.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: primitives.radii.full,
    borderWidth: 1,
    maxWidth: 240,
    elevation: 3,
  },
  // La puce de rôle utilise une pile verticale : grande ligne de titre par-dessus un indice teinté.
  // Épouse son contenu ; maxWidth la plafonne pour que le libellé long (« Entreprise non
  // adhérente ») passe sur deux lignes au lieu de déborder de l'écran, tandis que les
  // libellés plus courts tiennent sur une ligne.
  roleChip: {
    flexDirection: "column",
    alignItems: "flex-start",
    columnGap: 0,
    rowGap: 2,
    borderRadius: 16,
    maxWidth: 170,
  },
  roleTitleRow: {
    flexDirection: "row",
    // Aligner en haut pour que l'icône se place à côté de la première ligne quand le titre passe à la ligne.
    alignItems: "flex-start",
    columnGap: 6,
  },
  title: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: ralewayFamily("700"), fontWeight: "700",
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 10,
    opacity: 0.8,
  },
});

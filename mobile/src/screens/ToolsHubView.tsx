// ToolsHubView — le segment « Outils » de l'onglet Outils (l'atterrissage par défaut).
//
// Reproduit la maquette client « Outils FFIE » : une grille de lancement de
// tuiles d'outils regroupées en deux sections (« Calculs & dimensionnement »,
// « Aide à la conformité »). Les tuiles RÉUTILISENT le traitement de carte du hub
// Accueil (carte blanche surélevée avec une légère élévation, une tuile d'icône
// carrée arrondie portant un léger lavis bleu marine de marque, un titre en gras)
// — voir components/home/QuickAccessGrid + homeColors. La page elle-même adopte
// aussi l'allure du tableau de bord de l'Accueil (gris en creux derrière les
// cartes), car le chrome de carte blanche se lit sur du gris, et non sur le blanc
// des écrans de liste.
//
// Comportement des tuiles (les données vivent dans data/tools.ts) :
//   • Calcul de puissance → la feuille Puissance & courant fonctionnelle (réservée aux adhérents).
//   • Chute de tension    → la feuille Chute de tension fonctionnelle (réservée aux adhérents).
//   • tout le reste       → rendu DÉSACTIVÉ : une tuile plate, grisée, non
//     touchable avec une légende « Bientôt ». La FFIE n'a pas encore livré ces
//     outils, donc la tuile se lit honnêtement comme indisponible plutôt que de
//     feindre une destination (CLAUDE.md). La légende (pas l'atténuation seule)
//     porte le sens, de sorte que l'état survit pour les utilisateurs daltoniens / malvoyants.
//   Un invité qui touche une tuile de calculateur ACTIVE obtient quand même une
//   feuille calme « réservé aux adhérents » — la convention de restriction de
//   l'app (informer & inviter, jamais 403), distincte de l'état « bientôt » ci-dessus.

import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { CARD_SHADOW, useHomeColors } from "@/components/home/homeColors";
import { canAccess, useRole } from "@/auth/roleContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PowerCalculatorSheet, VoltageDropSheet } from "./CalculatorsView";
import { TOOL_SECTIONS, type ToolSection, type ToolTile } from "@/data/tools";
import type { CalculatorKind } from "@/data/calculators";

// Espace entre les tuiles, assorti à la grille QuickAccess de l'Accueil.
const GRID_GAP = 12;

export function ToolsHubView({ themeName = "light" }: { themeName?: ThemeName }) {
  const { role } = useRole();
  const isMember = canAccess(role, "member-only");

  // Quelle feuille de calculateur fonctionnelle est ouverte (réservée aux
  // adhérents) ; et le titre du calculateur qu'un invité a touché (null = fermé),
  // qui ouvre la restriction réservée aux adhérents. Les tuiles « Bientôt » ne
  // sont pas interactives, elles n'ont donc besoin d'aucun état.
  const [openKind, setOpenKind] = useState<CalculatorKind | null>(null);
  const [gatedTitle, setGatedTitle] = useState<string | null>(null);

  // Seules les tuiles de calculateur actives sont touchables ; les tuiles « bientôt »
  // désactivées n'appellent jamais ceci.
  const onTilePress = (tile: ToolTile) => {
    if (tile.action.type !== "calculator") return;
    // Les calculateurs sont réservés aux adhérents — on restreint les invités avec
    // une feuille calme plutôt que d'ouvrir l'outil.
    if (!isMember) {
      setGatedTitle(tile.title);
      return;
    }
    setOpenKind(tile.action.kind);
  };

  return (
    <>
      <View style={{ paddingTop: 2 }}>
        {TOOL_SECTIONS.map((section) => (
          <ToolSectionBlock
            key={section.id}
            section={section}
            themeName={themeName}
            onTilePress={onTilePress}
          />
        ))}
      </View>

      {/* Calculateurs fonctionnels — réutilisés depuis CalculatorsView pour que
          l'outil soit identique d'où qu'il soit lancé. */}
      <PowerCalculatorSheet
        visible={openKind === "power"}
        themeName={themeName}
        onClose={() => setOpenKind(null)}
      />
      <VoltageDropSheet
        visible={openKind === "voltage-drop"}
        themeName={themeName}
        onClose={() => setOpenKind(null)}
      />

      {/* Invitation réservée aux adhérents pour un invité ayant touché une tuile de calculateur (active). */}
      <MembersOnlySheet title={gatedTitle} themeName={themeName} onClose={() => setGatedTitle(null)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// ToolSectionBlock — une section titrée : un en-tête en majuscules et ses tuiles
// disposées à deux colonnes. Les tuiles se rendent par rangées de deux pour que
// les cartes appariées s'étirent à la même hauteur (assorti à la grille
// QuickAccess de l'Accueil), quelle que soit la façon dont le libellé se replie.
// ---------------------------------------------------------------------------
function ToolSectionBlock({
  section,
  themeName,
  onTilePress,
}: {
  section: ToolSection;
  themeName: ThemeName;
  onTilePress: (tile: ToolTile) => void;
}) {
  const t = themes[themeName];

  const rows: ToolTile[][] = [];
  for (let i = 0; i < section.tiles.length; i += 2) {
    rows.push(section.tiles.slice(i, i + 2));
  }

  return (
    <View style={{ paddingHorizontal: GUTTER, marginTop: 18 }}>
      <Text
        accessibilityRole="header"
        style={{
          color: t.text.muted,
          fontSize: 12.5,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {section.title}
      </Text>

      <View style={{ rowGap: GRID_GAP }}>
        {rows.map((row, i) => (
          <View key={i} style={{ flexDirection: "row", columnGap: GRID_GAP }}>
            {row.map((tile) => (
              <ToolCard
                key={tile.id}
                tile={tile}
                themeName={themeName}
                onPress={() => onTilePress(tile)}
              />
            ))}
            {/* Garder une carte finale isolée à mi-largeur si une section est impaire. */}
            {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ToolCard — une tuile de lancement unique. Les tuiles actives (calculateur)
// réutilisent le traitement ShortcutCard de l'Accueil : carte blanche surélevée,
// léger lavis bleu marine de marque sur la tuile d'icône, titre en gras. Les
// tuiles « Bientôt » se rendent DÉSACTIVÉES à la place : plates (sans élévation),
// grisées, non touchables, avec une légende « Bientôt » qui porte le sens sans
// s'appuyer sur l'atténuation seule.
// ---------------------------------------------------------------------------
function ToolCard({
  tile,
  themeName,
  onPress,
}: {
  tile: ToolTile;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const Icon = tile.icon;

  // Outils pas encore construits : une simple View (non-Pressable) pour qu'elle
  // ne puisse pas être touchée, grisée et plate, légendée « Bientôt ».
  if (tile.action.type === "soon") {
    return (
      <View
        accessibilityLabel={`${tile.title}. Bientôt.`}
        accessibilityState={{ disabled: true }}
        style={{
          flex: 1,
          backgroundColor: c.cardBg,
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: c.cardBorder,
          padding: 16,
          minHeight: 116,
          opacity: 0.6,
        }}
      >
        {/* Tuile d'icône neutre et atténuée (sans lavis de marque) — se lit comme inactive. */}
        <View style={[styles.iconTile, { backgroundColor: t.surface.subtle, borderColor: t.border.subtle }]}>
          <Icon size={22} color={t.text.muted} strokeWidth={1.9} />
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: t.text.muted,
            fontSize: 15,
            lineHeight: 20,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.2,
          }}
        >
          {tile.title}
        </Text>
        <Text
          style={{
            color: t.text.muted,
            fontSize: 11,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          Bientôt
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tile.title}
      accessibilityHint="Ouvre le calculateur"
      style={({ pressed }): ViewStyle => ({
        flex: 1,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: 1,
        borderColor: c.cardBorder,
        padding: 16,
        minHeight: 116,
        opacity: pressed ? 0.85 : 1,
        ...(CARD_SHADOW as ViewStyle),
      })}
    >
      {/* Tuile d'icône — même léger lavis bleu marine de marque + bordure que les
          cartes de l'Accueil. Le glyphe lui-même est atténué (alpha < 1) pour que
          le trait bleu marine foncé n'attire pas trop l'œil contre la tuile pâle. */}
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
        numberOfLines={2}
        style={{
          color: t.text.body,
          fontSize: 15,
          lineHeight: 20,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: -0.2,
        }}
      >
        {tile.title}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// MembersOnlySheet — la restriction calme affichée quand un invité touche une
// tuile de calculateur (active) : le titre de l'outil, une phrase honnête, et une
// pastille « Réservé aux adhérents ». Une page sheet assortie aux modales propres
// des calculateurs. (`title` null = fermé.)
//
// Mouvement réduit (P5) : apparaît d'un coup sans glissement quand le réglage de l'OS est activé.
// ---------------------------------------------------------------------------
function MembersOnlySheet({
  title,
  themeName,
  onClose,
}: {
  title: string | null;
  themeName: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const reduceMotion = useReducedMotion();

  return (
    <Modal
      visible={title != null}
      animationType={reduceMotion ? "none" : "slide"}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
        {/* Affordance de fermeture — X en haut à droite (cible tactile ≥44pt). */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 8, paddingTop: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <X size={26} color={t.text.body} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: GUTTER, paddingTop: 8 }}>
          <Text
            accessibilityRole="header"
            style={{
              color: t.text.body,
              fontSize: 28,
              lineHeight: 34,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              letterSpacing: -0.6,
            }}
          >
            {title}
          </Text>
          <Text style={{ color: t.text.muted, fontSize: 15, lineHeight: 23, marginTop: 12 }}>
            Cet outil est réservé aux adhérents de la FFIE. Connectez-vous ou
            adhérez à la fédération pour l'utiliser.
          </Text>

          {/* Pastille de statut — le texte porte le sens, pas la couleur seule (P). */}
          <View
            style={{
              marginTop: 18,
              alignSelf: "flex-start",
              backgroundColor: t.surface.subtle,
              borderWidth: 1,
              borderColor: t.border.subtle,
              borderRadius: primitives.radii.full,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color: t.brand.accent,
                fontSize: 12,
                fontFamily: ralewayFamily("700"),
                fontWeight: "700",
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              Réservé aux adhérents
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Couleur de token à alpha réduit — le même utilitaire que les cartes de
// l'Accueil emploient pour rendre la tuile d'icône bleu marine en léger lavis de
// marque + bordure (les tokens ne portent pas de variantes alpha). Gardé local
// pour ne pas élargir la surface du module Accueil.
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

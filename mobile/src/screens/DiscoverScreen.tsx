// Onglet Métiers / Outils — la surface de découverte publique pour les invités (Karim + Léa).
//
// Un contrôle segmenté sous le grand titre divise l'onglet en deux segments,
// comme le sélecteur des onglets Actualités / Partenaires :
//   • Métiers — le contenu carrières (ProfessionsView) : la section publique
//               « Découvrir les métiers » (WBS Epic 4) — fiches métiers + parcours
//               de formation + vidéos de présentation.
//   • Outils  — la grille de lancement qui accueille aussi les calculateurs
//               (ToolsHubView ; FFIE-CALC-01/02, 🟢 Phase 2, réservés aux adhérents).
//
// `initialSegment` permet à un lien profond (raccourci « Outils FFIE » / « Nos
// métiers » de l'Accueil) d'ouvrir un segment précis ; `resetSignal` (ré-appui sur
// l'onglet déjà actif) ramène le défilement en haut.

import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { type ThemeName } from "@tokens";
import { GUTTER } from "@/components/ui/ios";
import { useHomeColors } from "@/components/home/homeColors";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToolsHubView } from "./ToolsHubView";
import { ProfessionsView } from "./ProfessionsView";

// Les segments à l'intérieur de l'onglet. "trades" est le contenu carrières
// public (l'atterrissage par défaut) ; "tools" est la grille de lancement qui
// accueille aussi les calculateurs (voir ToolsHubView). Un contrôle segmenté en
// haut bascule entre eux, comme l'onglet Actualités.
type TradesTab = "trades" | "tools";

export function DiscoverScreen({
  themeName = "light",
  resetSignal,
  initialSegment,
}: {
  themeName?: ThemeName;
  /** Incrémenté par le shell quand l'onglet est ré-appuyé alors qu'il est déjà
   *  actif — ramène le défilement en haut. */
  resetSignal?: number;
  /** Ouvrir sur un segment spécifique (p. ex. "tools" en arrivant depuis le
   *  raccourci « Outils FFIE » de l'Accueil). Par défaut, le contenu carrières ("trades"). */
  initialSegment?: TradesTab;
}) {
  return (
    <DiscoverFeed themeName={themeName} initialTab={initialSegment} resetSignal={resetSignal} />
  );
}

// DiscoverFeed — le flux de l'onglet lui-même : le contrôle segmenté (Métiers /
// Outils) et, selon le segment, le contenu carrières ou la grille de lancement Outils.
function DiscoverFeed({
  themeName = "light",
  initialTab,
  resetSignal,
}: {
  themeName?: ThemeName;
  initialTab?: TradesTab;
  resetSignal?: number;
}) {
  // La grille de lancement « Outils » adopte l'allure du tableau de bord de
  // l'Accueil — page grise en creux derrière des cartes blanches surélevées — elle
  // obtient donc la palette de l'Accueil, et non celle inversée des écrans de liste.
  const homeC = useHomeColors(themeName);

  // Segment actif. Le contenu carrières « Métiers » est l'atterrissage par défaut ;
  // « Outils » est la grille de lancement (qui accueille les calculateurs).
  // `initialTab` permet à un lien profond d'ouvrir un segment spécifique.
  const [tab, setTab] = useState<TradesTab>(initialTab ?? "trades");

  // Changer de segment — ou ré-appuyer sur l'onglet actif (resetSignal) — repart en
  // haut, comme Actualités / Partenaires.
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [tab, resetSignal]);

  return (
    // Le titre de page vit désormais dans l'AppHeader partagé (shell) ; le contenu
    // se rend directement en dessous.
    <View style={{ flex: 1, backgroundColor: homeC.pageBg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sélecteur de segment, sous le grand titre comme un contrôle segmenté
            iOS : Métiers (contenu carrières, par défaut) et Outils (grille de
            lancement + calculateurs). */}
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 6, paddingBottom: 18 }}>
          <SegmentedControl
            themeName={themeName}
            value={tab}
            options={[
              { key: "trades", label: "Métiers" },
              { key: "tools", label: "Outils" },
            ]}
            onChange={setTab}
          />
        </View>

        {tab === "tools" ? (
          // La grille de lancement « Outils FFIE » — accueille aussi les calculateurs
          // sous forme de tuiles (PowerCalculatorSheet / VoltageDropSheet), réservées
          // aux adhérents. Voir ToolsHubView.
          <ToolsHubView themeName={themeName} />
        ) : (
          // « Métiers » (par défaut) — la section publique « Découvrir les métiers »
          // (WBS Epic 4) : fiches métiers + parcours de formation + vidéos de présentation.
          <ProfessionsView themeName={themeName} />
        )}
      </ScrollView>
    </View>
  );
}

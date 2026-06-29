// Onglet « Outils » — la grille de lancement des outils FFIE (Karim + Léa + Julien).
//
// Auparavant, cet onglet portait un contrôle segmenté « Métiers / Outils ». Le
// segment carrières « Métiers » (ProfessionsView) a été déplacé dans l'onglet
// Docs (voir LibraryScreen) à la demande du client ; l'onglet ne propose donc plus
// que la grille de lancement Outils (ToolsHubView), qui accueille aussi les
// calculateurs (FFIE-CALC-01/02, réservés aux adhérents).
//
// `resetSignal` (ré-appui sur l'onglet déjà actif) ramène le défilement en haut.

import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { type ThemeName } from "@tokens";
import { useHomeColors } from "@/components/home/homeColors";
import { ToolsHubView } from "./ToolsHubView";

export function DiscoverScreen({
  themeName = "light",
  resetSignal,
}: {
  themeName?: ThemeName;
  /** Incrémenté par le shell quand l'onglet est ré-appuyé alors qu'il est déjà
   *  actif — ramène le défilement en haut. */
  resetSignal?: number;
}) {
  // La grille de lancement « Outils » adopte l'allure du tableau de bord de
  // l'Accueil — page grise en creux derrière des cartes blanches surélevées — elle
  // obtient donc la palette de l'Accueil, et non celle inversée des écrans de liste.
  const homeC = useHomeColors(themeName);

  // Ré-appuyer sur l'onglet actif (resetSignal) repart en haut, comme les autres onglets.
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [resetSignal]);

  return (
    // Le titre de page vit dans l'AppHeader partagé (shell) ; le contenu se rend
    // directement en dessous.
    <View style={{ flex: 1, backgroundColor: homeC.pageBg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* La grille de lancement « Outils FFIE » — accueille aussi les calculateurs
            sous forme de tuiles (PowerCalculatorSheet / VoltageDropSheet), réservées
            aux adhérents. Voir ToolsHubView. */}
        <ToolsHubView themeName={themeName} />
      </ScrollView>
    </View>
  );
}

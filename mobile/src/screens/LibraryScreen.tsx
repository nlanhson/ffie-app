// LibraryScreen — l'onglet « Docs », désormais scindé en deux segments par le
// même contrôle segmenté que les autres onglets (Actualités / Partenaires /
// Outils) :
//   • Docs    — la Bibliothèque de documents FFIE (DocLibraryScreen) : le pilier,
//               consulté au quotidien sur chantier (l'atterrissage par défaut).
//   • Métiers — le contenu carrières public (ProfessionsView) : la section
//               « Découvrir les métiers » (WBS Epic 4) — fiches métiers + parcours
//               de formation + vidéos de présentation. Déplacé ici depuis l'onglet
//               Outils à la demande du client.
//
// Pourquoi un wrapper plutôt qu'un seul ScrollView partagé (comme DiscoverScreen) :
// DocLibraryScreen possède son PROPRE ScrollView (recherche, filtres, retour-en-haut)
// et bascule en plein écran sur le détail d'un document. Le contrôle segmenté vit
// donc dans une barre fixe AU-DESSUS, et chaque segment défile indépendamment. La
// barre se masque quand un détail de document est ouvert pour que la vue détail
// occupe tout l'espace (comme l'AppHeader du shell se masque sur les détails).

import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { type ThemeName, type DensityMode } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { useHomeColors } from "@/components/home/homeColors";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DocLibraryScreen } from "./DocLibraryScreen";
import { ProfessionsView } from "./ProfessionsView";
import type { Doc } from "@/data/docs";

// Les segments à l'intérieur de l'onglet Docs. « docs » est la Bibliothèque
// (l'atterrissage par défaut) ; « trades » est le contenu carrières (Métiers).
type LibraryTab = "docs" | "trades";

type Props = {
  themeName: ThemeName;
  density: DensityMode;
  offline: boolean;
  onDocPress?: (doc: Doc) => void;
  /** Voir DocLibraryScreen — l'incitation à l'adhésion quand un invité touche un
   *  document verrouillé. Omis dans le shell adhérent. */
  onApply?: () => void;
  /** CTA secondaire de cette incitation — « J'ai déjà un compte » → connexion. */
  onSignIn?: () => void;
  /** Incrémenté par le shell quand l'onglet est ré-appuyé alors qu'il est déjà
   *  actif — referme un détail de document et ramène le défilement en haut. */
  resetSignal?: number;
  /** Vrai quand un détail de document est ouvert ; le shell masque alors l'avatar
   *  flottant et son AppHeader. On le relaie ici en plus de masquer la barre de
   *  segments. */
  onDetailChange?: (isDetail: boolean) => void;
  /** Ouvrir sur un segment spécifique (p. ex. « trades » en arrivant depuis le
   *  raccourci « Découvrir les métiers » de l'Accueil). Par défaut, la
   *  Bibliothèque (« docs »). */
  initialSegment?: LibraryTab;
};

export function LibraryScreen({
  themeName,
  density,
  offline,
  onDocPress,
  onApply,
  onSignIn,
  resetSignal,
  onDetailChange,
  initialSegment,
}: Props) {
  // Le segment « docs » (Bibliothèque) adopte la palette des listes groupées
  // (page blanche, cartes grises) ; le segment « trades » (carrières) adopte
  // l'allure du tableau de bord de l'Accueil (page grise en creux derrière des
  // cartes blanches surélevées). La barre de segments prend la palette du segment
  // actif pour rester homogène.
  const groupedC = useGroupedColors(themeName);
  const homeC = useHomeColors(themeName);

  const [tab, setTab] = useState<LibraryTab>(initialSegment ?? "docs");
  // Vrai pendant qu'un détail de document est ouvert : on masque alors la barre de
  // segments pour que la vue détail occupe tout l'espace.
  const [docDetail, setDocDetail] = useState(false);

  // Un lien profond (raccourci de l'Accueil) peut demander un segment précis après
  // le montage — on suit l'`initialSegment` quand il change.
  useEffect(() => {
    if (initialSegment) setTab(initialSegment);
  }, [initialSegment]);

  // Défilement du segment carrières — ramené en haut au changement de segment ou
  // au ré-appui sur l'onglet actif (resetSignal), comme Actualités / Partenaires.
  const tradesScrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    tradesScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [tab, resetSignal]);

  const pageBg = tab === "docs" ? groupedC.pageBg : homeC.pageBg;
  // La barre de segments ne s'affiche que sur les pages principales — masquée
  // quand un détail de document occupe l'écran.
  const showToggle = !docDetail;

  return (
    <View style={{ flex: 1, backgroundColor: pageBg }}>
      {showToggle ? (
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 12, paddingBottom: 12 }}>
          <SegmentedControl
            themeName={themeName}
            value={tab}
            options={[
              { key: "docs", label: "Docs" },
              { key: "trades", label: "Métiers" },
            ]}
            onChange={setTab}
          />
        </View>
      ) : null}

      {tab === "docs" ? (
        // La Bibliothèque possède son propre ScrollView + bascule plein écran sur
        // le détail. On relaie son état de détail au shell ET on le garde local
        // pour masquer la barre de segments.
        <DocLibraryScreen
          themeName={themeName}
          density={density}
          offline={offline}
          onDocPress={onDocPress}
          onApply={onApply}
          onSignIn={onSignIn}
          resetSignal={resetSignal}
          onDetailChange={(d) => {
            setDocDetail(d);
            onDetailChange?.(d);
          }}
        />
      ) : (
        // « Métiers » — section publique « Découvrir les métiers » (fiches métiers
        // + parcours de formation + vidéos). Rend des Views simples ; on fournit le
        // ScrollView ici (comme le faisait DiscoverScreen).
        <ScrollView
          ref={tradesScrollRef}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <ProfessionsView themeName={themeName} />
        </ScrollView>
      )}
    </View>
  );
}

// AgendaModalScreen — la fenêtre plein écran des événements « Agenda », ouverte comme
// une modale qui glisse depuis le haut, depuis la carte d'accès rapide « Agenda » de
// l'Accueil (les deux rôles).
//
// Elle présente le même contenu d'événements que le segment « Événements » de l'onglet
// Actualités (EventsView : calendrier hebdomadaire + liste d'événements), mais comme une
// surface plein écran dédiée avec son propre grand titre et un bouton de fermeture — un
// chemin plus rapide vers l'agenda que onglet → segment.
//
// La sous-navigation est une petite machine à états interne plutôt qu'un
// NavigationContainer imbriqué : taper un événement bascule sur EventDetailScreen ; un
// invité tapant un événement réservé aux adhérents bascule sur l'incitation à l'adhésion
// (MemberOnlyPrompt). Les deux transitions sont des coupes instantanées (le glissement
// propre de la modale couvre l'entrée), donc il n'y a aucun mouvement décoratif à
// encadrer pour le mouvement réduit (P5).
//
// La gestion du verrouillage diffère selon le rôle : les adhérents n'empruntent jamais le
// chemin verrouillé ; pour les invités, les CTA de l'incitation (onApply / onSignIn) sont
// renvoyés au shell, qui ferme d'abord CETTE modale puis ouvre l'entonnoir d'adhésion /
// de connexion (le motif de fermeture échelonnée utilisé ailleurs, pour que deux modales
// plein écran ne se disputent jamais sur iOS).

import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { LargeTitleHeader, useGroupedColors } from "@/components/ui/ios";
import { EventsView } from "./EventsView";
import { EventDetailScreen } from "./EventDetailScreen";
import { MemberOnlyPrompt } from "./MemberOnlyPrompt";

type AgendaView =
  | { type: "list" }
  | { type: "detail"; id: number }
  | { type: "locked"; id: number };

export function AgendaModalScreen({
  themeName = "light",
  onClose,
  onApply,
  onSignIn,
}: {
  themeName?: ThemeName;
  /** Ferme toute la modale agenda. */
  onClose: () => void;
  /** Invité uniquement : le CTA « demander l'adhésion » d'un événement réservé aux adhérents. */
  onApply?: () => void;
  /** Invité uniquement : le CTA « J'ai déjà un compte » d'un événement réservé aux adhérents. */
  onSignIn?: () => void;
}) {
  const [view, setView] = useState<AgendaView>({ type: "list" });
  // Appelé inconditionnellement (règle des hooks) — lu uniquement sur la vue liste.
  const c = useGroupedColors(themeName);

  if (view.type === "detail") {
    return (
      <EventDetailScreen
        id={view.id}
        themeName={themeName}
        onBack={() => setView({ type: "list" })}
      />
    );
  }

  if (view.type === "locked") {
    // Incitation invité pour un événement réservé aux adhérents. Retour revient à la
    // liste ; les CTA passent la main au shell (qui ferme cette modale, puis ouvre
    // l'entonnoir).
    return (
      <MemberOnlyPrompt
        themeName={themeName}
        onBack={() => setView({ type: "list" })}
        onApply={onApply}
        onSignIn={onSignIn}
      />
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <LargeTitleHeader
          title="Agenda"
          themeName={themeName}
          trailing={<CloseButton themeName={themeName} onPress={onClose} />}
        />
        <EventsView
          themeName={themeName}
          onOpenEvent={(id) => setView({ type: "detail", id })}
          onOpenLocked={(id) => setView({ type: "locked", id })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Fermeture de modale style iOS : un disque gris plein avec un X, placé dans
// l'emplacement de fin du grand titre. hitSlop élève le disque de 30 pt à une cible ≥ 44 pt.
function CloseButton({
  themeName,
  onPress,
}: {
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Fermer"
      accessibilityHint="Ferme l'agenda"
      style={({ pressed }) => ({
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: t.border.default,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <X size={18} color={t.text.muted} strokeWidth={2.5} />
    </Pressable>
  );
}

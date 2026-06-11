// Flux de demande d'adhésion — la petite machine à états derrière le CTA Rejoindre.
//
//   formulaire → (envoi) → envoyée/en attente
//
// Ouvert en modal glissant vers le haut par la coquille invité. Il lit le contexte
// d'adhésion : si une demande est déjà en attente (l'utilisateur a rouvert le flux),
// il démarre directement sur l'écran de confirmation plutôt que sur le formulaire
// vide. L'envoi enregistre la demande dans le contexte (ce qui bascule le statut
// global sur « en attente ») et passe à l'écran de confirmation.

import React, { useState } from "react";
import { type ThemeName } from "@tokens";
import {
  useMembership,
  type ApplicationInput,
  type MembershipApplication,
} from "@/auth/membershipContext";
import { MembershipApplicationScreen } from "./MembershipApplicationScreen";
import { ApplicationSubmittedScreen } from "./ApplicationSubmittedScreen";

export function MembershipApplicationFlow({
  themeName = "light",
  onClose,
}: {
  themeName?: ThemeName;
  onClose: () => void;
}) {
  const { application, submitApplication } = useMembership();
  // Initialise depuis le contexte pour que la réouverture d'une demande en attente
  // arrive sur l'écran de confirmation plutôt que sur un formulaire vierge.
  const [submitted, setSubmitted] = useState<MembershipApplication | null>(application);

  if (submitted) {
    return (
      <ApplicationSubmittedScreen
        themeName={themeName}
        application={submitted}
        onDone={onClose}
      />
    );
  }

  return (
    <MembershipApplicationScreen
      themeName={themeName}
      onBack={onClose}
      onSubmit={(input: ApplicationInput) => setSubmitted(submitApplication(input))}
    />
  );
}

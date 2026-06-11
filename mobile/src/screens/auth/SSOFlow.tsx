// Parcours SSO — sélecteur de fédération → connexion fédération (vérification) → terminé.
//
// Sélectionner une fédération n'authentifie plus à elle seule : cela ne fait que
// choisir QUEL fournisseur d'identité de fédération vérifier. L'adhérent est
// ensuite redirigé vers la connexion sécurisée de cette fédération
// (FederationSignInScreen — une redirection, sans identifiants dans l'app) avant
// d'être admis — comblant l'écart « choisissez un endroit au hasard et vous êtes
// connecté ».
//
//   SSOFederationScreen (choix)  →  FederationSignInScreen (redirection)  →  onAuthenticated
//
// Rendu sur place par LoginScreen quand le bouton « Connexion SSO fédération »
// est touché. onCancel renvoie à la connexion ; onAuthenticated promeut la
// session. Maquette v1 de bout en bout (pas de backend) — voir FederationSignInScreen.

import React, { useState } from "react";
import { SSOFederationScreen } from "./SSOFederationScreen";
import { FederationSignInScreen } from "./FederationSignInScreen";
import { type Federation } from "@/data/federations";

export function SSOFlow({
  onCancel,
  onAuthenticated,
}: {
  onCancel: () => void;
  onAuthenticated: () => void;
}) {
  // null = choix d'une fédération ; défini = connexion à elle (étape de vérification).
  const [federation, setFederation] = useState<Federation | null>(null);

  if (federation) {
    return (
      <FederationSignInScreen
        federation={federation}
        onBack={() => setFederation(null)}
        onSignIn={onAuthenticated}
      />
    );
  }

  return (
    <SSOFederationScreen onBack={onCancel} onConnect={(fed) => setFederation(fed)} />
  );
}

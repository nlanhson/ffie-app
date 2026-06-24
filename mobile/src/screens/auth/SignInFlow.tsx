// Parcours de connexion — « J'ai déjà un compte » → connexion → authentifié.
//
// Réutilise exactement le LoginScreen du parcours de connexion de l'onboarding
// pour que le CTA invité « J'ai déjà un compte » se comporte comme la connexion
// de l'écran d'accueil : saisissez votre identifiant + mot de passe, Se
// connecter, et la coquille promeut la session en adhérent.
//
// UNE seule Modal qui glisse vers le haut hébergeant LoginScreen. (La version
// précédente alternait une étape e-mail et une étape OTP dans cette modale ; le
// LoginScreen à mot de passe a remplacé les deux, il n'y a donc plus d'étape
// interne à basculer — un seul écran authentifie directement.)
//
// Maquette v1 : tout identifiant + mot de passe bien formés authentifient (pas
// de backend). Production : vérifiez les identifiants auprès de l'API
// d'authentification FFIE avant onAuthenticated.

import React from "react";
import { Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginScreen } from "./LoginScreen";

export function SignInFlow({
  visible,
  onClose,
  onAuthenticated,
  onJoin,
}: {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: (identifier: string) => void;
  // « Pas encore adhérent ? Adhérer à la FFIE » — redirige vers le tunnel d'adhésion.
  onJoin?: () => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <LoginScreen
          onBack={onClose}
          onSubmit={(identifier) => onAuthenticated(identifier)}
          onJoin={onJoin}
        />
      </SafeAreaProvider>
    </Modal>
  );
}

// Parcours d'onboarding — la machine à états qui accompagne l'utilisateur du
// lancement de l'app jusqu'à l'app principale (bibliothèque de documents).
//
// Graphe d'états (v0.8 — les deux parcours sont des surcouches qui glissent vers
// le haut sur Bienvenue) :
//   splash → path:
//     « Se connecter »      → LoginScreen → TERMINÉ (adhérent)
//                              └─ « Adhérer à la FFIE » → BecomeMemberScreen (annuaire)
//     « Naviguer librement » → DiscoverPlaceholderScreen → TERMINÉ (public)
//
// Les deux parcours s'affichent dans des Modales qui glissent vers le haut,
// présentées par-dessus l'écran de bienvenue. Retour depuis la connexion →
// referme vers Bienvenue ; retour depuis Découvrir → referme vers Bienvenue. Le
// LoginScreen à mot de passe a remplacé l'ancienne paire sans mot de passe
// e-mail → OTP, il n'y a donc plus d'étape de vérification intermédiaire : Se
// connecter (ou SSO) authentifie directement (maquette v1).
//
// « Adhérer à la FFIE » sur la connexion N'entre PAS dans l'app — l'adhésion est
// fédérée (on candidate via sa fédération départementale), cela ouvre donc
// l'annuaire des fédérations (carte + liste) par-dessus la connexion, comme la
// coquille invité. Le refermer renvoie à la connexion.
//
// En production : persister `done` + `mode` dans SecureStore / AsyncStorage pour
// que l'utilisateur ne voie l'onboarding qu'une seule fois. Pour la coquille de
// design-preview, l'état vit en mémoire et un contrôle de débogage
// « Réinitialiser l'onboarding » le rejoue.

import React, { useCallback, useState } from "react";
import { Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { type ThemeName } from "@tokens";
import { SplashScreen } from "./SplashScreen";
import { PathSelectionScreen, type OnboardingPath } from "./PathSelectionScreen";
import { DiscoverPlaceholderScreen } from "./DiscoverPlaceholderScreen";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { BecomeMemberScreen } from "@/screens/BecomeMemberScreen";

export type OnboardingResult = {
  mode: "member" | "public";
  identifier?: string;
};

type Step = "splash" | "path";

export function OnboardingFlow({
  themeName = "light",
  onComplete,
  initialStep = "splash",
}: {
  themeName?: ThemeName;
  onComplete: (result: OnboardingResult) => void;
  // Le lancement démarre sur le splash de marque ; une déconnexion explicite
  // passe « path » pour atterrir directement sur l'écran de connexion / sélection
  // de parcours (sans rejouer le splash).
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [loginVisible, setLoginVisible] = useState(false);
  // « Pas encore adhérent ? Adhérer à la FFIE » ouvre l'annuaire des fédérations
  // (carte + liste départementale) par-dessus la connexion — le vrai tunnel
  // d'adhésion, jamais une entrée silencieuse dans l'app. Même écran que celui
  // utilisé par la coquille invité, par cohérence.
  const [joinVisible, setJoinVisible] = useState(false);
  const [discoverVisible, setDiscoverVisible] = useState(false);
  const [identifier, setIdentifier] = useState<string>("");
  const [splashAdvanced, setSplashAdvanced] = useState(false);

  const advanceFromSplash = useCallback(() => {
    if (splashAdvanced) return;
    setSplashAdvanced(true);
    const t = setTimeout(() => setStep("path"), 500);
    return () => clearTimeout(t);
  }, [splashAdvanced]);

  // Se connecter / SSO → authentifier directement (maquette v1 : toute saisie bien formée).
  const handleLogin = useCallback(
    (value?: string) => {
      setLoginVisible(false);
      onComplete({ mode: "member", identifier: value ?? identifier });
    },
    [identifier, onComplete],
  );

  switch (step) {
    case "splash":
      return <SplashScreen themeName={themeName} onReady={advanceFromSplash} />;

    case "path":
      return (
        <>
          <PathSelectionScreen
            themeName={themeName}
            onSelect={(p: OnboardingPath) => {
              if (p === "member") setLoginVisible(true);
              else setDiscoverVisible(true);
            }}
          />

          {/* Parcours adhérent — Modale qui glisse vers le haut pour que la carte
              de bienvenue « s'agrandisse » visuellement en formulaire de
              connexion plein écran. Le contenu de la Modale reçoit un
              SafeAreaProvider neuf — les marges de react-native-safe-area-context
              ne se propagent pas de façon fiable à travers la vue hôte de la
              Modale native, donc sans ceci la marge du haut peut grandir au
              remontage. */}
          <Modal
            visible={loginVisible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setLoginVisible(false)}
          >
            <SafeAreaProvider>
              <LoginScreen
                initialIdentifier={identifier}
                onBack={() => setLoginVisible(false)}
                onSubmit={(value) => {
                  setIdentifier(value);
                  handleLogin(value);
                }}
                // « Pas encore adhérent ? » — ouvre l'annuaire des fédérations,
                // pas l'app. L'adhésion est fédérée : on candidate via sa
                // fédération départementale (pas d'auto-inscription).
                onJoin={() => setJoinVisible(true)}
              />

              {/* Annuaire des fédérations — imbriqué DANS le contenu de la modale
                  de connexion pour qu'il se présente par-dessus la connexion sur
                  iOS (une modale sœur à la racine ne peut pas se présenter tant
                  que la modale de connexion est ouverte — même contrainte que
                  contourne la coquille invité). Le refermer, ou « Déjà adhérent ?
                  Se connecter », renvoie à la connexion en dessous. */}
              <Modal
                visible={joinVisible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => setJoinVisible(false)}
              >
                <SafeAreaProvider>
                  <BecomeMemberScreen
                    themeName={themeName}
                    onClose={() => setJoinVisible(false)}
                    onLogin={() => setJoinVisible(false)}
                  />
                </SafeAreaProvider>
              </Modal>
            </SafeAreaProvider>
          </Modal>

          {/* Parcours Découvrir — même schéma de Modale qui glisse vers le haut
              pour que les deux parcours paraissent symétriques. Le refermer
              renvoie à Bienvenue. */}
          <Modal
            visible={discoverVisible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setDiscoverVisible(false)}
          >
            <SafeAreaProvider>
              <DiscoverPlaceholderScreen
                themeName={themeName}
                onSignInInstead={() => setDiscoverVisible(false)}
                onContinue={() => {
                  setDiscoverVisible(false);
                  onComplete({ mode: "public" });
                }}
              />
            </SafeAreaProvider>
          </Modal>
        </>
      );
  }
}

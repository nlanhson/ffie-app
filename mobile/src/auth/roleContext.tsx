// Modèle de rôle / d'accès — maquette v1.
//
// La taxonomie à 4 rôles reflète la matrice d'accès FFIE :
//   - « guest-public »  → Grand public (Léa)                  — non authentifié
//   - « guest-company » → Entreprise non adhérente (Karim)    — non authentifié
//   - « member »        → Adhérent (Julien)                   — authentifié, accès complet
//   - « admin »         → Admin FFIE                          — back-office WEB UNIQUEMENT
//
// « admin » est inclus volontairement pour que le type soit total vis-à-vis du
// cahier des charges, mais il ne devrait jamais apparaître dans une session mobile.
// RequireRole le traite comme un échec strict avec un repli AdminWebOnly par sécurité.
//
// En v1 il n'y a pas de véritable authentification. L'état du rôle vit en mémoire et
// est initialisé par le onComplete d'OnboardingFlow (mode → rôle). Un interrupteur de
// débogage dans les builds de préview dev permet au client de faire défiler les rôles
// pour prévisualiser chaque persona.

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Role = "guest-public" | "guest-company" | "member" | "admin";

export type Access = "public" | "member-only" | "admin-only";

// Fonction de décision pure — sans dépendance React. Testée isolément ; réutilisée par
// tout code de navigation ou de contrôle d'accès aux fonctionnalités (table de routes,
// éléments de menu conditionnels, etc.).
export function canAccess(role: Role, access: Access): boolean {
  if (access === "public") return true;
  if (access === "member-only") return role === "member" || role === "admin";
  if (access === "admin-only") return role === "admin";
  return false;
}

// Rôle par défaut au démarrage à froid — l'hypothèse la plus sûre pour une session
// mobile non authentifiée. OnboardingFlow le met à jour dès que l'utilisateur choisit un parcours.
const DEFAULT_ROLE: Role = "guest-public";

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextValue>({
  role: DEFAULT_ROLE,
  setRole: () => {
    // Valeur par défaut sans effet — appeler setRole hors d'un RoleProvider est un bug,
    // mais on ne lève pas d'exception pour garder le type ergonomique pour les tests.
  },
});

export function RoleProvider({
  children,
  initialRole = DEFAULT_ROLE,
}: {
  children: React.ReactNode;
  initialRole?: Role;
}) {
  const [role, setRoleState] = useState<Role>(initialRole);
  const setRole = useCallback((next: Role) => setRoleState(next), []);
  const value = useMemo(() => ({ role, setRole }), [role, setRole]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  return useContext(RoleContext);
}

// Commodité : convertir le résultat de mode d'OnboardingFlow vers le type Role plus riche.
// « public » se réduit à guest-public en v1 — on ne distingue pas encore Karim de Léa à
// partir d'un seul appui de sélection de parcours. À l'avenir : ajouter une seconde invite
// ou déduire à partir de signaux analytiques.
export function roleFromOnboardingMode(mode: "member" | "public"): Role {
  return mode === "member" ? "member" : "guest-public";
}

// Tables de configuration des onglets.
//
// Ordre de la barre du bas (les deux rôles) : Accueil · Actualités · Documents · Partenaires · Métiers.
// (« Documents » est le libellé de la barre du bas pour la clé `library` — l'écran
// reste la Bibliothèque, DocLibraryScreen ; seul le libellé de l'onglet a été raccourci.)
//
// Onglets adhérent (Adhérent — Julien) :
//   Accueil      · la surface d'atterrissage — premier onglet, ouverture ici au lancement
//   Actualités   · actualités du secteur + de la fédération
//   Documents    · pilier — consultations quotidiennes sur chantier (Bibliothèque, clé « library »)
//   Partenaires  · l'annuaire des partenaires de la fédération (PartnersScreen). Les
//                  segments « Mission & valeurs » / « Organisation » sont masqués en
//                  Phase 1 — voir SHOW_FEDERATION_SEGMENTS dans PartnersScreen.tsx.
//   Métiers      · carrières, formations, ressources externes (Métiers)
//
// Onglets invité (Entreprise non adhérente + Grand public) :
//   Accueil · Actualités · Documents · Partenaires · Métiers
//
// Accueil / Actualités / Bibliothèque / Partenaires / Métiers sont partagés entre les
// deux rôles. Deux éléments vivent EN DEHORS de la barre du bas sous forme d'avatars
// flottants en haut à droite (AdhererButton) :
//   - Invités  : « Adhérer » → annuaire des fédérations (BecomeMemberScreen) en modale.
//   - Adhérents : Profil → la page de compte/réglages (la clé d'onglet « profile » est
//     conservée pour que l'avatar puisse y router ; elle n'a simplement pas d'entrée dans la barre du bas).
//
// Note : la clé d'onglet « partners » route vers PartnersScreen ; son libellé affiche
// « Partenaires », ce qui correspond au grand titre de l'écran et à son unique segment
// visible maintenant que les segments de fédération sont masqués.

import type { ComponentType } from "react";
import { BookOpen, Compass, Home, Newspaper, Handshake } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import type { Access } from "@/auth/roleContext";

export type MemberTabKey = "home" | "library" | "news" | "partners" | "discover" | "profile";
export type GuestTabKey = "home" | "discover" | "news" | "partners" | "library";

export type TabKey = MemberTabKey | GuestTabKey;

export type TabConfig<K extends TabKey = TabKey> = {
  key: K;
  label: string;
  icon: LucideIcon;
  access: Access;
};

export const MEMBER_TABS: ReadonlyArray<TabConfig<MemberTabKey>> = [
  { key: "home", label: "Accueil", icon: Home, access: "public" },
  { key: "news", label: "Actualités", icon: Newspaper, access: "public" },
  { key: "library", label: "Documents", icon: BookOpen, access: "member-only" },
  { key: "partners", label: "Partenaires", icon: Handshake, access: "public" },
  // Onglet « discover » — libellé « Outils » (le segment Métiers est temporairement
  // retiré ; il ne propose plus que Vidéos + Calculateurs). Voir DiscoverScreen.
  { key: "discover", label: "Outils", icon: Compass, access: "public" },
  // Le Profil n'est volontairement PAS un onglet du bas — on y accède via l'avatar
  // en haut à droite (la clé « profile » existe toujours pour cette route).
];

export const GUEST_TABS: ReadonlyArray<TabConfig<GuestTabKey>> = [
  { key: "home", label: "Accueil", icon: Home, access: "public" },
  { key: "news", label: "Actualités", icon: Newspaper, access: "public" },
  // La Bibliothèque + les Métiers font désormais aussi partie de l'expérience invité. La
  // Bibliothèque est marquée publique ici parce que la coquille invité l'héberge
  // directement (pas de barrière RequireRole) — les non-adhérents parcourent le même annuaire.
  { key: "library", label: "Documents", icon: BookOpen, access: "public" },
  { key: "partners", label: "Partenaires", icon: Handshake, access: "public" },
  { key: "discover", label: "Outils", icon: Compass, access: "public" },
];

// Évite de re-typer dans les rendus qui se moquent de la navigation de quel rôle ils affichent.
export type AnyTabConfig = TabConfig<MemberTabKey> | TabConfig<GuestTabKey>;

// Réexport de LucideIcon pour que les consommateurs n'aient pas besoin d'un second import.
export type { ComponentType, LucideIcon };

// Repères « adhérents » pour la Carte des adhérents + la liste « Adhérents à
// proximité » (FFIE-16).
//
// FFIE-16 (carte des adhérents + géolocalisation + consentement RGPD) est bloqué
// côté backend : il n'existe aucune API d'annuaire des adhérents en v1. Les
// entrées ci-dessous sont des adhérents de DÉMONSTRATION (raisons sociales
// FICTIVES) placés autour de l'Île-de-France et sur les grandes métropoles, pour
// que la carte et la liste « proches » se lisent comme peuplées.
//
// ⚠️ Données de démonstration assumées : les noms d'entreprises sont inventés et
// ne correspondent à AUCUN adhérent FFIE réel. Ils ne portent volontairement
// AUCUNE coordonnée de contact (téléphone/adresse/email) inventée — toucher une
// entrée affiche un espace réservé « coordonnées à venir ». Les `distanceKm`
// sont des distances de démonstration mesurées depuis l'utilisateur simulé
// (Île-de-France) ; les `specialty` sont de vraies catégories de métiers de
// l'électricité. Remplacer ce module par l'annuaire géolocalisé réel quand le
// backend FFIE-16 sera livré.

import type { FederationPin } from "@/components/ui/FederationMap";

export type MemberPin = FederationPin & {
  /** Ville principale de l'adhérent (libellé d'affichage). */
  city: string;
  /** Catégorie de métier (vraie spécialité, pas la raison sociale). */
  specialty: string;
  /** Distance de démonstration depuis l'utilisateur simulé (Île-de-France), en km. */
  distanceKm: number;
  /** Initiales de l'avatar — dérivées de la raison sociale si absentes. */
  initials?: string;
};

// Construit un repère en dérivant le `title`/`description` du `FederationPin` à
// partir des champs adhérent, pour que la bulle de la carte et la ligne de la
// liste « proximité » lisent la même chose.
function member(
  id: number,
  name: string,
  city: string,
  specialty: string,
  lat: number,
  lng: number,
  distanceKm: number,
  initials?: string,
): MemberPin {
  return {
    id,
    lat,
    lng,
    city,
    specialty,
    distanceKm,
    initials,
    title: name,
    description: `${city} · ${specialty}`,
  };
}

export const MEMBER_PINS: MemberPin[] = [
  // — Île-de-France : adhérents « proches » de l'utilisateur simulé —
  member(1, "ELEC PRO SAS", "Paris 15e", "Électricité générale", 48.8417, 2.2986, 1.2, "EP"),
  member(2, "AEL Solutions", "Issy-les-Moulineaux", "Bornes de recharge (IRVE)", 48.8243, 2.27, 3.4, "AS"),
  member(3, "Voltiss Électricité", "Boulogne-Billancourt", "Multi-services", 48.8352, 2.2409, 4.8, "VT"),
  member(4, "Lumen Réseaux", "Montrouge", "Réseaux & fibre optique", 48.8188, 2.3199, 5.6),
  member(5, "Domotik Habitat", "Vincennes", "Éclairage & domotique", 48.8478, 2.437, 7.1),
  member(6, "Solaris Énergie", "Nanterre", "Photovoltaïque", 48.8924, 2.2069, 9.3),
  // — Autres métropoles : peuplent la carte nationale —
  member(7, "Rhône Volt", "Lyon", "Courants faibles", 45.764, 4.8357, 392),
  member(8, "Mistral IRVE", "Marseille", "Bornes de recharge (IRVE)", 43.2965, 5.3698, 660),
  member(9, "Garonne Élec", "Toulouse", "Photovoltaïque", 43.6047, 1.4442, 590),
  member(10, "Atlantic Domotique", "Nantes", "Automatisme du bâtiment", 47.2184, -1.5536, 343),
  member(11, "Nord Lumière", "Lille", "Génie climatique", 50.6292, 3.0573, 204),
  member(12, "Rhin Réseaux", "Strasbourg", "Réseaux & fibre optique", 48.5734, 7.7521, 397),
];

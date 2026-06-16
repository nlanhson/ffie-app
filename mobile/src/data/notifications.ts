// Centre de notifications — flux d'alertes factice affiché dans
// NotificationCenterScreen (la cloche en haut à droite de l'en-tête).
//
// FFIE-PUSH-01 : les adhérents reçoivent les alertes de la fédération
// (actualités, mises à jour de documents, événements, alertes réglementaires).
// Le transport push (`expo-notifications`) et la taxonomie back-office
// (FFIE-BO-07) ne sont pas encore branchés — ce module reproduit donc la forme
// que servira l'API en attendant, comme le font déjà news.ts / events.ts.
//
// Le texte est réaliste mais volontairement exempt de chiffres précis inventés
// sur la fédération (CLAUDE.md : aucune donnée réelle fabriquée) — ce sont des
// alertes d'interface, pas des faits sur la FFIE. Quand le back-office arrivera,
// remplacer ce module par les données de l'API de notifications.
//
// `tone` reste abstrait (pas une couleur littérale) pour que l'écran le mappe
// vers la couleur du thème actif — les notifications doivent suivre le thème
// même si la palette change. La pastille « non lu » se pilote depuis `read`.

import {
  Bell,
  CalendarDays,
  FileText,
  Newspaper,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react-native";

// Famille de notification — pilote l'icône de la ligne et sa teinte. Reflète les
// canaux que la FFIE poussera (FFIE-BO-07, à confirmer côté back-office).
export type NotificationKind =
  | "news" // nouvelle actualité publiée
  | "document" // document ajouté / mis à jour dans la Bibliothèque
  | "event" // rappel / ouverture d'inscription d'un événement
  | "regulation" // alerte réglementaire urgente
  | "membership"; // élément lié au compte adhérent

// Regroupement temporel — l'écran rend une section par groupe (Aujourd'hui /
// Cette semaine / Plus tôt). Précalculé ici plutôt que dérivé d'un horodatage à
// l'exécution, comme le champ d'affichage `date` de news.ts.
export type NotificationGroup = "today" | "week" | "earlier";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  /** Corps court — une à deux lignes dans la liste. */
  body: string;
  /** Libellé d'horodatage prêt à l'affichage (Europe/Paris), p. ex. « il y a 2 h ». */
  timeLabel: string;
  group: NotificationGroup;
  read: boolean;
};

// Icône + teinte par famille. `tone` est un nom de couleur sémantique résolu
// par l'écran vers le thème actif (voir NotificationCenterScreen).
export const NOTIFICATION_META: Record<
  NotificationKind,
  { icon: LucideIcon; tone: "accent" | "info" | "success" | "warning" }
> = {
  news: { icon: Newspaper, tone: "accent" },
  document: { icon: FileText, tone: "info" },
  event: { icon: CalendarDays, tone: "success" },
  regulation: { icon: ShieldAlert, tone: "warning" },
  membership: { icon: Bell, tone: "accent" },
};

// Ordre + libellés des sections temporelles.
export const NOTIFICATION_GROUPS: ReadonlyArray<{
  key: NotificationGroup;
  label: string;
}> = [
  { key: "today", label: "Aujourd'hui" },
  { key: "week", label: "Cette semaine" },
  { key: "earlier", label: "Plus tôt" },
];

// Flux factice. Le plus récent en premier au sein de chaque groupe (l'écran
// conserve cet ordre). Voir la note d'en-tête sur l'absence de chiffres inventés.
export const NOTIFICATIONS: ReadonlyArray<AppNotification> = [
  {
    id: "n-1",
    kind: "regulation",
    title: "Alerte réglementaire",
    body: "Mise à jour de la norme NF C 15-100 : consultez la synthèse FFIE.",
    timeLabel: "il y a 2 h",
    group: "today",
    read: false,
  },
  {
    id: "n-2",
    kind: "news",
    title: "Nouvelle actualité",
    body: "La FFIE publie son point trimestriel sur la filière électrique.",
    timeLabel: "il y a 5 h",
    group: "today",
    read: false,
  },
  {
    id: "n-3",
    kind: "document",
    title: "Document ajouté",
    body: "Un nouveau guide technique est disponible dans la Bibliothèque.",
    timeLabel: "hier",
    group: "week",
    read: false,
  },
  {
    id: "n-4",
    kind: "event",
    title: "Inscriptions ouvertes",
    body: "Les inscriptions à la prochaine journée technique sont ouvertes.",
    timeLabel: "il y a 3 j",
    group: "week",
    read: true,
  },
  {
    id: "n-5",
    kind: "membership",
    title: "Votre adhésion",
    body: "Votre carte d'adhérent FFIE est à jour pour l'année en cours.",
    timeLabel: "il y a 1 sem.",
    group: "earlier",
    read: true,
  },
  {
    id: "n-6",
    kind: "news",
    title: "Communication FFIE",
    body: "Retour sur les temps forts de la fédération ce mois-ci.",
    timeLabel: "il y a 2 sem.",
    group: "earlier",
    read: true,
  },
];

/** Nombre de notifications non lues — pilote la pastille de la cloche. */
export function unreadCount(
  list: ReadonlyArray<AppNotification> = NOTIFICATIONS,
): number {
  return list.reduce((n, item) => (item.read ? n : n + 1), 0);
}

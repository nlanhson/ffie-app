// Adhérent actuel (connecté) — identité fictive de la v1.
//
// Il n'y a pas de backend d'authentification/profil en v1 (voir CLAUDE.md →
// « Auth and membership are mocked UI »). Le persona adhérent est Julien
// Marchand — la même identité que celle affichée par ProfileScreen — afin que
// l'app reste cohérente partout où l'adhérent connecté apparaît (en-tête hero
// de l'accueil, carte du profil, …).
//
// Le numéro d'adhérent est une donnée fictive, PAS un véritable enregistrement
// FFIE (la règle « no fabricated real-world data » couvre les faits liés à la
// fédération comme les cotisations et les coordonnées, pas le compte fictif
// servant à prévisualiser l'interface adhérent). Quand une vraie session
// arrivera, remplacer ce module par les données de l'API de profil.
//
// La même règle régit le bloc entreprise + les qualifications ci-dessous : le
// nom de l'entreprise et le SIRET sont des données de compte fictives (le SIRET
// est volontairement masqué, comme un espace réservé « détails à venir »), et
// QUALIFELEC / CONSUEL sont les véritables *types* de certification des métiers
// de l'électricité qu'un adhérent pourrait détenir — leur état « valide » ici
// est un état de compte fictif, pas un fait fabriqué sur la fédération.

export type MemberStatus = "active" | "pending" | "lapsed";

/** Une certification métier détenue par l'adhérent (Profil → Qualifications). */
export type MemberQualification = {
  label: string;
  /** Indique si la certification est actuellement valide (état de compte fictif). */
  valid: boolean;
};

export type MemberProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  /** Monogramme pour les avatars lorsqu'aucune photo n'est définie. */
  initials: string;
  /** Numéro d'adhérent à la fédération, affiché sous la forme « N° {memberNo} ». */
  memberNo: string;
  status: MemberStatus;
  /** Libellé lisible de la pastille de statut, p. ex. « Adhérent actif ». */
  statusLabel: string;
  /** Intitulé de poste au sein de l'entreprise adhérente (hero du profil). */
  jobTitle: string;
  /** Région de la fédération à laquelle l'adhérent appartient. */
  region: string;
  /** L'entreprise de l'adhérent — données de compte fictives (voir la note d'en-tête). */
  company: {
    /** Raison sociale de l'entreprise. */
    name: string;
    /** Identifiant SIRET — espace réservé masqué jusqu'à l'arrivée d'une vraie session. */
    siret: string;
  };
  /** Certifications métier affichées dans le groupe Profil → Qualifications. */
  qualifications: MemberQualification[];
};

export const currentMember: MemberProfile = {
  firstName: "Julien",
  lastName: "Marchand",
  fullName: "Julien Marchand",
  initials: "JM",
  memberNo: "04521",
  status: "active",
  statusLabel: "Adhérent actif",
  jobTitle: "Responsable technique",
  region: "Île-de-France",
  company: {
    name: "ELEC PRO SAS",
    siret: "814 xxx xxx",
  },
  qualifications: [
    { label: "QUALIFELEC", valid: true },
    { label: "Agréé CONSUEL", valid: true },
  ],
};

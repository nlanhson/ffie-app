// Document-library content — seeded from the real FFIE documents page
// (https://www.ffie.fr/les-documents-de-la-ffie), per WBS Epic 3 / FFIE-DOC-01:
// "synchronization of existing documents from the FFIE site, structuring of
// the document library." Titles/references are kept verbatim in French (the
// source corpus is French); production replaces this seed with a live sync
// from the FFIE backend + a local SQLite/MMKV cache.
//
// Each doc carries:
//   - `family` / `category`: the FFIE site's own two-level taxonomy, so the
//     library can be STRUCTURED and filtered/searched by category (FFIE-DOC-04).
//   - `memberOnly`: mirrors "Contenu réservé aux adhérents" on the site. The
//     whole Library tab is already member-gated (access model), so this is
//     informational/forward-looking — the one public doc is also the one we
//     surface to guests via a public news item (FFIE-NEWS-02), not here.
//   - `saved`: the DEVICE offline state — is this document downloaded to keep
//     locally? This is the visible surface of FFIE-DOC-03 ("download documents
//     to keep locally") and Principle 2 (offline-first). Deliberately a simple
//     two-state flag (saved / not saved) — richer cache states aren't in scope.
//     Runtime sets this at sync time; the values here are a plausible state for
//     the preview.
//   - `sourceUrl`: the real FFIE file URL where one is publicly resolvable.

// Top-level groups, mirroring the family filters on the FFIE documents page.
// Order here is the canonical display order in the library.
export const DOC_FAMILIES = [
  "Courants forts",
  "Sûreté / Sécurité incendie",
  "Bâtiments connectés",
  "Performance énergétique",
  "Vie de l'entreprise",
  "Maintenance",
  "Communication",
] as const;

export type DocFamily = (typeof DOC_FAMILIES)[number];

export type Doc = {
  id: number;
  title: string;
  /** Shown under the title — "{reference} · {category}". */
  subtitle: string;
  /** FFIE sub-category (e.g. "Réseaux de communication"). */
  category: string;
  /** FFIE top-level group — used to section the library. */
  family: DocFamily;
  /** "Contenu réservé aux adhérents" on the FFIE site. */
  memberOnly: boolean;
  /** Downloaded to keep locally (FFIE-DOC-03 / P2). Two states only. */
  saved: boolean;
  /** Real FFIE file URL, where publicly resolvable. */
  sourceUrl?: string;
};

export const DOCS: Doc[] = [
  // — Courants forts —
  {
    id: 9,
    title: "Évolution du programme des primes Advenir pour les bornes de recharge en copropriété",
    subtitle: "Notéco 51 · IRVE",
    category: "IRVE",
    family: "Courants forts",
    memberOnly: true,
    saved: true,
  },
  {
    id: 11,
    title: "Point de vigilance sur la fin du SF6",
    subtitle: "Notec 597 · Commande et distribution électrique",
    category: "Commande et distribution électrique",
    family: "Courants forts",
    memberOnly: true,
    saved: true,
  },

  // — Sûreté / Sécurité incendie —
  {
    id: 12,
    title: "Sécurité électrique des logements — Dépliant clients",
    subtitle: "Dépliant · Sécurité incendie",
    category: "Sécurité incendie",
    family: "Sûreté / Sécurité incendie",
    memberOnly: true,
    saved: false,
  },

  // — Bâtiments connectés —
  {
    id: 2,
    title: "Lexique des principaux termes des réseaux de communication filaires et sans fil",
    subtitle: "Notec 599 · Réseaux de communication",
    category: "Réseaux de communication",
    family: "Bâtiments connectés",
    memberOnly: true,
    saved: true,
  },
  {
    id: 5,
    title: "Initiation au réseau Mesh",
    subtitle: "Notec 598 · Réseaux de communication",
    category: "Réseaux de communication",
    family: "Bâtiments connectés",
    memberOnly: true,
    saved: true,
  },

  // — Performance énergétique —
  {
    // The one publicly accessible document on the FFIE site — it has a real,
    // resolvable file URL and is also featured as a public news item.
    id: 3,
    title: "Plan d'électrification des usages 2026 — Les propositions de la FFIE",
    subtitle: "Propositions FFIE · Performance énergétique",
    category: "Performance énergétique",
    family: "Performance énergétique",
    memberOnly: false,
    saved: true,
    sourceUrl:
      "https://www.ffie.fr/fileadmin/user_upload/Plan_d_electrification_des_usages_2026_-_Propositions_FFIE.pdf",
  },

  // — Vie de l'entreprise —
  {
    id: 4,
    title: "Guide RH — Sensibilisation des collaborateurs au port des EPI",
    subtitle: "Mémo RH 11 · Ressources humaines",
    category: "Ressources humaines / Compétences",
    family: "Vie de l'entreprise",
    memberOnly: true,
    saved: false,
  },
  {
    id: 10,
    title: "Baromètre de l'activité économique de l'intégration électrique",
    subtitle: "Baromètre · Vie de l'entreprise",
    category: "Vie de l'entreprise",
    family: "Vie de l'entreprise",
    memberOnly: true,
    saved: false,
  },

  // — Communication —
  {
    id: 1,
    title: "Pacte de l'Équipe de France de l'Électrification",
    subtitle: "Pacte · Actualités et évènements",
    category: "Actualités et évènements",
    family: "Communication",
    memberOnly: true,
    saved: true,
  },
  {
    id: 6,
    title: "Plaquette institutionnelle FFIE",
    subtitle: "Plaquette · Documents de communication",
    category: "Documents de communication",
    family: "Communication",
    memberOnly: true,
    saved: true,
  },
  {
    id: 7,
    title: "Carnet des publications FFIE 2025",
    subtitle: "Catalogue 2025 · Documents de communication",
    category: "Documents de communication",
    family: "Communication",
    memberOnly: true,
    saved: false,
  },
  {
    id: 8,
    title: "Journal des Électriciens 960 — Avril 2026",
    subtitle: "JE 960 · Journal des électriciens",
    category: "Journal des électriciens",
    family: "Communication",
    memberOnly: true,
    saved: false,
  },
];

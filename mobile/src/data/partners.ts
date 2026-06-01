// Mock partners content — mirrors the FFIE "Nos partenaires" page
// (ffie.fr/les-missions-de-la-ffie/nos-partenaires). In production these come
// from the FFIE backend; for now the full federation partner roster is entered
// by hand, in the same data-driven shape as docs.ts, so the Partners screen has
// real content to list.
//
// Fields:
//   - short:    2–4 char monogram for the leading tile (no logos yet).
//   - category: drives the Partners screen's filter sheet (analogous to a
//               doc's `status`). See PARTNER_CATEGORY_LABELS for the chips.
//   - url:      official website. "" where the source page lists no link
//               (CEETB, FISUEL) — the row then opens nothing.

export type PartnerCategory =
  | "standards"
  | "federation"
  | "energy"
  | "institution"
  | "finance"
  | "solidarity";

export type Partner = {
  id: number;
  name: string;
  short: string;
  description: string;
  category: PartnerCategory;
  url: string;
};

// Chip labels for the filter sheet. Keep keys in sync with PartnerCategory.
export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, string> = {
  standards: "Normes & certification",
  federation: "Fédérations & syndicats",
  energy: "Énergie & réseaux",
  institution: "Institutions publiques",
  finance: "Finance & assurance",
  solidarity: "Solidarité",
};

// All 28 partners listed on the FFIE site, in the page's alphabetical order.
export const PARTNERS: Partner[] = [
  { id: 1, name: "AFNOR", short: "AF", description: "Organisme français de normalisation — certifie la conformité aux normes électriques.", category: "standards", url: "http://www.afnor.org/" },
  { id: 2, name: "ANITEC", short: "AN", description: "Alliance nationale des intégrateurs de technologies connectées et sécurisées.", category: "federation", url: "http://www.anitec.fr/" },
  { id: 3, name: "BTP Banque", short: "BTP", description: "La banque des métiers du bâtiment et des travaux publics.", category: "finance", url: "http://www.btp-banque.fr/" },
  { id: 4, name: "CEETB", short: "CE", description: "Comité européen des équipements techniques du bâtiment.", category: "federation", url: "" },
  { id: 5, name: "CENELEC", short: "CEN", description: "Comité européen de normalisation électrotechnique.", category: "standards", url: "http://www.cenelec.eu/" },
  { id: 6, name: "COEDIS", short: "CO", description: "Fédération des distributeurs d'équipements et de solutions électriques.", category: "federation", url: "https://coedis.fr/" },
  { id: 7, name: "Commission Européenne", short: "EU", description: "Commission européenne — politiques et réglementation de l'UE.", category: "institution", url: "https://ec.europa.eu/info/index_fr" },
  { id: 8, name: "Consuel", short: "CSL", description: "Comité national pour la sécurité des usagers de l'électricité.", category: "standards", url: "http://www.consuel.com/" },
  { id: 9, name: "CRE", short: "CRE", description: "Commission de régulation de l'énergie.", category: "institution", url: "https://www.cre.fr/" },
  { id: 10, name: "EDF", short: "EDF", description: "Électricité de France — fournisseur national d'électricité.", category: "energy", url: "https://www.edf.fr/" },
  { id: 11, name: "ecosystem", short: "ECO", description: "Éco-organisme pour la collecte et le recyclage des lampes et des DEEE.", category: "energy", url: "https://www.ecosystem.eco/" },
  { id: 12, name: "Électriciens sans frontières", short: "ESF", description: "ONG œuvrant pour l'accès à l'eau et à l'énergie.", category: "solidarity", url: "http://www.electriciens-sans-frontieres.org/" },
  { id: 13, name: "Enedis", short: "EN", description: "Gestionnaire du réseau de distribution d'électricité en France.", category: "energy", url: "https://www.enedis.fr/" },
  { id: 14, name: "EuropeON", short: "EON", description: "Association européenne des installateurs électriciens.", category: "federation", url: "http://europe-on.org" },
  { id: 15, name: "FFB", short: "FFB", description: "Fédération Française du Bâtiment.", category: "federation", url: "https://www.ffbatiment.fr/" },
  { id: 16, name: "FIEEC", short: "FIE", description: "Fédération des industries électriques, électroniques et de communication.", category: "federation", url: "http://www.fieec.fr/" },
  { id: 17, name: "FISUEL", short: "FIS", description: "Fédération internationale pour la sécurité des usagers de l'électricité.", category: "standards", url: "" },
  { id: 18, name: "GIMELEC", short: "GIM", description: "Groupement des industries de l'équipement électrique et du contrôle-commande.", category: "federation", url: "http://www.gimelec.fr/" },
  { id: 19, name: "IEC", short: "IEC", description: "Commission électrotechnique internationale.", category: "standards", url: "https://www.iec.ch/" },
  { id: 20, name: "IGNES", short: "IGN", description: "Industries du génie numérique, énergétique et sécuritaire.", category: "federation", url: "http://www.ignes.fr/" },
  { id: 21, name: "Objectif fibre", short: "OF", description: "Plateforme accompagnant le déploiement de la fibre optique en France.", category: "energy", url: "https://www.objectif-fibre.fr" },
  { id: 22, name: "PRO BTP", short: "PRO", description: "Groupe de protection sociale des métiers du bâtiment.", category: "finance", url: "http://www.probtp.com/" },
  { id: 23, name: "Promotelec", short: "PMT", description: "Association pour un habitat sûr, performant et durable.", category: "standards", url: "http://www.promotelec.com/" },
  { id: 24, name: "Qualifelec", short: "QF", description: "Organisme de qualification des métiers de l'électricité et de l'énergie.", category: "standards", url: "http://www.qualifelec.fr/" },
  { id: 25, name: "SERCE", short: "SER", description: "Syndicat professionnel de 260 entreprises de génie électrique.", category: "federation", url: "http://www.serce.fr/" },
  { id: 26, name: "SMA BTP", short: "SMA", description: "Assureur mutualiste du bâtiment et des travaux publics.", category: "finance", url: "https://www.groupe-sma.fr/" },
  { id: 27, name: "SYCABEL", short: "SYC", description: "Syndicat des fabricants de fils et câbles électriques.", category: "federation", url: "https://www.sycabel.com/" },
  { id: 28, name: "UTE", short: "UTE", description: "Union Technique de l'Électricité — acteurs de la normalisation.", category: "standards", url: "http://ute-asso.fr/" },
];

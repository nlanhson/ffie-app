// FFIE departmental federations — the directory behind "La FFIE dans votre
// région". To join FFIE you apply through your departmental federation, so the
// Become-a-member page lists them all and lets you open each one.
//
// Source: https://www.ffie.fr/?eID=federations — the JSON feed that powers the
// region map on ffie.fr. Department/area label ('area') and official federation
// name ('name') are taken verbatim from that feed; 'code' is the department
// number derived from each federation's postcode (3 digits overseas; 2A/2B for
// Corsica), used only as the row badge.
//
// The contact block (members, phone, address, website) comes from the same
// feed and is filled in per federation. Until an entry has its details, its
// row expands to a clean "details coming" state — nothing fabricated.

/** A named contact at a federation (e.g. its Chairman or Secretary General). */
export type FederationMember = {
  role: string;
  name: string;
  email?: string;
  phone?: string;
};

export type Federation = {
  id: number;
  /** Department number for the row badge (3 digits overseas; 2A/2B Corsica). */
  code: string;
  /** Department / area label, e.g. "Côtes d'Armor", "Grand Paris". */
  area: string;
  /** Official federation name, e.g. "Fédération du BTP des Côtes d'Armor". */
  name: string;

  // ---- Contact block — from the same feed, populated per federation ----
  /** Named contacts, in display order (Chairman, Secretary General, …). */
  members?: FederationMember[];
  /** General phone line for the federation. */
  phone?: string;
  /** Fax line, when the federation lists one. */
  fax?: string;
  /** Full postal address, single line. */
  address?: string;
  website?: string;
};

// 96 departmental federations, in the feed's order.
export const FEDERATIONS: Federation[] = [
  {
    id: 1,
    code: "22",
    area: "Côtes d'Armor",
    name: "Fédération du BTP des Côtes d'Armor",
    members: [
      { role: "Président", name: "Michael YOBE", email: "m.yobe@bse22.fr" },
      { role: "Secrétaire général", name: "Benedicte DESMONS", email: "desmonsb@d22.ffbatiment.fr" },
    ],
    phone: "02 96 74 40 80",
    address: "14, rue du Rocher Cornet / BP 340 – 22193 PLERIN CEDEX",
  },
  {
    id: 2,
    code: "29",
    area: "Finistère",
    name: "Fédération du BTP du Finistère",
    members: [
      { role: "Président", name: "Hervé TRESSEL", email: "contact@dourmap.com" },
      { role: "Secrétaire général", name: "Jean-Robert CHARLET", email: "charletjr@d29a.ffbatiment.fr" },
    ],
    phone: "02 98 02 19 16",
    fax: "02 98 02 25 64",
    address: "55 rue Charles Nungesser - Zone Prat Pip Nord / CS 20116 / Guipavas - 29802 BREST cedex 9",
  },
  {
    id: 3,
    code: "35",
    area: "Ille-et-Vilaine",
    name: "Fédération du BTP d'Ille-et-Vilaine",
    members: [
      { role: "Président", name: "Bruno RENAUDIN", email: "brenaudin@satifrance.fr" },
      { role: "Secrétaire général", name: "Philip LELIEVRE", email: "lelievrep@fbtp35.fr" },
    ],
    phone: "02 99 38 28 28",
    fax: "02 99 36 96 75",
    address: "3, allée du Bâtiment / BP 91623 - 35016 RENNES CEDEX",
  },
  {
    id: 4,
    code: "56",
    area: "Morbihan",
    name: "Fédération du Bâtiment du Morbihan",
    members: [
      { role: "Président", name: "Stéphane TURLAIS", email: "rousse-electricite@orange.fr" },
      { role: "Secrétaire général", name: "Aude LE VAILLANT", email: "levaillanta@d56.ffbatiment.fr" },
    ],
    phone: "02 97 89 02 20",
    fax: "02 97 89 02 29",
    address: "507 rue Jacques-Ange Gabriel, Z.I. de Lann Sevelin - 56850 CAUDAN",
  },
  {
    id: 5,
    code: "14",
    area: "Calvados",
    name: "Fédération du BTP du Calvados",
    members: [
      { role: "Président", name: "Yohan BACHELET", email: "yohan.bachelet@bazinelec.fr" },
      { role: "Secrétaire général", name: "Olivier LAURENT", email: "laurento@d14.ffbatiment.fr" },
    ],
    phone: "07 88 58 16 98",
    address: "6, rue des Mouettes - 14000 CAEN",
  },
  {
    id: 6,
    code: "27",
    area: "Eure",
    name: "FFIE 27",
    members: [
      { role: "Président", name: "Denis MAINGOT", email: "denis.maingot@chaufpac-elec.fr" },
      { role: "Secrétaire général", name: "Jean-Luc LIGNEREUX", email: "lignereuxjl@d27.ffbatiment.fr" },
    ],
    phone: "02 32 62 22 20",
    fax: "02 32 62 22 22",
    address: "531 rue Clément Ader - 27930 LE VIEIL EVREUX",
  },
  {
    id: 7,
    code: "50",
    area: "Manche",
    name: "FFB Manche",
    members: [
      { role: "Président", name: "Jacky HAMELIN", email: "jhamelin@selca.fr" },
      { role: "Secrétaire général", name: "Amélie RENOUF", email: "renoufa@d50.ffbatiment.fr" },
    ],
    phone: "02 33 01 60 50",
    address: "50 place Napoléon - 50100 CHERBOURG EN COTENTIN",
  },
  {
    id: 8,
    code: "61",
    area: "Orne",
    name: "Fédération du BTP de l'Orne",
    members: [
      { role: "Président", name: "Romuald PHILIPPE", email: "romuald.philippe@ebi-electricite.fr" },
      { role: "Secrétaire général", name: "Lylian LAFINE", email: "lafinel@d61.ffbatiment.fr" },
    ],
    phone: "02 33 29 17 11",
    address: "21, av. de Basingstoke - 61000 Alençon",
  },
  {
    id: 9,
    code: "76",
    area: "Seine-Maritime Rouen",
    name: "Fédération Française du Bâtiment Rouen Métropole & Territoires",
    members: [
      { role: "Président", name: "Olivier ENAUT", email: "olivier.enaut@sofreg.fr" },
      { role: "Secrétaire général", name: "Arnaud BARROIS", email: "barroisa@d76a.ffbatiment.fr" },
    ],
    phone: "02 32 19 52 52",
    fax: "02 32 19 52 53",
    address: "14 rue Georges Charpak / BP 332 - 76136 Mont-Saint-Aignan Cedex",
  },
  {
    id: 10,
    code: "76",
    area: "Seine-Maritime (Le Havre Pointe de Caux)",
    name: "Fédération du BTP du Havre Pointe de Caux",
    members: [
      { role: "Président", name: "Sylvain FRANCOIS", email: "segfrancois@wanadoo.fr" },
      { role: "Secrétaire général", name: "Francis DECHAMPS", email: "dechampsf@d76b.ffbatiment.fr" },
    ],
    phone: "02 35 24 23 61",
    fax: "02 35 24 27 47",
    address: "1 Rue Paul Marion - 76600 Le Havre",
  },
  { id: 12, code: "59", area: "Nord-Pas-de-Calais", name: "FEDERATION FRANÇAISE DU BATIMENT NORD-PAS DE CALAIS GROUPEMENT REGIONAL DE L’EQUIPEMENT TECHNIQUE – GRET NPDC" },
  { id: 13, code: "60", area: "Oise", name: "Fédération Française du Bâtiment de l'Oise" },
  { id: 14, code: "80", area: "Somme", name: "Fédération du BTP de la Somme" },
  { id: 15, code: "08", area: "Ardennes", name: "Fédération du BTP des Ardennes" },
  { id: 16, code: "10", area: "Aube", name: "Fédération Départementale du BTP de l'Aube" },
  { id: 17, code: "67", area: "Bas-Rhin", name: "Fédération Française du Bâtiment du Bas-Rhin" },
  { id: 18, code: "68", area: "Haut-Rhin", name: "Fédération du Bâtiment et des Travaux Publics du Haut-Rhin" },
  { id: 19, code: "52", area: "Haute-Marne", name: "Fédération du BTP de Haute-Marne" },
  { id: 20, code: "51", area: "Marne", name: "Fédération Française du Bâtiment Marne" },
  { id: 21, code: "54", area: "Meurthe et Moselle", name: "Fédération Française du Bâtiment de Meurthe et Moselle" },
  { id: 22, code: "55", area: "Meuse", name: "Fédération du BTP de Meuse" },
  { id: 23, code: "57", area: "Moselle", name: "Fédération du BTP de la Moselle" },
  { id: 24, code: "88", area: "Vosges", name: "Fédération Française du BTP Vosges" },
  { id: 25, code: "44", area: "Loire-Atlantique", name: "Fédération du Bâtiment de Loire-Atlantique" },
  { id: 26, code: "49", area: "Maine-et-Loire", name: "Fédération du BTP du Maine-et-Loire" },
  { id: 27, code: "53", area: "Mayenne", name: "Fédération du BTP de la Mayenne" },
  { id: 28, code: "72", area: "Sarthe", name: "Fédération du BTP de la Sarthe" },
  { id: 29, code: "85", area: "Vendée", name: "Fédération du Bâtiment de Vendée" },
  { id: 30, code: "16", area: "Charente", name: "Fédération Française du Bâtiment de la Charente" },
  { id: 31, code: "17", area: "Charente-Maritime", name: "Fédération du BTP de Charente-Maritime" },
  { id: 32, code: "19", area: "Corrèze", name: "Fédération du BTP de Corrèze" },
  { id: 33, code: "23", area: "Creuse", name: "Fédération du BTP de la Creuse" },
  { id: 34, code: "79", area: "Deux-Sèvres", name: "Fédération du BTP des Deux-Sèvres" },
  { id: 35, code: "24", area: "Dordogne", name: "Fédération Dordogne des Entrepreneurs et Artisans du Bâtiment" },
  { id: 36, code: "33", area: "Gironde", name: "Fédération Française du Bâtiment Gironde" },
  { id: 38, code: "47", area: "Lot-et-Garonne", name: "Fédération du BTP du Lot-et-Garonne" },
  { id: 39, code: "64", area: "Pyrénées Atlantiques", name: "Fédération du BTP des Pyrénées Atlantiques" },
  { id: 40, code: "86", area: "Vienne", name: "Fédération du BTP de la Vienne" },
  { id: 41, code: "01", area: "Ain", name: "Fédération du BTP de l'Ain" },
  { id: 42, code: "02", area: "Aisne", name: "Fédération française du BTP de l'Aisne" },
  { id: 43, code: "03", area: "Allier", name: "Fédération Française du Bâtiment et des TP de l'Allier" },
  { id: 44, code: "04", area: "Alpes de Haute-Provence", name: "Fédération du BTP des Alpes de Haute-Provence" },
  { id: 45, code: "06", area: "Alpes-Maritimes", name: "Fédération du BTP des Alpes-Maritimes" },
  { id: 46, code: "09", area: "Ariège", name: "Fédération du BTP de l'Ariège" },
  { id: 47, code: "11", area: "Aude", name: "Fédération départementale du BTP de l'Aude" },
  { id: 48, code: "12", area: "Aveyron", name: "Fédération du BTP de l'Aveyron" },
  { id: 49, code: "13", area: "Bouches-du-Rhône", name: "Fédération du BTP des Bouches-du-Rhône" },
  { id: 50, code: "15", area: "Cantal", name: "Fédération du BTP du Cantal" },
  { id: 51, code: "18", area: "Cher", name: "Fédération Française du Bâtiment du Cher" },
  { id: 52, code: "2A", area: "Corse du Sud", name: "Fédération du BTP de Corse du Sud" },
  { id: 53, code: "21", area: "Côte d'Or", name: "Fédération Française du Bâtiment de la Côte d'Or" },
  { id: 54, code: "25", area: "Doubs", name: "Fédération du BTP du Doubs" },
  { id: 55, code: "26", area: "Drôme Ardèche", name: "Fédération du BTP de Drôme Ardèche" },
  { id: 56, code: "91", area: "Essonne", name: "FFB-ESSONNE" },
  { id: 57, code: "28", area: "Eure-et-Loir", name: "Fédération Française du Bâtiment d'Eure-et-Loir" },
  { id: 58, code: "30", area: "Gard", name: "Fédération du BTP du Gard" },
  { id: 59, code: "32", area: "Gers", name: "Fédération du BTP du Gers" },
  { id: 60, code: "2B", area: "Haute-Corse", name: "Fédération des entrepreneurs et artisans du BTP de Haute-Corse" },
  { id: 61, code: "31", area: "Haute-Garonne", name: "Fédération du BTP de Haute-Garonne" },
  { id: 62, code: "43", area: "Haute-Loire", name: "Fédération du BTP de la Haute-Loire" },
  { id: 63, code: "05", area: "Hautes-Alpes", name: "Fédération du BTP des Hautes-Alpes" },
  { id: 64, code: "70", area: "Haute-Saône", name: "Fédération du BTP de Haute-Saône" },
  { id: 65, code: "74", area: "Haute-Savoie", name: "Fédération des entrepreneurs et artisans du BTP de Haute-Savoie" },
  { id: 66, code: "65", area: "Hautes-Pyrénées", name: "Fédération du BTP des Hautes-Pyrénées" },
  { id: 67, code: "87", area: "Haute-Vienne", name: "Fédération du BTP de la Haute-Vienne" },
  { id: 68, code: "34", area: "Hérault", name: "Fédération du BTP de l'Hérault" },
  { id: 69, code: "36", area: "Indre", name: "Fédération du BTP de l'Indre" },
  { id: 70, code: "37", area: "Indre et Loire", name: "Fédération Française du Bâtiment d'Indre et Loire" },
  { id: 71, code: "38", area: "Isère", name: "Fédération du BTP de l'Isère" },
  { id: 72, code: "39", area: "Jura", name: "Fédération du BTP du Jura" },
  { id: 73, code: "40", area: "Landes", name: "Fédération Française du Bâtiment des Landes" },
  { id: 74, code: "42", area: "Loire", name: "Fédération du BTP de la Loire" },
  { id: 75, code: "45", area: "Loiret", name: "Fédération Française du BTP du Loiret" },
  { id: 76, code: "41", area: "Loir et Cher", name: "Fédération Française du Bâtiment du Loir-et-Cher" },
  { id: 77, code: "46", area: "Lot", name: "Fédération du BTP du Lot" },
  { id: 78, code: "48", area: "Lozère", name: "Fédération du BTP de la Lozère" },
  { id: 79, code: "58", area: "Nièvre", name: "Fédération du BTP de la Nièvre" },
  { id: 80, code: "75", area: "Grand Paris", name: "CSEEE (départements 75-92-93-94)" },
  { id: 81, code: "63", area: "Puy de Dôme", name: "Fédération du BTP du Puy-de-Dôme" },
  { id: 82, code: "66", area: "Pyrénées Orientales", name: "Maison du BTP des Pyrénées-Orientales" },
  { id: 83, code: "69", area: "Rhône", name: "Fédération des entreprises du BTP du Rhône et de la Métropole" },
  { id: 84, code: "71", area: "Saône et Loire", name: "Fédération du BTP de Saône et Loire" },
  { id: 85, code: "73", area: "Savoie", name: "Fédération du BTP de la Savoie" },
  { id: 86, code: "77", area: "Seine et Marne", name: "Fédération du BTP Ile-de-France Est" },
  { id: 87, code: "81", area: "Tarn", name: "Fédération du BTP du Tarn" },
  { id: 88, code: "82", area: "Tarn et Garonne", name: "Fédération du BTP de Tarn et Garonne" },
  { id: 89, code: "90", area: "Territoire de Belfort", name: "Fédération du BTP du Territoire de Belfort" },
  { id: 90, code: "95", area: "Val d'oise", name: "FFB du Val d'Oise" },
  { id: 91, code: "83", area: "Var", name: "Fédération du BTP du Var" },
  { id: 92, code: "84", area: "Vaucluse", name: "Fédération du BTP du Vaucluse" },
  { id: 93, code: "89", area: "Yonne", name: "Fédération des entrepreneurs et des artisans du BTP de l'Yonne" },
  { id: 94, code: "78", area: "Yvelines", name: "Fédération Française du Bâtiment des Yvelines" },
  { id: 95, code: "974", area: "La Réunion", name: "Fédération réunionnaise du Bâtiment et des Travaux Publics" },
  { id: 96, code: "971", area: "Guadeloupe", name: "FRBTPG" },
  { id: 97, code: "988", area: "Nouvelle Calédonie", name: "Fédération Calédonienne du BTP" },
  { id: 98, code: "972", area: "Martinique", name: "ORPEM - Organisation des Professionnels de l'Energie en Martinique" },
];

/** Display name for a federation — the official name, always present. */
export function federationTitle(f: Federation): string {
  return f.name;
}

/** True when at least one real contact field is filled in. Drives the
 *  expanded panel's "details coming from FFIE" empty state. */
export function hasContactDetails(f: Federation): boolean {
  return Boolean(f.address || f.phone || f.website || (f.members && f.members.length > 0));
}

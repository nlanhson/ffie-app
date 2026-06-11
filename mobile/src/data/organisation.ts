// Organisation content — mirrors the FFIE "Organisation" page
// (ffie.fr/les-missions-de-la-ffie/organisation). In production this comes from
// the FFIE backend / CMS; entered here by hand for now so the Partners tab's
// "Organisation" segment has the federation's real copy.
//
// The page presents a short intro then the three bodies that run the federation:
// the Executive Board, the Board of Directors, and the permanent Team.

// Subtitle under the large "Organisation" title.
export const ORG_SUBTITLE =
  "An executive board and a board of directors, made up exclusively of business leaders from the electrical integration sector, take part in running the organisation and define its overall direction.";

// One card per governing body. `stat` (optional) is the headline figure shown as
// a small badge; `body` is the descriptive line.
export type OrgBody = {
  id: string;
  title: string;
  stat?: string;
  body: string;
};

export const ORG_BODIES: OrgBody[] = [
  {
    id: "bureau",
    title: "Executive Board",
    stat: "9 members",
    body: "The FFIE's decision-making body, made up of business leaders from the sector and chaired by Pascal Toggenburger.",
  },
  {
    id: "conseil",
    title: "Board of Directors",
    stat: "46 members",
    body: "46 business leaders — all the regional delegates, the executive board members and the honorary directors — ensure broad governance representation.",
  },
  {
    id: "equipe",
    title: "Team",
    body: "Everything the FFIE's permanent team does is geared towards serving member companies: informing, advising, defending and supporting them.",
  },
];

// A person in one of the governing bodies. The source pages pair each with a
// portrait. To show real photo avatars, set `photo` on a member to either:
//   - a bundled asset:  photo: require("../../assets/team/rifaux.jpg")  (a number), or
//   - an image URL:     photo: "https://www.ffie.fr/.../rifaux.jpg"     (a string).
// When `photo` is absent the avatar falls back to an initials monogram
// (`initials`, or one derived from the name). `roles` are the title lines shown
// beside the name (stacked, in order).
export type OrgMember = {
  name: string;
  initials?: string;
  /** require()'d local asset (number) or remote image URL (string). */
  photo?: number | string;
  roles: string[];
};

// Members of the Executive Board, from the "Les membres du bureau FFIE" org chart.
export const BUREAU_MEMBERS: OrgMember[] = [
  { name: "Pascal Toggenburger", initials: "PT", roles: ["President"] },
  {
    name: "Renaud Collard de Soucy",
    initials: "RC",
    roles: ["Vice-President", "Economic Commission"],
  },
  {
    name: "François Bressolette",
    initials: "FB",
    roles: ["Vice-President", "Treasurer", "EV Charging Lead"],
  },
  { name: "Philippe Ceschia", initials: "PC", roles: ["Facilitator of the High-Voltage Working Group"] },
  {
    name: "Julien Chomont",
    initials: "JC",
    roles: ["Social Affairs Lead", "President of the CSEEE (from January 2026)"],
  },
  { name: "Frédéric Demongeot", initials: "FD", roles: ["Technical and Innovations Commission"] },
  { name: "Cathie Meppiel", initials: "CM", roles: ["Employment and Skills Commission"] },
  { name: "Francis Renier", initials: "FR", roles: ["Craft Trades Commission"] },
  { name: "Jérôme Teste", initials: "JT", roles: ["President of the GMPV"] },
];

// Members of the Board of Directors, from the "Les membres du conseil
// d'administration" page — 46 business leaders (regional delegates, department
// presidents, commission leads). The page also lists honorary administrators,
// not named here. Names are normalised to "First name SURNAME" order; roles
// preserve the page's labels, split into stacked lines where it lists two
// distinct roles.
export const CONSEIL_MEMBERS: OrgMember[] = [
  { name: "Julien Adrast", roles: ["President of Indre-et-Loire"] },
  { name: "Jean-Marie Bailly", roles: ["Regional Delegate, Grand Est", "President of Aube"] },
  { name: "Arnaud Belloir", roles: ["Regional Delegate, Pays de la Loire"] },
  { name: "Edith Berard", roles: ["President of Pyrénées-Orientales"] },
  { name: "Daniel Bisegna", roles: ["President of Calvados"] },
  { name: "Philippe Boni", roles: ["Facilitator of the Energy Working Group"] },
  { name: "Christophe Bouguin", roles: ["President, FFB Yvelines"] },
  { name: "François Bressolette", roles: ["Vice-President, Treasurer", "EV Charging Lead"] },
  { name: "Claude Cadario", roles: ["Rhône"] },
  { name: "Philippe Ceschia", roles: ["President of the Territoire de Belfort"] },
  { name: "Franck Chaput", roles: ["President of Haute-Vienne"] },
  { name: "Julien Chomont", roles: ["CSEEE"] },
  { name: "Renaud Collard de Soucy", roles: ["Vice-President", "President of the Economic Commission"] },
  { name: "Fabien Crief", roles: ["Regional Delegate", "President of Seine-et-Marne"] },
  { name: "Régine Delanerie", roles: ["Hautes-Alpes"] },
  {
    name: "Frédéric Demongeot",
    roles: ["Regional Delegate, Bourgogne-Franche-Comté", "President of the Technical and Innovations Commission"],
  },
  { name: "Bertrand Desplats", roles: ["Regional Delegate, Occitanie", "President of Aude"] },
  { name: "Jonathan Duval", roles: ["President of AniTEC"] },
  { name: "Sylvain François", roles: ["President, Le Havre Pointe de Caux"] },
  { name: "Cédric Ghigou", roles: ["President of Var"] },
  { name: "Bernard Gioan", roles: ["Alpes-Maritimes"] },
  { name: "Frédéric Gondeau", roles: ["President of Rhône"] },
  { name: "Gaëtan Guchet", roles: ["Grand Paris"] },
  { name: "Xavier Guidez", roles: ["President, Nord Pas-de-Calais"] },
  { name: "Thierry Guillot", roles: ["Regional Delegate, Nouvelle-Aquitaine"] },
  { name: "Nathalie Lacroix", roles: ["President of Gers"] },
  { name: "Didier Lahure", roles: ["President, Nord Pas-de-Calais"] },
  { name: "Claude Leboue", roles: ["Regional Delegate, Hauts-de-France"] },
  { name: "Jocelyn Lefebvre", roles: ["Regional Delegate, Normandie"] },
  { name: "Stéphane Lelievre", roles: ["Regional Delegate, Bretagne"] },
  { name: "Alexandre Mahout", roles: ["Regional Delegate, Île-de-France 78-91-95"] },
  { name: "Nicolas Maillet-Avenel", roles: ["Seine-Maritime"] },
  { name: "Dominique Mathieu", roles: ["President, Meurthe-et-Moselle"] },
  {
    name: "Cathie Meppiel",
    roles: ["President of Bas-Rhin", "President of the Employment and Skills Commission"],
  },
  { name: "Patrick Moulard", roles: ["Alpes-Maritimes"] },
  { name: "Denis Onimus", roles: ["Grand Paris"] },
  { name: "Eric Ouvrard", roles: ["Essonne"] },
  { name: "Vincent Pireddu", roles: ["Regional Delegate, Corse"] },
  { name: "Marc Potier", roles: ["President, Côte d'Or"] },
  { name: "Francis Renier", roles: ["President of the Craft Trades Commission", "Regional Delegate, Centre-Val de Loire"] },
  { name: "Patrick Richaud", roles: ["Regional Delegate, PACA", "President of Bouches-du-Rhône"] },
  { name: "Xavier Rosa", roles: ["Regional Delegate, Grand Paris", "Social Affairs Lead"] },
  { name: "Jérôme Teste", roles: ["Regional Delegate, Auvergne-Rhône-Alpes"] },
  { name: "Pascal Texereau", roles: ["President of Vienne"] },
  { name: "Pascal Toggenburger", roles: ["President of the FFIE"] },
  { name: "Philippe Zanni", roles: ["President of Hérault and Gard"] },
];

// Honorary administrators — listed alongside the Board of Directors,
// separate from its 46 acting members. A few hold an honorific presidency.
export const CONSEIL_HONORARY: OrgMember[] = [
  { name: "Jean-Claude Albarran", roles: [] },
  { name: "Jean-Claude Appert", roles: [] },
  { name: "Patrick Aygobere", roles: [] },
  { name: "Christian Desplats", roles: [] },
  { name: "Dominique Gabrielle", roles: [] },
  { name: "Emmanuel Gravier", roles: ["Honorary President"] },
  { name: "Jean-Claude Guillot", roles: ["Honorary President"] },
  { name: "Jean Lagarrigue", roles: [] },
  { name: "Francis Lepers", roles: ["Honorary President"] },
  { name: "Jean-Pierre Monclin", roles: [] },
];

// The permanent team (the "Équipe FFIE" org chart). Portraits aren't ours to
// ship, so the popup renders initials monograms. The "High-Voltage" engineer
// slot is shown as a vacancy on the source (no name yet).
export const EQUIPE_MEMBERS: OrgMember[] = [
  { name: "Philippe Rifaux", roles: ["General Delegate"] },
  { name: "Carole Falguières", roles: ["Secretary General"] },
  { name: "Solange Caboche", roles: ["Secretary General's Assistant"] },
  { name: "Leïla Ricato", roles: ["Energy Performance Engineer"] },
  { name: "Laurence Auger", roles: ["Assistant to the President and General Delegate"] },
  { name: "Clotilde Lepape", roles: ["Communications Manager"] },
  { name: "Louis-Michel Rodrigues", roles: ["Internal Affairs Manager"] },
  { name: "Antoine Appol", roles: ["Internal Affairs Assistant"] },
  { name: "Pierre-Mary Le Person", roles: ["Director of Technical Affairs"] },
  { name: "Adel Guediri", roles: ["Low-Voltage Engineer"] },
  { name: "Position to be filled", initials: "?", roles: ["High-Voltage Engineer"] },
];

// ANITEC team, shown as a separate cluster on the same org chart.
export const ANITEC_MEMBERS: OrgMember[] = [
  { name: "Lilian Caule", roles: ["Technical Director"] },
  { name: "Karine Clément", roles: ["Executive Assistant"] },
];

// Switchboard numbers from the foot of the org chart. Real FFIE contact data.
export type OrgContact = { label: string; phone: string };
export const ORG_CONTACTS: OrgContact[] = [
  { label: "FFIE Reception", phone: "01 44 05 84 00" },
  { label: "Technical Hotline", phone: "01 44 05 84 01" },
  { label: "Anitec Reception", phone: "01 44 05 84 40" },
];

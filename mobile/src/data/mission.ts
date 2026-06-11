// Mission & valeurs content — mirrors the FFIE "Missions et valeurs" page
// (ffie.fr/les-missions-de-la-ffie/missions-et-valeurs). In production this
// comes from the FFIE backend / CMS; entered here by hand for now so the
// Partners tab's "Mission & valeurs" segment has the federation's real copy.
//
// Structure follows the source page's sections, in order:
//   intro → Our missions (3 points) → Across the whole country →
//   Connected to emerging markets (lead-in + list) → closing line.

// Opening statement at the top of the page.
export const MISSION_INTRO =
  "Since 1924, the FFIE has pursued a threefold mission: to represent, defend and promote electrical integration companies.";

// "Our missions" — the three pillars. `verb` is the action word the page
// emphasises; `body` is the text that follows it.
export type MissionPoint = { verb: string; body: string };

export const MISSION_POINTS: MissionPoint[] = [
  {
    verb: "Represent",
    body: "member companies: major players in the sector, craft businesses and independents alike. The FFIE today brings together 8,500 companies and 150,000 employees — 50% of the sector's workforce and 50% of its turnover.",
  },
  {
    verb: "Defend",
    body: "the profession's interests at the national, European and international level, before the bodies of the electrical industry and its major players.",
  },
  {
    verb: "Promote",
    body: "and deliver to members a continuous stream of information on the regulatory, technological and economic environment.",
  },
];

// "Across the whole country" — the federation's local footprint.
export const MISSION_TERRITORY_TITLE = "Across the whole country";
export const MISSION_TERRITORY_BODY =
  "The FFIE advises and supports companies at the local level with the backing of its 92 departmental organisations.";

// "Connected to emerging markets" — lead-in + the nine emerging market areas
// the federation helps members move into.
export const MISSION_MARKETS_TITLE = "Connected to emerging markets";
export const MISSION_MARKETS_INTRO =
  "The FFIE supports member companies in developing their expertise and know-how, through the advice, management tools and technological or regulatory monitoring it provides.";

export const MISSION_MARKETS: string[] = [
  "Digital integration",
  "PoE (Power over Ethernet)",
  "Big data, IoT",
  "Smart meters",
  "Energy transition",
  "Photovoltaics, self-consumption",
  "Artificial intelligence",
  "Electric mobility, EV charging",
];

// Closing line at the foot of the page.
export const MISSION_CLOSING =
  "The FFIE is committed to its members in building e-electricity.";

// ---------------------------------------------------------------------------
// Key figures — the federation's "FFIE en chiffres" infographic at the foot of
// the Missions et valeurs page. Reproduced as raw numbers so the animated
// infographic (components/MissionInfographic.tsx) can count up / fill rings to
// them. Percentages are 0–100.
// ---------------------------------------------------------------------------
export const MISSION_FIGURES = {
  entreprises: 8500, // member companies
  salariesPct: 50, // % of the sector's workforce
  actifs: 150000, // FFIE workers
  caPct: 50, // % of the sector's turnover
  caMds: 25, // €bn in turnover
  // Breakdown of turnover
  neufPct: 40,
  renovationPct: 60,
  // Type of work
  reseauxPct: 18, // works and networks
  batimentsPct: 82, // works in buildings
  // Works in buildings, by market
  residentielPct: 27,
  tertiairePct: 44,
  industrielPct: 29,
} as const;

// The eight trades listed down the left rail of the infographic, in page order.
// The infographic maps each to an icon; labels stay here so they're translatable
// and stay the single source of truth.
export const MISSION_METIERS: string[] = [
  "Automation",
  "Communication",
  "Thermal comfort",
  "Lighting",
  "Energy",
  "Building management systems",
  "Maintenance",
  "Security",
];

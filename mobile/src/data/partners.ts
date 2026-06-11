// Partners content — the curated, segmented showcase the federation approved
// for the Partners tab. It replaces the old flat "Nos partenaires" directory
// with the FFIE's own framing of who it works with, split into three segments:
//
//   - Ecosystem  · the commercial chain a member deals with day to day
//                  (distributors, manufacturers) plus the member building
//                  federation (FFB).
//   - Lab_FFIE   · the quality & compliance bodies, plus a short blurb about
//                  what the Lab_FFIE is.
//   - Partners   · the institutional partners.
//
// Each entry renders as a grouped-list row: a brand "logo" tile, the partner
// name, a one-line descriptor, and a chevron that opens the partner's official
// site in the in-app browser. The Partners screen is data-driven — to change
// what's listed (or add a segment / section), edit this file, not the screen.
//
// Logos: we don't ship the partners' real logo files yet, so the leading tile
// is a colored chip carrying the brand wordmark, tinted with each brand's own
// recognizable identity color (an explicit stand-in, not an invented logo).
// Swap `PartnerLogo` for a bundled image source when real assets arrive.

export type PartnerTabKey = "ecosystem" | "lab" | "partners";

// A brand "logo" chip: a tinted tile with the brand wordmark. `outlined` adds a
// hairline border so light/white chips (Sonepar, FFB) still read on a white card.
export type PartnerLogo = {
  bg: string;
  fg: string;
  text: string;
  outlined?: boolean;
};

export type PartnerEntry = {
  id: string;
  name: string;
  descriptor: string;
  logo: PartnerLogo;
  // Official website. Opened in the native in-app browser when the row is
  // tapped. Omit for an entry with no site (the row then isn't tappable).
  url?: string;
};

// A titled run of rows inside a segment (e.g. "Distributors"). The title is the
// uppercase grouped-table section header.
export type PartnerGroup = {
  header: string;
  entries: PartnerEntry[];
};

// Optional explanatory card rendered under a segment's groups (Lab_FFIE blurb).
export type PartnerNote = {
  title: string;
  body: string;
};

export type PartnerTab = {
  key: PartnerTabKey;
  label: string;
  groups: PartnerGroup[];
  note?: PartnerNote;
};

export const PARTNER_TABS: PartnerTab[] = [
  {
    key: "ecosystem",
    label: "Ecosystem",
    groups: [
      {
        header: "Distributors",
        entries: [
          {
            id: "rexel",
            name: "Rexel",
            descriptor: "Order material & tracking delivery",
            logo: { bg: "#15294E", fg: "#FFFFFF", text: "Rexel" },
            url: "https://www.rexel.fr/",
          },
          {
            id: "sonepar",
            name: "Sonepar",
            descriptor: "Catalogue & Pro Solutions",
            logo: { bg: "#FFFFFF", fg: "#0098D8", text: "Sonepar", outlined: true },
            url: "https://www.sonepar.fr/",
          },
        ],
      },
      {
        header: "Manufacturers",
        entries: [
          {
            id: "schneider",
            name: "Schneider Electric",
            descriptor: "Technical configurators & docs",
            logo: { bg: "#161616", fg: "#3DCD58", text: "Schneider" },
            url: "https://www.se.com/fr/fr/",
          },
          {
            id: "legrand",
            name: "Legrand",
            descriptor: "Products, Software & BIM",
            logo: { bg: "#E2001A", fg: "#FFFFFF", text: "Legrand" },
            url: "https://www.legrand.fr/",
          },
          {
            id: "hager",
            name: "Hager",
            descriptor: "Electric & Home Automation Tables",
            logo: { bg: "#004A99", fg: "#FFFFFF", text: "hager" },
            url: "https://www.hager.fr/",
          },
        ],
      },
      {
        header: "Member federation",
        entries: [
          {
            id: "ffb",
            name: "FFB",
            descriptor: "French Building Federation",
            logo: { bg: "#FFFFFF", fg: "#14387F", text: "FFB", outlined: true },
            url: "https://www.ffbatiment.fr/",
          },
        ],
      },
    ],
  },
  {
    key: "lab",
    label: "Lab_FFIE",
    groups: [
      {
        header: "Quality & compliance",
        entries: [
          {
            id: "consuel",
            name: "CONSUEL",
            descriptor: "Compliance of facilities",
            logo: { bg: "#1B2A52", fg: "#FFFFFF", text: "Consuel" },
            url: "https://www.consuel.com/",
          },
          {
            id: "qualifelec",
            name: "QUALIFELEC",
            descriptor: "Qualification electrical companies",
            logo: { bg: "#E2001A", fg: "#FFFFFF", text: "Qualifelec" },
            url: "https://www.qualifelec.fr/",
          },
        ],
      },
    ],
    note: {
      title: "About the Lab_FFIE",
      body: "Space dedicated to innovations, experiments and collaborative projects carried out by the federation and its partners.",
    },
  },
  {
    key: "partners",
    label: "Partners",
    groups: [
      {
        header: "Institutional partners",
        entries: [
          {
            id: "afnor",
            name: "AFNOR",
            descriptor: "French standardization",
            logo: { bg: "#2C2C2C", fg: "#FFFFFF", text: "Afnor" },
            url: "https://www.afnor.org/",
          },
          {
            id: "oppbtp",
            name: "OPPBTP",
            descriptor: "Prevention & safety BTP",
            logo: { bg: "#0072BC", fg: "#FFFFFF", text: "OPP BTP" },
            url: "https://www.preventionbtp.fr/",
          },
          {
            id: "probtp",
            name: "PRO BTP",
            descriptor: "Social protection of construction",
            logo: { bg: "#009640", fg: "#FFFFFF", text: "PRO BTP" },
            url: "https://www.probtp.com/",
          },
        ],
      },
    ],
  },
];

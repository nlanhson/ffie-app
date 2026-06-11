// Mock news content — mirrors the structure the FFIE backend will serve
// (Epic 2, News feed). In production these come from the CMS / back-office.
//
// `memberOnly` articles appear in the public feed as locked teasers: a guest
// who taps one is sent to the membership upsell rather than the reader. This
// is the only place the public/member boundary shows up inside News, and it
// doubles as a conversion surface (DESIGN_PRINCIPLES: news is "the bait").
//
// Copy is realistic but deliberately free of fabricated precise statistics —
// real figures come from FFIE.

export type NewsCategory = "Technical" | "Training" | "Communication" | "Economical";

// A body block is either a plain paragraph (string) or a "rich line" — an
// array of segments that can be bold or styled as a link. This lets a few
// articles mirror the FFIE site's formatting (bold date lead-ins, link words)
// while the rest stay simple strings.
export type RichSegment = { text: string; bold?: boolean; link?: boolean; url?: string };
export type BodyBlock = string | RichSegment[];

// A document attached to an article (NEWS-02: "the detailed view can display
// text, images, AND associated documents"). These are the real FFIE files an
// article references — surfaced as a first-class "Related documents" list in
// the reader, not just buried as inline body links. `kind` only drives the row
// icon; everything opens in the in-app browser for now (download lands with
// FFIE-DOC-03).
export type ArticleAttachment = { label: string; url: string; kind?: "pdf" | "doc" };

export type Article = {
  id: number;
  category: NewsCategory;
  title: string;
  excerpt: string;
  body: BodyBlock[]; // paragraphs (string) or rich lines (segment arrays)
  // Sortable publish date, ISO yyyy-mm-dd (the shape the backend will send).
  // This is the source of truth for feed order; `date` is its display form.
  isoDate: string;
  date: string; // display string (Europe/Paris), derived from isoDate
  readMinutes: number;
  memberOnly: boolean;
  imageUrl?: string; // real FFIE CMS image; falls back to a placeholder if absent
  attachments?: ArticleAttachment[]; // documents the article links to (NEWS-02)
};

// Content mirrors the live FFIE news articles, pulled from each
// article's detail page (titles/dates in French, bodies as supplied by FFIE —
// a mix of FR/EN). Article #1 is the featured/hero item, the rest fill the
// 2-column grid. The first body block of each article is the "lead" line,
// rendered larger in the reader.
//
// Categories are NOT exposed on the FFIE detail pages, so they're best-guess
// mappings to our 4-tag taxonomy (Economical → Economical, Training →
// Training, federation/event news → Communication).
const ARTICLES_RAW: Article[] = [
  {
    id: 1,
    category: "Communication",
    title: "FFIE 2026 regional meetings, ask for the program!",
    excerpt: "4 new regional meetings are planned...",
    body: [
      "4 new regional meetings are planned...",
      [
        { text: "On May 5 in Miribel", bold: true },
        { text: " - REXEL logistics center" },
      ],
      [
        { text: "On June 4 in Toulouse", bold: true },
        { text: " - FFB 31 - OCCITANIE regional meeting | " },
        { text: "REGISTRATION", link: true, url: "https://forms.office.com/e/M33WgFrPzK" },
      ],
      [
        { text: "On November 5 in Besançon", bold: true },
        { text: " - FFB 25 - BOURGOGNE FRANCHE-COMTÉ regional meeting" },
      ],
      [
        { text: "On December 3 in Port-Marly", bold: true },
        { text: " - FFB Île-de-France - ÎLE-DE-FRANCE regional meeting" },
      ],
    ],
    isoDate: "2026-01-01",
    date: "01.01.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/Design_sans_titre__8_.jpg",
  },
  {
    id: 2,
    category: "Communication",
    title: "FFIE regional meeting in Toulouse, there's still time!",
    excerpt: "Register for the Occitanie regional meeting...",
    body: [
      "Register for the Occitanie regional meeting...",
      "Are you in the Occitanie region? Don't miss the next FFIE Meeting on June 4 starting at 9:30 AM!",
      "A program designed for the region's electrical integration companies:",
      "• Low-voltage systems in connected buildings\n• Presentations by Citel, Schneider Electric, Sonepar and Milwaukee\n• A presentation of the tools FFIE makes available to you",
      "All in the presence of FFIE President Pascal Toggenburger and regional delegate Bertrand Desplats. A lunch reception will be served at the end of the meeting.",
      [
        {
          text: "View the program and register",
          link: true,
          url: "https://forms.office.com/pages/responsepage.aspx?id=ssnTPbZKGE6zJoaE4m80eR4ATBmRs3xAlpV89FTqU6lUMUEyTUM2NE9NOTlVWEZKRFlNTVFSN1hJMi4u&route=shorturl",
        },
      ],
    ],
    isoDate: "2026-05-29",
    date: "29.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/RR_OCCITANIE_WEB.jpg",
  },
  {
    id: 3,
    category: "Communication",
    title: "FFIE selected for the French Electrification Team",
    excerpt: "A French team for electrification...",
    body: [
      "A French team for electrification...",
      "FIEEC took the initiative to bring together all stakeholders in the electrical sector under the banner of the French Electrification Team. Within this framework, all stakeholders in the electrical sector — producers of all types of energy, network operators, electricity suppliers, storage and demand-flexibility operators, manufacturers, professional distributors, electrical integrators, plumbers-heating engineers, and more broadly all building companies and small craft businesses and installers of electrical technologies — are united and mobilized to form a French Electrification Team determined to act quickly across the regions to meet the targets set by the public authorities.",
      "It is through this collective — made up of industry flagships and SMEs in manufacturing, installation and professional distribution, as well as the network of hundreds of thousands of qualified building companies and craftspeople spanning the whole of France — that the electrification battle will be won.",
      "An op-ed was drafted and signed at the Élysée Palace in the presence of Emmanuel Macron, President of the Republic. FFIE wished for FFB to stand alongside it in this endeavor, and so it was only natural that FFB represented FFIE in signing the op-ed.",
      "The next step for the electrical sector is to work on concrete and effective proposals for the 2027 presidential election.",
      [
        {
          text: "Download the May 26 op-ed",
          link: true,
          url: "https://www.ffie.fr/fileadmin/DOCUMENTATION/PACTE_Equipe_de_France_Electrification.pdf",
        },
      ],
    ],
    isoDate: "2026-05-29",
    date: "29.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/ELECTRIFICATION_WEB.png",
    // The op-ed referenced inline above, surfaced as an attached document.
    attachments: [
      {
        label: "Op-ed — French Electrification Team (May 26)",
        url: "https://www.ffie.fr/fileadmin/DOCUMENTATION/PACTE_Equipe_de_France_Electrification.pdf",
        kind: "pdf",
      },
    ],
  },
  {
    id: 4,
    category: "Communication",
    title: "Take part in the SME AI Spring in Île-de-France",
    excerpt: "Test AI for your business...",
    body: [
      "Test AI for your business...",
      "FFIE invites you to take part in the SME AI Spring organized by OMNES Education in partnership with BFM Business and Onepoint: on June 16 from 10 AM to 4:30 PM, in Paris 15th.",
      "The opportunity to test AI tools suited to your business: in a single day, try out simple automations and leave with 2–3 immediately actionable use cases.",
      "Designed as reverse-mentoring workshops, led by students amplified by AI, it's also a chance to spot young talent ready to strengthen your teams (internships, work-study).",
      "These workshops will be led by students from the ECE, Sub de Pub and INSEEC schools.",
      [
        { text: "Limited places – reserve your spot now via this link " },
        {
          text: "AI tools & SMEs: What? Why? How?",
          link: true,
          url: "https://mibc-fr-05.mailinblack.com/securelink/?url=https://docs.google.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9mb3Jtcy9kL2UvMUZBSXBRTFNjTUlaejNDbzdaekRjRGZSOVA2TTJMa0ZwXzh2WjNtbmRfY3dNbWZBZVpTeFZhc1Evdmlld2Zvcm0iLCJ0b2tlbiI6ImdBQUFBQUJwLUdnVDBUblhKN2pPQl9JcmhPd0ZtZ21YdXJOSkl5TUMxSlpnQVVXNi03YXdfNzlyUGVDSGh3UWJPWHZ2NEkzRDFCY3M0RkxxSHF1eTRTZGUwd0xTRnBhUnA0U21DUTdzTElJXzRUNm5DX3hjRjllUU5FWVVwemhpWW1wQ3dnSEZxZmg1RUVsQ1l4aGxpX0lXWDFKY29waFhmX2tQN3diWkNlanJkaU1GWVM5WGxJSVhEdGU1Y2RqN3oxMFdqU0h1SkZ4b01RQUFmMnhNNWtMdVBkanhpUGtxTEZCOE9RYkVhSVlSc1ZuVUhPc2hCNF9jSnNnWGk5R1J4TU9jcVZHa2hpTUlFb04xR3BtazRIOU9jMmV2czFnc0dGNlpfVld0Q0ZWZkNjc3ZqVlJYdWVSQzRiYU03UW9iNk1zeV9tZlZPdnhSIn0=",
        },
      ],
    ],
    isoDate: "2026-05-29",
    date: "29.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl:
      "https://www.ffie.fr/fileadmin/user_upload/Printemps_IA_PME_IDF_-_16_juin_2026_WEB.jpg",
  },
  {
    id: 5,
    category: "Communication",
    title: "FFIE present at the Promotelec general assembly",
    excerpt: "FFIE engaged alongside Promotelec...",
    body: [
      "FFIE engaged alongside Promotelec...",
      "Represented by Jean-Claude Guillot and Philippe Rifaux, FFIE attended the Promotelec General Assembly held on May 27.",
      [
        {
          text: "This AGM is part of an unprecedented sector-wide momentum: the Plan for the Electrification of Uses, presented in April and for which FFIE put forward 8 proposals (",
        },
        {
          text: "download the electrification plan",
          link: true,
          url: "https://www.ffie.fr/les-documents-de-la-ffie/detail?tx_ffiedoc_document%5Baction%5D=show&tx_ffiedoc_document%5Bcontroller%5D=Document&tx_ffiedoc_document%5Bdocument%5D=1484&cHash=597a013aa0fd74421cbbc0d4543c3359",
        },
        { text: ")." },
      ],
      [
        {
          text: "In addition, and alongside Promotelec, FFIE is also engaged in promoting electricity and electrical safety (",
        },
        {
          text: "download the fact sheet on electrical safety",
          link: true,
          url: "https://www.ffie.fr/les-documents-de-la-ffie/detail?tx_ffiedoc_document%5Baction%5D=show&tx_ffiedoc_document%5Bcontroller%5D=Document&tx_ffiedoc_document%5Bdocument%5D=1471&cHash=3eea20b0f9b6af15a86243538583bd7e",
        },
        { text: ")." },
      ],
    ],
    isoDate: "2026-05-29",
    date: "29.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/ELECTRIFICATION_WEB.png",
    // The two FFIE documents referenced inline above, as attached documents.
    attachments: [
      {
        label: "Plan for the Electrification of Uses",
        url: "https://www.ffie.fr/les-documents-de-la-ffie/detail?tx_ffiedoc_document%5Baction%5D=show&tx_ffiedoc_document%5Bcontroller%5D=Document&tx_ffiedoc_document%5Bdocument%5D=1484&cHash=597a013aa0fd74421cbbc0d4543c3359",
        kind: "doc",
      },
      {
        label: "Fact sheet — electrical safety",
        url: "https://www.ffie.fr/les-documents-de-la-ffie/detail?tx_ffiedoc_document%5Baction%5D=show&tx_ffiedoc_document%5Bcontroller%5D=Document&tx_ffiedoc_document%5Bdocument%5D=1471&cHash=3eea20b0f9b6af15a86243538583bd7e",
        kind: "doc",
      },
    ],
  },
  {
    id: 6,
    category: "Economical",
    title: "FFIE economic survey",
    excerpt: "Take 5 minutes to answer the questionnaire!",
    body: [
      "Take 5 minutes to answer the questionnaire!",
      "We need you to feed FFIE's economic barometer, in place since January 2026.",
      "We are preparing the update of the data collected for Q2, and the survey of members is essential to capture market trends.",
      "Without your strong participation in this questionnaire, the barometer will not reflect the reality on the ground.",
      "We're counting on you!",
      "Respond via the link below",
      [
        {
          text: "FFIE 2026 MAJOR SURVEY Take part in the economic barometer! (2) – Fill out the form",
          link: true,
          url: "https://forms.office.com/e/zpy1zNx3HF",
        },
      ],
    ],
    isoDate: "2026-05-22",
    date: "22.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/BAROMETRE.web.jpg",
  },
  {
    id: 7,
    category: "Economical",
    title: "BT47 and copper indices: new trends",
    excerpt: "Tracking the indicators: BT 47 index and copper index",
    body: [
      "Tracking the indicators: BT 47 index and copper index",
      "The March BT 47 index has just been published in the Official Journal. It stands at 132.5, up 0.4 points from last month (132.1). Over the trailing 12 months, the rise is confirmed at +3.75%.",
      "The copper index confirms its stabilization after a very sharp rise in recent months. For the month of March, it stands at 190.4 and records a 2nd consecutive decline since February. However, over the trailing 12 months, it rises sharply by more than 20%.",
      "The trends of these 2 indices will be detailed in FFIE's economic barometer for Q2.",
      "Track the trend of the BT47 and copper indicators:",
      [
        {
          text: "https://www.insee.fr/fr/statistiques/serie/001710979",
          link: true,
          url: "https://www.insee.fr/fr/statistiques/serie/001710979",
        },
      ],
      [
        {
          text: "https://www.insee.fr/fr/statistiques/serie/010002094",
          link: true,
          url: "https://www.insee.fr/fr/statistiques/serie/010002094",
        },
      ],
    ],
    isoDate: "2026-05-22",
    date: "22.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/BT47_web.jpg",
  },
  {
    id: 8,
    category: "Communication",
    title: "Heading to Toulouse with FFIE!",
    excerpt: "Regional meeting, register now!",
    body: [
      "Regional meeting, register now!",
      "The next FFIE regional meeting will take place in Toulouse on June 4.",
      "On the program, starting at 9:30 AM:",
      "• Welcome by FFIE President Pascal Toggenburger and regional delegate Bertrand Desplats\n• Presentations by our partners Citel and Schneider Electric\n• Low-voltage systems in connected buildings by Adel Guediri, FFIE engineer\n• Presentations by our partners Milwaukee and Sonepar\n• FFIE news, services and tools.",
      "At the end of the morning, participants will gather for a lunch reception to continue the discussions.",
      "View the program:",
      [
        { text: "To register for this free morning session: " },
        {
          text: "FFIE OCCITANIE regional meeting – Fill out the form",
          link: true,
          url: "https://forms.office.com/e/M33WgFrPzK",
        },
      ],
    ],
    isoDate: "2026-05-22",
    date: "22.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/RR_OCCITANIE_WEB.jpg",
  },
  {
    id: 9,
    category: "Training",
    title: "Take part in the next Formapelec webinar!",
    excerpt: "Live low-voltage work (TST BT): the latest news!",
    body: [
      "Live low-voltage work (TST BT): the latest news!",
      "Formapelec invites you to take part in its webinar dedicated to the 2026 updates and the new TST BT training track",
      "Formapelec is holding its last webinar before summer on Tuesday, June 9 from 10:00 AM to 11:30 AM.",
      "On the program:",
      "✔ Updates to the training\n✔ The new TST BT training track\n✔ Discussions with our experts",
      [
        { text: "To register: " },
        {
          text: "WEBINAR on June 9 from 10:00 AM to 11:30 AM",
          link: true,
          url: "https://mibc-fr-05.mailinblack.com/securelink/?url=https://docs.google.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9mb3Jtcy9kL2UvMUZBSXBRTFNlQms0eGp5andjU0h5WklJWi0wWFJ1eEIyVUppYm9zZENWZlI1LXNudmstZmdkd1Evdmlld2Zvcm0_cGxpPTEiLCJ0b2tlbiI6ImdBQUFBQUJxREFlSmQwaGE5anJQWVVfYVBqbkFlUTFkbFRVRzZjbjhUbEx4b0R5cEhLd1pZU1I5WlNPY3Z3UVBSVjhMY3BmN1NRYUdadVJvWG9VZ0NBSU1PcF9sWk5VLUZ1bHRaeldCX3ZUXzNES204TTJKUDlXYnRPYklUcWYtWEhuQm54QVRZbVhTRlkyanNrWWNoOGZHU0JxaV9pb3p5OHByZzJMNmpLVEZvdllkNlV2MWxyN1pWMl9JMlYzS1ZBNm1ZSnhkNXdEdTVwVlhaVW9uV3VveC1lM2pDYnBuSlJzYkxqMVlyWXhQalZyWTVHWVZQNUhjaWVaMjQ3VmNaRTVxbDZIU1Y3WFo5dU90SnVtZG5lSGFwelpWcTZkZlpRTkdPdmFCVjVVUFl2LTlURDU1UmpidWxqcU5xVU5sT213Y0xQMlJqZ0EzIn0=",
        },
      ],
    ],
    isoDate: "2026-05-22",
    date: "22.05.2026",
    readMinutes: 3,
    memberOnly: false,
    imageUrl: "https://www.ffie.fr/fileadmin/user_upload/Nouveau_Cursus_TST_BT_WEB.png",
  },
];

// Feed order is strictly reverse-chronological — NEWS-01's "content is displayed
// chronologically". Sorting on isoDate (yyyy-mm-dd sorts lexicographically =
// chronologically) means the hero is always the most recent article, never a
// hand-picked entry. The sort is stable in Hermes/V8, so same-day articles keep
// their source order. Consumers (hero = ARTICLES[0], grid = slice(1), and the
// reader's prev/next neighbours) all inherit this order automatically.
export const ARTICLES: Article[] = [...ARTICLES_RAW].sort((a, b) =>
  b.isoDate.localeCompare(a.isoDate),
);

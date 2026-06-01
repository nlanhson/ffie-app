import type { ImageSourcePropType } from "react-native";

// Content for the Trades tab — "Discover the professions" (WBS Epic 4).
//
// Structured to mirror the CLIENT careers page
// (ffie.fr/les-metiers-de-lelectricite/metiers-et-formations): hero + intro,
// the 5 specialization domains (accordion), a hero illustration, two feature
// cards (7 reasons / the kit), and a "professions of tomorrow" training
// section (card grid).
//
// P6 — No login wall: everything here is public, readable, shareable.
//
// IMAGERY: all `seed`/illustration visuals are PLACEHOLDERS (random
// picsum.photos). Production MUST replace them with real FFIE assets — the
// branded hero illustration, real training photography, and partner logos.
// The `alt` text is the contract those real images have to meet (P7:
// representation — women, people of colour, a range of ages). Each item also
// takes an optional `imageUrl`, so dropping in a real asset is one line.

// The hero intro paragraph — the client page's own wording (translated), used
// verbatim so the screen matches their copy as well as their layout.
export const TRADE_INTRO =
  "Des métiers, des évolutions professionnelles, le travail en équipe, un secteur moderne et innovant, riche en rencontres, des savoir-faire toujours plus pointus — le secteur de l'électricité est aujourd'hui en plein essor !";

// The branded hero illustration that sits under the accordion on the client
// page (an isometric connected-building scene). Placeholder until FFIE supplies
// the real artwork.
export const ILLUSTRATION = {
  seed: "ffie-trades-illustration",
  imageUrl: undefined as string | undefined,
  alt: "Illustration isométrique d'un bâtiment connecté et électrifié — panneaux solaires, recharge de véhicules électriques, éclairage et liaisons réseau",
};

// The rich content shown in the full-screen DETAIL MODAL when a domain row is
// tapped (mirrors the client page's expanded view: hero photo, a definition,
// an accent call-to-action heading, body copy, and a key-terms box). Filled in
// per-domain as FFIE supplies the real copy; a domain without `detail` falls
// back to its blurb + tags in the modal.
export type DomainDetail = {
  // Hero photo at the top of the sheet. Prefer a bundled `source`
  // (`require("../../assets/x.jpg")`) for a real shipped asset; `imageUrl` for
  // a CMS URL; otherwise the seeded picsum PLACEHOLDER (see IMAGERY note above)
  // shows. `alt` is the contract the real image must meet.
  image: { source?: ImageSourcePropType; seed: string; imageUrl?: string; alt: string };
  // Lead paragraph — the plain-language definition that opens the sheet.
  intro: string;
  // The accent sub-heading ("Devenez acteur…") under the intro.
  heading: string;
  // Body paragraphs. `**term**` spans render bold for key vocabulary.
  body: string[];
  // The "Mots-clés" box at the foot of the sheet.
  keywords: { title: string; terms: string[] };
};

// The 5 specialization DOMAINS, named exactly as the client page lists them.
// Each row opens a detail modal (title + the `detail` content below); domains
// keep a short `blurb` + `tags` as the modal's fallback summary.
export type Domain = {
  id: string;
  title: string;
  blurb: string;
  /** A few concrete sub-areas, shown as small tags. */
  tags: string[];
  /** Rich modal content. Added per-domain as FFIE supplies the real copy. */
  detail?: DomainDetail;
};

export const DOMAINS: Domain[] = [
  {
    id: "energy",
    title: "Transition énergétique",
    blurb:
      "Panneaux solaires, bornes de recharge pour véhicules électriques, batteries et gestion intelligente de l'énergie — l'ensemble qui électrifie le chauffage, les transports et les logements.",
    tags: ["Solaire", "Recharge VE", "Stockage"],
    detail: {
      image: {
        source: require("../../assets/domain-energy.jpg"),
        seed: "ffie-domain-energy",
        imageUrl: undefined,
        alt: "Une main tenant une sphère végétale entourée d'icônes d'énergies renouvelables : solaire, éolien, recharge électrique, recyclage",
      },
      intro:
        "La rénovation énergétique regroupe l'ensemble des travaux d'un bâtiment qui visent à réduire la consommation d'énergie de ses habitants ou de ses usagers (locaux tertiaires).",
      heading: "Devenez acteur de la transition énergétique",
      body: [
        "Dans le domaine des énergies renouvelables et de la transition énergétique, l'électricien intégrateur installe les **panneaux solaires photovoltaïques** et propose des **solutions d'autoconsommation** grâce aux **batteries de stockage d'énergie**.",
        "Il conseille et accompagne ses clients pour **maîtriser leur consommation**, en déployant des **systèmes de pilotage et de gestion** de l'**éclairage, du chauffage et de la climatisation**.",
        "Il installe également les **bornes de recharge pour véhicules électriques**, chez les particuliers comme dans tous les espaces dédiés.",
      ],
      keywords: {
        title: "Mots-clés",
        terms: [
          "Photovoltaïque",
          "Stockage d'énergie",
          "Autoconsommation",
          "Recharge des véhicules électriques et hybrides rechargeables",
          "Éoliennes",
          "Hydroélectricité",
          "Hydrogène",
        ],
      },
    },
  },
  {
    id: "buildings",
    title: "Bâtiments connectés",
    blurb:
      "Des bâtiments intelligents : éclairage, chauffage, accès et confort qui réagissent d'eux-mêmes. Domotique et gestion technique du bâtiment.",
    tags: ["Domotique", "GTB", "IoT"],
    detail: {
      image: {
        source: require("../../assets/domain-buildings.jpg"),
        seed: "ffie-domain-buildings",
        imageUrl: undefined,
        alt: "Vue aérienne d'une ville moderne au crépuscule, parcourue de lignes lumineuses reliant les bâtiments — symbole du bâtiment connecté",
      },
      intro: "Grâce à l'électricité, le bâtiment devient intelligent.",
      heading: "L'électricité au cœur du bâtiment intelligent",
      body: [
        "On parle aussi de **gestion technique du bâtiment (GTB)** : un système informatique qui pilote et supervise les différents équipements électriques et mécaniques d'un bâtiment — température (chaud-froid), éclairage, alimentation électrique, systèmes de sécurité ou de protection incendie.",
        "L'électricien intervient dans l'intégration de ces équipements : il devient le **vecteur du bâtiment dit intelligent, connecté et piloté**.",
        "Grâce à sa formation, l'électricien peut devenir un véritable spécialiste de la GTB.",
      ],
      keywords: {
        title: "Mots-clés",
        terms: [
          "Smart Building",
          "Domotique",
          "Capteurs",
          "Maison connectée",
          "GTB",
          "IoT",
          "Bâtiment à énergie positive",
          "Gestion du bâtiment",
          "Intelligence artificielle",
          "Data",
          "Confort et sécurité",
          "Bâtiment intelligent",
          "Performance énergétique",
          "Maintenance prédictive",
        ],
      },
    },
  },
  {
    id: "networks",
    title: "Réseaux de communication",
    blurb:
      "Fibre, Wi-Fi et 5G — le câblage qui fait circuler les données dans un bâtiment. La colonne vertébrale de tout ce qui est connecté.",
    tags: ["Fibre", "5G", "Wi-Fi"],
    detail: {
      image: {
        source: require("../../assets/domain-networks.jpg"),
        seed: "ffie-domain-networks",
        imageUrl: undefined,
        alt: "Une main tenant un smartphone affichant une application de maison connectée, dans une cuisine entourée d'objets connectés",
      },
      intro:
        "Dans les années à venir, Internet, la télévision numérique, les réseaux d'objets connectés, ainsi que les nouveaux besoins et usages liés à l'évolution de la société et de l'habitat vont continuer à se développer considérablement, à la maison comme au bureau.",
      heading: "L'électricité et les réseaux de communication",
      body: [
        "L'électricien peut se spécialiser dans les **réseaux de communication** et se placer au cœur de la **communication**.",
        "Pilotage des objets à distance, réseaux sociaux, maintien du lien social, e-commerce, accès à la vidéo, au câble… Tous ces services circulent à l'intérieur des bâtiments grâce aux **réseaux de communication**, dont les performances n'ont cessé de progresser ces dernières années.",
        "Certaines formations d'électricien mènent directement à ces nouvelles compétences.",
      ],
      keywords: {
        title: "Mots-clés",
        terms: [
          "Fibre optique",
          "5G",
          "Connexion",
          "Câblage",
          "Technologies de l'information et de la communication (TIC)",
          "Radio et télévision",
          "Informatique",
          "Télécommunications",
          "Tableau de communication",
          "Réseau domestique",
          "Radiofréquences",
        ],
      },
    },
  },
  {
    id: "cyber",
    title: "Cybersécurité",
    blurb:
      "Protéger les bâtiments connectés et les réseaux contre les intrusions — un domaine du métier en forte croissance et très demandé.",
    tags: ["Réseaux", "Sécurité"],
    detail: {
      image: {
        source: require("../../assets/domain-cyber.jpg"),
        seed: "ffie-domain-cyber",
        imageUrl: undefined,
        alt: "Des mains tapant sur un clavier d'ordinateur, entourées d'icônes de cybersécurité : cadenas, données et protection",
      },
      intro:
        "L'évolution numérique des systèmes de sécurité électroniques — et en particulier le déploiement de solutions numériques et informatiques enrichies par l'intelligence artificielle — ouvre de nouveaux usages et de nouvelles missions pour les électriciens intégrateurs.",
      heading: "Cybersécurité",
      body: [
        "Grâce aux innovations du numérique, il est désormais possible d'**anticiper**, de **repenser** les scénarios de prévention et d'alerte, et de **redéployer rapidement** les mesures de sécurité nécessaires.",
        "Ces technologies de sécurité transforment l'espace urbain en **territoire intelligent**. C'est l'une des **voies d'avenir pour les électriciens** : se spécialiser dans ce domaine pour intégrer, maintenir, exploiter et sécuriser les risques liés aux **cybermenaces** et à la protection des **données personnelles**.",
      ],
      keywords: {
        title: "Mots-clés",
        terms: [
          "Cybermenaces",
          "Sécurité informatique",
          "Sécurité des réseaux",
          "Sécurité applicative",
          "Stockage des données",
          "Protection des données",
          "Cyberattaques",
        ],
      },
    },
  },
  {
    id: "automation",
    title: "Automatisation",
    blurb:
      "Automatisation industrielle et robotique — les systèmes qui pilotent les machines, les lignes de production et les procédés.",
    tags: ["Robotique", "Systèmes de commande"],
    detail: {
      image: {
        source: require("../../assets/domain-automation.jpg"),
        seed: "ffie-domain-automation",
        imageUrl: undefined,
        alt: "Un technicien tenant un ordinateur portable dans une salle de serveurs aux éclairages bleus",
      },
      intro:
        "L'automatisation industrielle est un secteur moderne et innovant, où les technologies électroniques, électrotechniques, mécaniques ou de communication sont conçues pour faire fonctionner des machines ou des procédés automatisés — des mécanismes capables de fonctionner sans intervention humaine.",
      heading: "L'électricité et l'automatisation",
      body: [
        "L'électricien peut se spécialiser dans ce domaine porteur et en devenir l'opérateur : celui qui **donne les instructions** et **programme le système**, et qui sait interpréter les **signaux** que les commandes lui renvoient.",
      ],
      keywords: {
        title: "Mots-clés",
        terms: [
          "Robotique",
          "Motorisation",
          "Systèmes électriques automatiques",
          "Électronique",
          "Électrotechnique",
          "Télécommunication",
          "Contrôle d'accès",
          "Vidéosurveillance",
          "Vidéoprotection",
          "Sûreté",
          "Automatisation industrielle",
          "Décarbonation",
          "Transition énergétique",
        ],
      },
    },
  },
];

const METIERS_PAGE = "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations";

// The two feature cards under the illustration (client: "7 Reasons…" and the
// "kit professions"). Each opens its source externally (P6 — no gate).
export type Feature = {
  id: string;
  title: string;
  blurb: string;
  url: string;
};

export const FEATURES: Feature[] = [
  {
    id: "reasons",
    title: "7 raisons de devenir électricien",
    blurb:
      "Intéressé par le métier d'intégrateur électricien, ou simplement intrigué ? Voici 7 bonnes raisons de se former ou de postuler.",
    url: METIERS_PAGE,
  },
  {
    id: "kit",
    title: "Découvrez les métiers de l'électricité",
    blurb:
      "Un « kit métiers de l'électricité » pour découvrir les métiers, les formations et les témoignages de jeunes apprentis et de chefs d'entreprise.",
    url: METIERS_PAGE,
  },
];

// The training section heading + intro, then the training cards.
export const TRAINING_HEADING = "Découvrez les formations aux métiers de demain !";
export const TRAINING_INTRO =
  "L'électricien est aujourd'hui un véritable intégrateur — un multi-technicien dont le travail est divers et varié. Il déploie des solutions pour les bâtiments connectés, les nouvelles mobilités, les énergies renouvelables et la performance énergétique, en alliant électricité et numérique. Ces métiers sont modernes, tournés vers l'avenir et accessibles à tous les niveaux de qualification, avec de réelles perspectives d'évolution.";

export type Training = {
  id: string;
  title: string;
  blurb: string;
  seed: string;
  imageUrl?: string;
  alt: string;
};

export const TRAININGS: Training[] = [
  {
    id: "cap",
    title: "CAP Électricien",
    blurb: "Ce diplôme mène directement à la vie active — avec un emploi à la clé.",
    seed: "ffie-train-cap",
    alt: "Un apprenti électricien câblant un tableau sur un établi, concentré",
  },
  {
    id: "bacpro",
    title: "Bac Pro MELEC",
    blurb: "Avec le Bac Pro MELEC, c'est l'emploi dès l'obtention du diplôme.",
    seed: "ffie-train-melec",
    alt: "Une jeune étudiante travaillant sur une platine de formation électrique",
  },
  {
    id: "bp",
    title: "BP Électricien",
    blurb: "Soyez opérationnel immédiatement.",
    seed: "ffie-train-bp",
    alt: "Un électricien installant un tableau électrique dans un logement",
  },
  {
    id: "sti2d",
    title: "Bac STI2D, option EE",
    blurb: "Passionné par l'innovation technologique ? Ce Bac est fait pour vous.",
    seed: "ffie-train-sti2d",
    alt: "Des élèves travaillant ensemble sur de l'électronique en classe",
  },
  {
    id: "bts",
    title: "BTS Électrotechnique",
    blurb: "Mettez vos compétences scientifiques et techniques à profit.",
    seed: "ffie-train-bts",
    alt: "Un technicien d'origine africaine testant un circuit avec un multimètre",
  },
  {
    id: "but",
    title: "BUT Génie Électrique",
    blurb: "Attiré par le monde du numérique ? Allez droit au but.",
    seed: "ffie-train-but",
    alt: "Un étudiant d'origine sud-asiatique programmant un système de commande",
  },
  {
    id: "domotique",
    title: "Licence Pro — Domotique",
    blurb: "Vous aimez piloter les objets à distance ? Cliquez ici.",
    seed: "ffie-train-domotique",
    alt: "Une femme utilisant une application de maison connectée pour piloter un bâtiment",
  },
  {
    id: "energy-licence",
    title: "Licence Pro — Électricité & énergie",
    blurb: "Vous avez une vision innovante de l'électricité ? Ce diplôme vous attend.",
    seed: "ffie-train-energy",
    alt: "Une femme ingénieure inspectant une installation solaire en toiture",
  },
];


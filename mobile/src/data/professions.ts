// Contenu de l'onglet Métiers — « Découvrir les métiers » (WBS Epic 4 /
// FFIE-TRADES-01). Une section PUBLIQUE, sans connexion (P6). Limitée STRICTEMENT
// aux critères d'acceptation du WBS :
//   1. il existe une section pour découvrir les carrières du secteur électrique ;
//   2. elle présente des FICHES MÉTIER  ← le cœur requis (ci-dessous) ;
//   3. elle PEUT AUSSI inclure du contenu pédagogique + des vidéos de présentation
//      ← les parcours de formation et les véritables films de témoignages FFIE ci-dessous.
//
// Volontairement NON inclus (au-delà du WBS / serait une donnée fabriquée du
// monde réel selon CLAUDE.md) : les chiffres de salaire, les témoignages nommés
// inventés. Les voix authentiques de praticiens proviennent à la place des
// propres vidéos de présentation de la FFIE.
//
// Les descriptions de poste sont une rédaction éditoriale FICTIVE portant sur de
// vrais métiers de l'électricité. L'imagerie est un ESPACE RÉSERVÉ — des photos
// du secteur électrique via des mots-clés LoremFlickr (l'assistant `tradeImage`
// ci-dessous), pour que les images de remplacement ressemblent au métier plutôt
// qu'à du stock aléatoire. La production les remplace par de vraies photos FFIE,
// et chaque `imageAlt` est le contrat que la vraie photo doit respecter
// (représentation P7 : femmes, personnes racisées, diversité d'âges et de
// contextes).

export type Profession = {
  id: string;
  /** L'intitulé du poste — la « fiche métier » exigée par le WBS. */
  role: string;
  /** Domaine de spécialisation, affiché sous forme de chip. */
  domain: string;
  /** Accroche d'une ligne. */
  tagline: string;
  /** Mots-clés d'espace réservé du secteur électrique (LoremFlickr) + un verrou
   *  stable pour que l'image ne change pas au rechargement. */
  imageKeywords: string;
  imageLock: number;
  imageAlt: string;
  /** Présentation du métier en 2 à 3 phrases. */
  summary: string;
  /** « Ce que tu ferais » — les activités concrètes du quotidien. */
  dayInLife: string[];
  /** Chips de compétences. */
  skills: string[];
  /** Comment s'y former (vraies qualifications françaises). */
  pathIn: string;
};

export const PROFESSIONS_INTRO =
  "L'électricité n'est pas un seul métier — c'est tout un secteur. Du câblage d'une maison à l'installation des bornes dont une ville dépend, voici les personnes qui font tourner tout ça, à quoi ressemblent vraiment leurs journées, et comment y arriver. Aucun compte nécessaire.";

// Le film qui ouvre la section (les « vidéos de présentation » du WBS ; une vraie
// vidéo FFIE — voir data/videos.ts).
export const HERO_VIDEO_ID = "4jQJT9gOluo";

// Imagerie d'espace réservé du secteur électrique. LoremFlickr renvoie une vraie
// photo Flickr correspondant aux mots-clés (pour que les espaces réservés
// ressemblent au métier, pas à du stock aléatoire) ; `lock` garde chaque image
// stable au fil des rechargements. ESPACE RÉSERVÉ uniquement — la production les
// remplace par de vraies photographies FFIE.
export const tradeImage = (keywords: string, lock: number, w = 640, h = 480) =>
  `https://loremflickr.com/${w}/${h}/${encodeURIComponent(keywords)}?lock=${lock}`;

// L'image hero au-dessus de la liste des métiers.
export const HERO_IMAGE_KEYWORDS = "electrician,electrical";
export const HERO_IMAGE_LOCK = 7;

export const PROFESSIONS: Profession[] = [
  {
    id: "building-electrician",
    role: "Électricien du bâtiment",
    domain: "Bâtiment & logement",
    tagline: "Apportez le courant et la lumière aux lieux où l'on vit et travaille.",
    imageKeywords: "electrician,wiring",
    imageLock: 11,
    imageAlt: "Une jeune électricienne posant un tableau électrique sur un chantier",
    summary:
      "Le métier que la plupart des gens imaginent — et le socle de tous les autres présentés ici. Vous menez un bâtiment de murs bruts à une installation fonctionnelle et certifiée, puis vous la remettez à celles et ceux qui en dépendront chaque jour.",
    dayInLife: [
      "Lire les plans et repérer l'emplacement des câbles, points et tableaux",
      "Tirer et raccorder les circuits — éclairage, prises, chauffage, tableau électrique",
      "Tester l'installation et la mettre en conformité avec la NF C 15-100",
      "Faire le tour de l'installation avec le client et valider la réception",
    ],
    skills: ["Câblage & circuits", "NF C 15-100", "Lecture de plans", "Sécurité électrique", "Réception client"],
    pathIn:
      "Un CAP Électricien (2 ans) vous met vite sur le chantier ; un Bac Pro MELEC (3 ans) ouvre plus tôt davantage de responsabilités.",
  },
  {
    id: "integrator",
    role: "Intégrateur électrique",
    domain: "Intégration de systèmes",
    tagline: "Reliez éclairage, chauffage, sécurité et réseaux en un seul système qui fonctionne tout simplement.",
    imageKeywords: "electrical,panel",
    imageLock: 12,
    imageAlt: "Un intégrateur configurant une armoire de gestion technique du bâtiment",
    summary:
      "Le métier emblématique des adhérents de la FFIE. Vous n'installez pas seulement — vous faites dialoguer les systèmes d'un bâtiment entre eux, pour qu'une seule règle ou un seul geste pilote ensemble la lumière, le climat, les accès et l'énergie.",
    dayInLife: [
      "Étudier les systèmes d'un bâtiment et définir comment ils doivent fonctionner comme un tout",
      "Concevoir l'intégration — les bus, automates et la logique en coulisses",
      "Coordonner avec les autres corps de métier sur le chantier",
      "Mettre en service, tester et affiner jusqu'à ce que le bâtiment se pilote seul",
    ],
    skills: ["Conception de systèmes", "KNX / domotique", "Coordination", "Mise en service", "Normes & sécurité"],
    pathIn:
      "Bac Pro MELEC puis BTS Électrotechnique est la voie classique — l'intégration récompense celles et ceux qui continuent d'apprendre.",
  },
  {
    id: "smart-building",
    role: "Technicien bâtiment intelligent",
    domain: "Bâtiments connectés",
    tagline: "Rendez les bâtiments intelligents — lumière, climat et sécurité qui réagissent d'eux-mêmes.",
    imageKeywords: "electrician,installation",
    imageLock: 13,
    imageAlt: "Un technicien programmant un automate de bâtiment intelligent depuis une tablette",
    summary:
      "Vous transformez des pièces ordinaires en espaces qui perçoivent et réagissent : des lumières qui suivent les personnes, un chauffage qui apprend la semaine, des alertes qui arrivent sur un téléphone. Mi-électricien, mi-programmeur.",
    dayInLife: [
      "Poser capteurs, automates et appareils connectés",
      "Programmer les scénarios — « absence », « soirée », « alarme »",
      "Relier le tout au réseau du bâtiment et au téléphone du propriétaire",
      "Tester chaque chemin et apprendre au client à s'en servir",
    ],
    skills: ["KNX / domotique", "Capteurs & actionneurs", "Logique de scénarios", "Réseaux", "Diagnostic de pannes"],
    pathIn:
      "Bac Pro MELEC avec un goût pour l'informatique, ou un BTS — la domotique, c'est là où l'électricité rencontre le code.",
  },
  {
    id: "ev-charging",
    role: "Installateur de bornes de recharge",
    domain: "Transition énergétique",
    tagline: "Bâtissez le réseau de recharge dont roulent les voitures électriques du pays.",
    imageKeywords: "electric,charging,station",
    imageLock: 14,
    imageAlt: "Un technicien installant une borne de recharge dans un parking",
    summary:
      "Chaque voiture électrique a besoin d'un endroit où se recharger — domiciles, parkings, autoroutes. Vous installez et raccordez les bornes, et vous vous assurez que la puissance du bâtiment peut réellement les supporter.",
    dayInLife: [
      "Évaluer la puissance d'un site et où les bornes peuvent être posées",
      "Installer les bornes de recharge et leur protection",
      "Mettre en place la gestion de charge pour que le raccordement au réseau tienne",
      "Tester, certifier et mettre en service chaque borne",
    ],
    skills: ["Qualification IRVE", "Gestion de charge", "Puissance & protection", "Tests", "Comptage d'énergie"],
    pathIn:
      "Commencez comme électricien, puis ajoutez la qualification IRVE — la demande dépasse le nombre de personnes formées.",
  },
  {
    id: "solar-pv",
    role: "Technicien photovoltaïque",
    domain: "Transition énergétique",
    tagline: "Transformez les toitures en centrales électriques.",
    imageKeywords: "solar,panel",
    imageLock: 15,
    imageAlt: "Une jeune femme installant des panneaux solaires sur un toit",
    summary:
      "Vous posez les panneaux, les câblez et les raccordez au bâtiment ou au réseau — pour qu'un toit qui ne faisait rien produise désormais une véritable énergie.",
    dayInLife: [
      "Dimensionner le champ de panneaux selon le toit et les besoins",
      "Monter les panneaux en sécurité et tirer le câblage continu (DC)",
      "Poser les onduleurs et la protection",
      "Raccorder au réseau et vérifier la production",
    ],
    skills: ["Dimensionnement PV", "Onduleurs", "Sécurité du travail en hauteur", "Raccordement réseau", "Comptage"],
    pathIn:
      "Un CAP ou un Bac Pro électrique plus une formation spécifique au PV — la transition énergétique est le secteur du métier qui croît le plus vite.",
  },
  {
    id: "networks",
    role: "Technicien réseaux & courants faibles",
    domain: "Réseaux de communication",
    tagline: "Câblez les données, la fibre et la sécurité dont dépend un site moderne.",
    imageKeywords: "cable,network",
    imageLock: 16,
    imageAlt: "Un technicien raccordant du câblage fibre optique dans une baie de brassage",
    summary:
      "Au-delà du courant, chaque bâtiment fonctionne grâce aux courants faibles — données, fibre, caméras, contrôle d'accès. Vous installez le système nerveux par lequel communique le reste du bâtiment.",
    dayInLife: [
      "Tirer le câblage structuré et les liaisons fibre",
      "Poser et raccorder caméras, contrôle d'accès et interphones",
      "Étiqueter, tester et certifier chaque liaison",
      "Documenter le réseau pour celles et ceux qui le maintiendront",
    ],
    skills: ["Câblage structuré", "Fibre optique", "Vidéosurveillance & contrôle d'accès", "Certification", "Documentation"],
    pathIn:
      "Bac Pro MELEC ou une spécialisation en courants faibles — les personnes précises et méthodiques s'y épanouissent.",
  },
];

// Contenu pédagogique optionnel (WBS AC #3 « peut aussi inclure ») : les voies
// d'accès. Toutes de vraies qualifications françaises (les mêmes que celles
// utilisées par les données métiers existantes).
export type TrainingPath = { id: string; label: string; level: string; note: string };

export const TRAINING_PATHS: TrainingPath[] = [
  { id: "cap", label: "CAP Électricien", level: "2 ans · dès 15 ans", note: "La voie la plus rapide vers le chantier." },
  { id: "bac", label: "Bac Pro MELEC", level: "3 ans", note: "La qualification de référence du métier." },
  { id: "bts", label: "BTS Électrotechnique", level: "+2 ans", note: "Vers la conception, l'encadrement et le chef d'équipe." },
  { id: "but", label: "BUT Génie Électrique", level: "+3 ans", note: "Des postes d'intégration en filière ingénierie." },
];

// Vidéos de présentation optionnelles (WBS AC #3) : de vrais témoignages de
// terrain FFIE — les mêmes identifiants YouTube et noms que ceux utilisés par la
// section Vidéos (voir data/videos.ts), pour que les voix soient authentiques et
// non inventées.
export type ProfessionVideo = { youtubeId: string; name: string; role: string };

export const PROFESSION_VIDEOS: ProfessionVideo[] = [
  { youtubeId: "zKP5j27P1Ng", name: "Florian Saliou", role: "Salarié de Calasys" },
  { youtubeId: "hyo0hi0OWbc", name: "Youssef Bendouche", role: "Apprenti CESI" },
  { youtubeId: "Hk0Ah__hoig", name: "Bamba Losseny", role: "Apprenti CFA Delépine" },
  { youtubeId: "D3bFUpwXo4U", name: "Travis Lombert", role: "Jeune salarié de Calasys" },
];

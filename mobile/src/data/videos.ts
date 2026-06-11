// Contenu de la section Vidéos de l'onglet Métiers — un clone de la page
// « Vidéos » de la FFIE (ffie.fr/les-metiers-de-lelectricite/videos) : une
// intro, quatre catégories de vidéos thématiques et la chaîne YouTube de la
// fédération.
//
// Chaque catégorie renvoie vers sa page vidéo FFIE, où jouent les films
// YouTube ; on l'ouvre dans le navigateur in-app natif (page sheet), comme les
// liens Partenaires. Les identifiants YouTube connus sont aussi enregistrés —
// ils servent d'amorce à un futur lecteur in-app natif (FFIE-VIDEO-01,
// sous-titres requis) sans avoir à re-scraper.
//
// Les IMAGES sont les vrais visuels de la page FFIE (URLs ffie.fr complètes).
// `alt` est le contrat que chaque image doit respecter ; le seed est un repli
// par défaut si une URL renvoie une 404.

// Un film au sein d'une catégorie. `title`/`description` proviennent de la page
// vidéo FFIE ; ils sont renseignés film par film à mesure qu'on construit
// l'écran de chaque catégorie. Un film sans ces champs joue quand même — il
// n'affiche simplement aucun texte de légende.
export type VideoItem = {
  youtubeId: string;
  title?: string;
  description?: string;
};

export type VideoCategory = {
  id: string;
  title: string;
  /** Vraie vignette FFIE (URL complète) ; repli sur le placeholder seedé. */
  imageUrl: string;
  seed: string;
  /** La page vidéo FFIE de ce thème (utilisée pour le Partage + comme repli). */
  url: string;
  /** Les films de cette catégorie, dans l'ordre de la page. */
  videos: VideoItem[];
  alt: string;
};

// L'URL de la vignette YouTube d'un film (hqdefault existe toujours pour un id valide).
export const youtubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const VIDEOS_INTRO =
  "Découvrez les métiers de l'électricité ! Les métiers de la filière en images ; consultez aussi notre chaîne YouTube pour tout voir.";

export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/channel/UCtGdYMwterw35bjXRXm2zXw";

const VIDEO_BASE = "https://www.ffie.fr/les-metiers-de-lelectricite/videos";
const IMG_BASE = "https://www.ffie.fr/fileadmin/user_upload";

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: "ai",
    title: "L'intelligence artificielle",
    imageUrl: `${IMG_BASE}/csm_Ai2310_c9c4d19e56.png`,
    seed: "ffie-video-ai",
    url: `${VIDEO_BASE}/lintelligence-artificielle`,
    alt: "Visuel abstrait évoquant l'intelligence artificielle dans le domaine électrique",
    videos: [
      {
        youtubeId: "4jQJT9gOluo",
        title: "L'intelligence artificielle au service des professionnels de l'électricité",
        description:
          "Un motion design réalisé pour les Rencontres FFIE 2020 : une introduction à l'IA pour souligner l'importance de sa présence au quotidien et l'évolution inévitable des métiers de la filière électrique.",
      },
    ],
  },
  {
    id: "smart-city",
    title: "La smart city",
    imageUrl: `${IMG_BASE}/AdobeStock_181088041.jpeg`,
    seed: "ffie-video-smartcity",
    url: `${VIDEO_BASE}/la-smart-city`,
    alt: "Vue d'une ville connectée la nuit, traversée de lignes lumineuses",
    videos: [
      {
        youtubeId: "0AD84IGyGaM",
        title: "La Smart City, une réalité à la portée des installateurs électriciens.",
      },
    ],
  },
  {
    id: "poe",
    title: "Le PoE (Power over Ethernet)",
    imageUrl: `${IMG_BASE}/AdobeStock_73920809.jpeg`,
    seed: "ffie-video-poe",
    url: `${VIDEO_BASE}/poe-power-over-ethernet`,
    alt: "Câbles et connecteurs réseau Ethernet alimentant des équipements",
    videos: [
      {
        youtubeId: "cU5UACxCd5o",
        title: "Le Power over Ethernet, et s'il changeait votre quotidien ?",
      },
    ],
  },
  {
    id: "temoignages",
    title: "Témoignages",
    imageUrl: `${IMG_BASE}/AdobeStock_372453660_Preview.jpeg`,
    seed: "ffie-video-temoignages",
    url: `${VIDEO_BASE}/les-temoignages`,
    alt: "Portraits de professionnels de l'électricité partageant leur parcours",
    videos: [
      { youtubeId: "zKP5j27P1Ng", title: "Témoignage salarié Calasys — Florian Saliou" },
      { youtubeId: "hyo0hi0OWbc", title: "Témoignage apprenti CESI — Youssef Bendouche" },
      { youtubeId: "Hk0Ah__hoig", title: "Témoignage apprenti CFA Delépine — Bamba Losseny" },
      { youtubeId: "kaURqyLrpno", title: "Témoignage chef d'entreprise — Pascal Texereau" },
      { youtubeId: "D3bFUpwXo4U", title: "Témoignage jeune salarié Calasys — Travis Lombert" },
      { youtubeId: "R63mJWdWAv0", title: "Témoignage apprentie CESI — Naurine Crevel" },
      { youtubeId: "LSCm4FSDPk0", title: "Témoignage chef d'entreprise — Alexis Delepoulle" },
      {
        youtubeId: "u3vNh911ExM",
        title:
          "Micro-trottoir : que pensent les élèves de leur avenir dans les métiers de l'électricité ?",
      },
    ],
  },
];

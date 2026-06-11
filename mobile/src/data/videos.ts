// Content for the Videos segment of the Trades tab — a clone of the FFIE
// "Videos" page (ffie.fr/les-metiers-de-lelectricite/videos): an intro, four
// themed video categories, and the federation's YouTube channel.
//
// Each category links to its FFIE video page, where the YouTube films play; we
// open it in the native in-app browser (page sheet), like the Partners links.
// The known YouTube IDs are recorded too — they're the hook for a future
// native in-app player (FFIE-VIDEO-01, captions required) without re-scraping.
//
// IMAGES are FFIE's real page assets (full ffie.fr URLs). `alt` is the contract
// each image must meet; the seed is a placeholder fallback if a URL 404s.

// One film within a category. `title`/`description` come from the FFIE video
// page; they're filled in per-film as we build each category's screen. A film
// without them still plays — it just shows no caption text.
export type VideoItem = {
  youtubeId: string;
  title?: string;
  description?: string;
};

export type VideoCategory = {
  id: string;
  title: string;
  /** Real FFIE thumbnail (full URL); falls back to the seeded placeholder. */
  imageUrl: string;
  seed: string;
  /** The FFIE video page for this theme (used for Share + as a fallback). */
  url: string;
  /** The films in this category, in page order. */
  videos: VideoItem[];
  alt: string;
};

// A film's YouTube thumbnail URL (hqdefault always exists for a valid id).
export const youtubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const VIDEOS_INTRO =
  "Discover the electrical trades! The trades of the sector in pictures; check out our YouTube channel too to see everything.";

export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/channel/UCtGdYMwterw35bjXRXm2zXw";

const VIDEO_BASE = "https://www.ffie.fr/les-metiers-de-lelectricite/videos";
const IMG_BASE = "https://www.ffie.fr/fileadmin/user_upload";

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: "ai",
    title: "Artificial intelligence",
    imageUrl: `${IMG_BASE}/csm_Ai2310_c9c4d19e56.png`,
    seed: "ffie-video-ai",
    url: `${VIDEO_BASE}/lintelligence-artificielle`,
    alt: "Abstract visual evoking artificial intelligence in the electrical field",
    videos: [
      {
        youtubeId: "4jQJT9gOluo",
        title: "Artificial intelligence serving electrical professionals",
        description:
          "A motion design produced for the FFIE 2020 Meetings: an introduction to AI to signal the importance of its everyday presence and the inevitable evolution of the trades in the electrical sector.",
      },
    ],
  },
  {
    id: "smart-city",
    title: "The smart city",
    imageUrl: `${IMG_BASE}/AdobeStock_181088041.jpeg`,
    seed: "ffie-video-smartcity",
    url: `${VIDEO_BASE}/la-smart-city`,
    alt: "View of a connected city at night, crossed by glowing lines",
    videos: [
      {
        youtubeId: "0AD84IGyGaM",
        title: "The Smart City, a reality within reach of electrical installers.",
      },
    ],
  },
  {
    id: "poe",
    title: "Le PoE (Power over Ethernet)",
    imageUrl: `${IMG_BASE}/AdobeStock_73920809.jpeg`,
    seed: "ffie-video-poe",
    url: `${VIDEO_BASE}/poe-power-over-ethernet`,
    alt: "Ethernet network cables and connectors powering equipment",
    videos: [
      {
        youtubeId: "cU5UACxCd5o",
        title: "Power over Ethernet, what if it changed your everyday work?",
      },
    ],
  },
  {
    id: "temoignages",
    title: "Testimonials",
    imageUrl: `${IMG_BASE}/AdobeStock_372453660_Preview.jpeg`,
    seed: "ffie-video-temoignages",
    url: `${VIDEO_BASE}/les-temoignages`,
    alt: "Portraits of electrical professionals sharing their career paths",
    videos: [
      { youtubeId: "zKP5j27P1Ng", title: "Calasys employee testimonial — Florian Saliou" },
      { youtubeId: "hyo0hi0OWbc", title: "CESI apprentice testimonial — Youssef Bendouche" },
      { youtubeId: "Hk0Ah__hoig", title: "CFA Delépine apprentice testimonial — Bamba Losseny" },
      { youtubeId: "kaURqyLrpno", title: "Company owner testimonial — Pascal Texereau" },
      { youtubeId: "D3bFUpwXo4U", title: "Young Calasys employee testimonial — Travis Lombert" },
      { youtubeId: "R63mJWdWAv0", title: "CESI apprentice testimonial — Naurine Crevel" },
      { youtubeId: "LSCm4FSDPk0", title: "Company owner testimonial — Alexis Delepoulle" },
      {
        youtubeId: "u3vNh911ExM",
        title:
          "Vox pop: what do students think about their future in the electrical trades?",
      },
    ],
  },
];

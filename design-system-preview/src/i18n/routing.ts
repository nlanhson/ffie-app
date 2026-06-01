import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"] as const,
  defaultLocale: "fr",
  // FFIE is a French federation — French is the canonical URL (no prefix).
  // English is opt-in via /en/... so the site reads "French-first" to Julien.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

// Tokens des écrans du parcours d'authentification.
// Valeurs de spécification pour l'écran de connexion adhérent (LoginScreen),
// indexées sur les primitives canoniques `@tokens` afin que tout futur
// changement d'échelle se propage. (Les anciens écrans Splash / E-mail / OTP
// ont été remplacés par le LoginScreen à mot de passe et supprimés, avec leurs
// tokens.)

import { primitives } from "@tokens";
import { HEADER_SURFACE } from "@/theme/brandHeader";

const { radii, colors } = primitives;

export const auth = {
  // Écran de connexion adhérent (LoginScreen) — un BANDEAU TEAL + UNE FEUILLE
  // BLANCHE, en cohérence avec l'en-tête de l'accueil (HEADER_SURFACE =
  // teal[700] #027489 — l'unique teal de marque, même teinte que le CTA plus
  // bas). Le texte d'affichage blanc y respecte AA (~5.4:1) ; on garde tout de
  // même le petit texte hors du teal — comme l'en-tête — pour que le bandeau ne
  // porte que du grand texte d'affichage blanc + une pastille de logo blanche,
  // et tout le formulaire repose sur une feuille blanche où tout respecte WCAG
  // AA (texte navy foncé, CTA teal[700], bordures de champ navy[400] ≈6:1).
  login: {
    bg: HEADER_SURFACE,                 // teal[700] #027489 — bandeau (aligné sur l'en-tête)
    sheet: colors.white,                // feuille du formulaire — tout le petit texte repose dessus
    title: colors.white,                // « Bienvenue » — grand sur teal (≈5.4:1, AA)
    subtitle: colors.white,             // sous-titre du bandeau — assez grand sur teal
    headerLabel: colors.white,          // logotype « FFIE » en haut + chevron de retour
    radius: radii.lg,                   // 12 — champs, boutons, pilule du pied de page

    field: {
      height: 56,
      bg: colors.white,                 // le champ blanc se lit sur le teal
      border: colors.brand.navy[400],   // #4F5C95 — limite ≈3:1+ (1.4.11)
      borderFocus: colors.brand.teal[700], // #027489 — visible sur blanc + teal
      text: colors.brand.navy[900],     // ≈16:1 sur blanc (AAA)
      placeholder: colors.brand.navy[400], // #4F5C95 — ≈6.4:1 sur blanc (AA)
    },

    // CTA principal « Se connecter » — teal[700], le même teal de marque FFIE que
    // l'action principale par défaut de l'app (≈5.45:1 blanc-sur-teal, respecte
    // WCAG AA). Pressé → teal[800].
    cta: {
      height: 56,
      bg: colors.brand.teal[700],         // #027489
      bgPressed: colors.brand.teal[800],  // #045764
      bgDisabled: "rgba(18,24,53,0.12)",  // navy @ 12% (désactivé = exempté de contraste)
      fg: colors.white,
      fgDisabled: colors.brand.navy[500],
    },

    // « Connexion SSO fédération » — bouton blanc à contour.
    sso: {
      bg: colors.white,
      bgPressed: colors.gray[100],        // #EEF0F4
      border: colors.brand.navy[400],     // limite ≈3:1+
      fg: colors.brand.navy[800],         // #1A2349 — fort contraste sur blanc
    },

    divider: colors.brand.navy[400],      // #4F5C95 — filet « ou », ≈5:1 (≥3:1)
    link: colors.brand.navy[700],         // #222D5D — Mot de passe oublié / Aide (≈10:1)
    accent: colors.brand.teal[700],       // #027489 — « Adhérer » (≈5.45:1 sur blanc)

    // Note du bas + barre « Pas encore adhérent ? » — pilule blanche sur la page teal.
    footer: {
      bg: colors.white,
      border: colors.brand.navy[400],     // #4F5C95 — limite ≈5:1 sur teal (1.4.11)
      noteText: colors.brand.navy[700],   // #222D5D — ≈10:1 sur teal
      markBg: colors.white,               // le logo FFB repose déjà sur du blanc
    },
  },
} as const;

export type AuthTokens = typeof auth;

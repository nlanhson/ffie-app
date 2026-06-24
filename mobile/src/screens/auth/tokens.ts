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
  // Écran de connexion adhérent (LoginScreen) — un BANDEAU NAVY + UNE FEUILLE
  // BLANCHE, en cohérence avec l'en-tête de l'accueil (HEADER_SURFACE =
  // navy[700] #222D5D — l'unique navy de marque, même teinte que le CTA plus
  // bas). Le texte d'affichage blanc y respecte AAA (~11:1) ; on garde tout de
  // même le petit texte hors du navy — comme l'en-tête — pour que le bandeau ne
  // porte que du grand texte d'affichage blanc + une pastille de logo blanche,
  // et tout le formulaire repose sur une feuille blanche où tout respecte WCAG
  // AA (texte navy foncé, CTA navy[700], bordures de champ navy[400] ≈6:1).
  login: {
    bg: HEADER_SURFACE,                 // navy[700] #222D5D — bandeau (aligné sur l'en-tête)
    sheet: colors.white,                // feuille du formulaire — tout le petit texte repose dessus
    title: colors.white,                // « Bienvenue » — grand sur navy (≈11:1, AAA)
    subtitle: colors.white,             // sous-titre du bandeau — assez grand sur navy
    headerLabel: colors.white,          // logotype « FFIE » en haut + chevron de retour
    radius: radii.lg,                   // 12 — champs, boutons, pilule du pied de page

    field: {
      height: 56,
      bg: colors.white,                 // le champ blanc se lit sur le navy
      border: colors.brand.navy[400],   // #4F5C95 — limite ≈3:1+ (1.4.11)
      borderFocus: colors.brand.navy[700], // #222D5D — visible sur le champ blanc
      text: colors.brand.navy[900],     // ≈16:1 sur blanc (AAA)
      placeholder: colors.brand.navy[400], // #4F5C95 — ≈6.4:1 sur blanc (AA)
    },

    // CTA principal « Se connecter » — navy[700], le même navy de marque FFIE que
    // l'action principale par défaut de l'app (≈11:1 blanc-sur-navy, respecte
    // WCAG AAA). Pressé → navy[800].
    cta: {
      height: 56,
      bg: colors.brand.navy[700],         // #222D5D
      bgPressed: colors.brand.navy[800],  // #1A2349
      bgDisabled: "rgba(18,24,53,0.12)",  // navy @ 12% (désactivé = exempté de contraste)
      fg: colors.white,
      fgDisabled: colors.brand.navy[500],
    },

    link: colors.brand.navy[700],         // #222D5D — Mot de passe oublié / Aide (≈10:1)
    accent: colors.brand.navy[700],       // #222D5D — « Adhérer » (≈11:1 sur blanc)

    // Barre « Pas encore adhérent ? » — pilule blanche sur la page navy.
    footer: {
      bg: colors.white,
      border: colors.brand.navy[400],     // #4F5C95 — limite ≈5:1 sur navy (1.4.11)
      noteText: colors.brand.navy[700],   // #222D5D — ≈10:1 sur navy
    },
  },
} as const;

export type AuthTokens = typeof auth;

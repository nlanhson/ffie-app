// La « surface d'en-tête » de marque FFIE — la couleur de marque profonde qui se
// place derrière le bloc-marque sur le héros de l'Accueil, la barre AppHeader
// persistante et le héros d'identité du Profil (ainsi que leurs cales de
// surdéfilement et leurs squelettes de chargement).
//
// Définie UNE SEULE fois ici pour que chaque surface alignée sur l'en-tête reste
// synchronisée : changer la couleur d'en-tête de marque est une modification
// d'une ligne. Du texte/des icônes blancs reposent dessus, donc la teinte
// choisie doit les garder lisibles (grand texte / icônes ≥ 3:1).

import { primitives } from "@tokens";

/**
 * Fond de l'en-tête de marque — sarcelle opérationnel FFIE au [700] (#027489).
 *
 * UN SEUL sarcelle pour tout le système interactif : c'est la MÊME valeur que
 * `action.primary.bg` et `brand.accent` du thème clair, si bien que l'en-tête,
 * les boutons principaux, les bascules segmentées et les contrôles de filtre se
 * lisent tous comme un unique sarcelle de marque plutôt que comme deux teintes
 * presque identiques. C'était teal[600] (#0094A9) — une teinte plus claire —
 * mais celui-ci n'atteint que ~3,6:1 sur blanc (AA-grand uniquement) ; le [700]
 * atteint ~5,4:1, donc le texte/les icônes blancs de l'en-tête passent le AA à
 * toute taille.
 */
export const HEADER_SURFACE = primitives.colors.brand.teal[700]; // #027489

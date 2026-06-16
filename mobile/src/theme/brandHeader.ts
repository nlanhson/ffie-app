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
 * Fond de l'en-tête de marque — navy institutionnel FFIE au [700] (#222D5D, le
 * bloc du logo).
 *
 * UN SEUL navy pour tout le système interactif : c'est la MÊME valeur que
 * `action.primary.bg` et `brand.accent` du thème clair, si bien que l'en-tête,
 * les boutons principaux, les bascules segmentées et les contrôles de filtre se
 * lisent tous comme un unique navy de marque plutôt que comme deux teintes
 * presque identiques. Le navy[700] atteint ~11:1 sur blanc, donc le texte/les
 * icônes blancs de l'en-tête passent le AAA à toute taille.
 */
export const HEADER_SURFACE = primitives.colors.brand.navy[700]; // #222D5D

// The FFIE brand "header surface" — the deep brand color that sits behind the
// logo lockup on the Home hero, the persistent AppHeader bar, and the Profile
// identity hero (plus their overscroll backstops and loading skeletons).
//
// Defined ONCE here so every header-matched surface stays in lockstep: changing
// the brand header color is a one-line edit. White text/icons sit on top, so
// the chosen shade must keep them legible (large text / icons ≥ 3:1).

import { primitives } from "@tokens";

/** Brand header background — ffie.fr primary teal. */
export const HEADER_SURFACE = primitives.colors.brand.teal[600]; // #0094A9

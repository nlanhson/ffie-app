// HomeHeader — l'en-tête « héros » marine en haut de l'onglet Accueil.
//
// Une surface de marque bleu marine profond qui remonte derrière la barre
// d'état et porte :
//   - le bloc-marque FFIE à gauche — la pastille du logo et un message d'accueil
//     à côté (« Bienvenue » pour les adhérents, « Bienvenue à la FFIE » pour les
//     invités)
//   - les actions en haut à droite (notifications + profil) sous forme de simples
//     boutons icône
//   - un bloc d'accueil + identité :
//       · adhérent → « Bonjour, » + nom + une pastille « Adhérent actif · N° ____ »,
//         tout le bloc étant cliquable pour ouvrir le Profil
//       · invité   → le message d'accueil se place à côté du logo (ci-dessus), si
//         bien que le bloc en dessous n'est que le sous-titre + une pastille
//         « Adhérer à la FFIE »
//
// C'est une surface de marque fixe, pas une surface de thème : le fond est
// toujours le marine institutionnel FFIE (brand.navy[700]) avec des couleurs de
// premier plan blanc / sarcelle, de la même façon que FFIELogo traite les
// couleurs de marque comme des constantes. Seul le contenu de la page *sous*
// l'en-tête suit le thème actif.
//
// Statique par choix — aucune animation d'entrée. La bascule squelette→contenu
// de l'onglet (TabSkeletonGate) couvre déjà la transition de chargement : animer
// l'en-tête à chaque visite de l'Accueil serait du mouvement gratuit (voir
// emil-design-eng : quand *ne pas* animer).

import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckCircle2,
  User,
  UserPlus,
  type LucideIcon,
} from "lucide-react-native";
import { primitives, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import { type MemberProfile } from "@/data/member";

// --- couleurs de surface de marque fixes (héros sarcelle) -----------------
const WHITE = primitives.colors.white;
// Pastille de statut / adhésion : une pastille claire OPAQUE avec un texte
// sarcelle foncé. Une pastille blanche avec un texte teal[800] atteint ~7:1
// (AAA) — une emphase plus forte que blanc-sur-sarcelle, et qui reste robuste
// quelle que soit la dérive du sarcelle de l'en-tête. (L'étiquette de 13 px est
// le cas contraignant : le petit texte exige 4,5:1, donc c'est la pastille qui
// le porte, pas le sarcelle.)
const PILL_BG = WHITE;
const PILL_TEXT = primitives.colors.brand.teal[800]; // #045764 — AAA sur blanc
const PILL_ICON = primitives.colors.brand.teal[700]; // #027489 — lisible sur blanc

// Voiles translucides dérivés des couleurs de token (les tokens n'ont pas de
// variantes alpha ; cela garde les valeurs source pilotées par les tokens plutôt
// que littérales).
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const HELLO = withAlpha(WHITE, 0.82); // message d'accueil / sous-titre atténué sur le héros sarcelle
const PRESS_BG = withAlpha(WHITE, 0.12); // teinte du bouton icône à l'appui
const CIRCLE_BG = withAlpha(WHITE, 0.2); // fond au repos derrière le glyphe de profil — ancre le bord droit à la marge (reflet de la pastille blanche du logo à gauche)

// Écart sous le bord supérieur de la zone sûre avant la rangée de marque. Gardé
// identique au TOP_GAP de AppHeader pour que le logo soit à la même position
// verticale sur chaque page — passer de l'Accueil aux autres onglets ne doit pas
// décaler le bloc-marque.
const TOP_GAP = Platform.OS === "android" ? 14 : 12;

// Héros invité : de l'air ajouté des DEUX côtés du sous-titre (sous la rangée de
// marque, et au-dessus du CTA) en plus du débord mesuré de la pastille — pour
// que le sous-titre dégage le logo au lieu de le coller, tout en restant centré.
const GUEST_GAP = 8;

// Taille du glyphe du logo dans la pastille blanche. Agrandie depuis les 20
// d'origine pour que la marque soit nettement lisible sur le héros marine
// (s'applique aux variantes adhérent et invité).
const LOGO_SIZE = 42;

export type HomeHeaderProps = {
  themeName?: ThemeName;
  /** « member » affiche l'identité + la pastille adhérent ; « guest » affiche un CTA d'adhésion. */
  variant: "member" | "guest";
  /** Requis pour la variante adhérent. */
  member?: MemberProfile;
  /** Affiche le point rouge sur la cloche (variante adhérent uniquement). */
  hasUnread?: boolean;
  /** Adhérent : ouvrir les notifications. Omettre pour masquer la cloche. */
  onPressNotifications?: () => void;
  /** Ouvrir la recherche. Omettre pour masquer le bouton de recherche. */
  onPressSearch?: () => void;
  /** Adhérent : toucher le bloc d'identité → ouvrir le Profil. */
  onPressIdentity?: () => void;
  /** Invité : toucher la pastille « Adhérer à la FFIE ». */
  onPressJoin?: () => void;
};

// Un simple bouton icône de barre supérieure (glyphe blanc sur la surface de
// marque). hitSlop élargit le disque visible de 40 pt à une cible accessible de
// ≥ 44 pt.
function IconButton({
  icon: Icon,
  label,
  hint,
  onPress,
  filled = false,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  onPress?: () => void;
  /** Affiche un cercle translucide au repos derrière le glyphe (action profil). */
  filled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconBtn,
        filled ? styles.iconBtnFilled : null,
        pressed && onPress ? { backgroundColor: PRESS_BG } : null,
      ]}
    >
      <Icon size={22} color={WHITE} strokeWidth={2} />
    </Pressable>
  );
}

export function HomeHeader({
  themeName = "light",
  variant,
  member,
  hasUnread = false,
  onPressNotifications,
  onPressSearch,
  onPressIdentity,
  onPressJoin,
}: HomeHeaderProps) {
  void themeName; // le héros marine ignore le thème ; prop conservée par symétrie d'API
  const insets = useSafeAreaInsets();
  const isMember = variant === "member" && member != null;

  // La pastille du logo est plus haute que le texte d'accueil à côté, si bien que
  // la rangée de marque dépasse d'environ une demi-pastille sous la ligne de base
  // du texte. On mesure ce débord et on l'injecte dans la marge haute du CTA
  // invité, pour que le sous-titre se retrouve visuellement centré entre la
  // rangée de marque et le bouton « Adhérer à la FFIE » (écarts égaux). Mesurer
  // vaut mieux que coder en dur car les hauteurs pastille/texte dépendent de la
  // police et de la plateforme. Valeur par défaut raisonnable jusqu'à la première
  // passe de mise en page.
  const [chipOverhang, setChipOverhang] = React.useState(10);
  const brandH = React.useRef(0);
  const greetingH = React.useRef(0);
  const measureOverhang = React.useCallback(() => {
    if (brandH.current > 0 && greetingH.current > 0) {
      setChipOverhang(Math.max(0, Math.round((brandH.current - greetingH.current) / 2)));
    }
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + TOP_GAP }]}>
      {/* Bloc-marque + actions en haut à droite */}
      <View style={styles.topRow}>
        <View
          style={styles.brand}
          onLayout={(e) => {
            brandH.current = e.nativeEvent.layout.height;
            measureOverhang();
          }}
          // Adhérent : une seule étiquette « FFIE » couvre le bloc logo +
          // logotype. Invité : le logo et le message « Bienvenue » sont
          // étiquetés séparément.
          accessible={isMember}
          accessibilityRole={isMember ? "image" : undefined}
          accessibilityLabel={isMember ? "FFIE" : undefined}
        >
          <View
            style={styles.logoChip}
            accessible={!isMember}
            accessibilityRole={!isMember ? "image" : undefined}
            accessibilityLabel={!isMember ? "FFIE" : undefined}
          >
            <FFIELogo size={LOGO_SIZE} themeName="light" />
          </View>
          {isMember ? (
            // Adhérent : un bref « Bienvenue » à côté du logo (remplaçant le
            // logotype FFIE), au-dessus de la ligne personnelle « Bonjour, {nom} ».
            // Le bloc-marque est déjà étiqueté « FFIE », donc ce n'est pas
            // ré-annoncé.
            <Text
              style={styles.brandGreeting}
              numberOfLines={1}
              onLayout={(e) => {
                greetingH.current = e.nativeEvent.layout.height;
                measureOverhang();
              }}
            >
              Bienvenue
            </Text>
          ) : (
            // Invité : le message d'accueil remonte à côté du logo (remplaçant le
            // logotype) ; le bloc en dessous porte le sous-titre + le CTA
            // d'adhésion.
            <Text
              style={styles.brandGreeting}
              accessibilityRole="header"
              numberOfLines={1}
              onLayout={(e) => {
                greetingH.current = e.nativeEvent.layout.height;
                measureOverhang();
              }}
            >
              Bienvenue à la FFIE
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          {/* Profil : ouvre le profil de l'adhérent (même destination que le bloc
              d'identité cliquable ci-dessous), à l'image de l'action profil de
              AppHeader. */}
          {isMember && onPressIdentity ? (
            <IconButton
              icon={User}
              label="Mon profil"
              hint="Ouvre votre profil et vos réglages"
              onPress={onPressIdentity}
              filled
            />
          ) : null}
        </View>
      </View>

      {/* Identité / message d'accueil */}
      {isMember ? (
        <Pressable
          onPress={onPressIdentity}
          disabled={!onPressIdentity}
          accessibilityRole={onPressIdentity ? "button" : undefined}
          accessibilityLabel={`${member.fullName}, ${member.statusLabel}, numéro ${member.memberNo}`}
          accessibilityHint={onPressIdentity ? "Ouvre votre profil" : undefined}
          style={({ pressed }) => [
            styles.identity,
            pressed && onPressIdentity ? { opacity: 0.85 } : null,
          ]}
        >
          <Text style={styles.hello}>Bonjour,</Text>
          <Text style={styles.name} numberOfLines={1}>
            {member.fullName}
          </Text>
          <View style={styles.pill}>
            <CheckCircle2 size={14} color={PILL_ICON} />
            <Text style={styles.pillText} numberOfLines={1}>
              {member.statusLabel} · N° {member.memberNo}
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={[styles.identity, styles.identityGuest]}>
          <Text style={styles.subtitle}>
            Explorez les actualités, les ressources et les avantages adhérents.
          </Text>
          {onPressJoin ? (
            <Pressable
              onPress={onPressJoin}
              accessibilityRole="button"
              accessibilityLabel="Adhérer à la FFIE"
              accessibilityHint="Ouvre les informations d'adhésion"
              style={({ pressed }) => [
                styles.pill,
                // Écart bas = débord de la pastille + le même décalage d'air
                // appliqué au-dessus du sous-titre (identityGuest). Ainsi le
                // sous-titre est visuellement centré entre la ligne « Bienvenue »
                // et ce CTA, tout en dégageant la pastille du logo plutôt que de
                // la coller.
                { marginTop: chipOverhang + GUEST_GAP },
                pressed ? { opacity: 0.85 } : null,
              ]}
            >
              <UserPlus size={14} color={PILL_ICON} />
              <Text style={styles.pillText}>Adhérer à la FFIE</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: HEADER_SURFACE,
    paddingHorizontal: GUTTER,
    // Marge basse ajustée pour que la surface de marque *visible* sous la
    // pastille d'identité corresponde à la marge basse de 16 px de AppHeader sur
    // toutes les autres pages. La feuille du tableau de bord la recouvre de
    // SHEET.lift (12), donc 28 - 12 = 16 px de sarcelle visible — l'espacement
    // bas de l'en-tête reste cohérent dans toute l'app.
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Hauteur plancher dimensionnée pour contenir confortablement la pastille du
    // logo (désormais plus grande).
    minHeight: 44,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    // Laisse le bloc-marque se rétrécir pour que le message d'accueil invité se
    // tronque avant d'entrer en collision avec le bouton de recherche, au lieu
    // de le pousser hors écran.
    flexShrink: 1,
  },
  logoChip: {
    backgroundColor: WHITE,
    borderRadius: 6, // entre radii.sm (4) et radii.md (8) — pas de token exact
    padding: 5,
  },
  // Message d'accueil à côté du logo dans la rangée de marque — « Bienvenue »
  // (adhérent) ou « Bienvenue à la FFIE » (invité). Une phrase : elle utilise
  // donc l'interlettrage resserré d'un titre plutôt que l'interlettrage large
  // d'un logotype.
  brandGreeting: {
    color: WHITE,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 2,
    // Pas de marge négative : l'action de fin est un cercle plein, donc son bord
    // extérieur doit s'aligner sur la marge de page — à l'image de la pastille du
    // logo à gauche — pour un rembourrage gauche/droite symétrique.
    marginRight: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: primitives.radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnFilled: {
    backgroundColor: CIRCLE_BG,
  },
  identity: {
    marginTop: 14,
  },
  // Surcharge invité : la rangée de marque est plus haute que son texte à cause
  // de la pastille du logo. Le sous-titre se place GUEST_GAP sous le bord
  // inférieur de la pastille (de l'air pour ne pas coller le logo) ; le CTA en
  // dessous reçoit ce même décalage plus le débord mesuré de la pastille, ce qui
  // garde le sous-titre visuellement centré.
  identityGuest: {
    marginTop: GUEST_GAP,
  },
  hello: {
    color: HELLO,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 1,
  },
  name: {
    color: WHITE,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  subtitle: {
    color: HELLO,
    fontFamily: ralewayFamily("400"),
    fontSize: 13.5,
    lineHeight: 19,
    // Pas de marge haute : l'écart supérieur du bloc invité provient du débord de
    // la pastille du logo (voir identityGuest) pour équilibrer l'écart
    // sous-titre→CTA en dessous.
    marginTop: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    columnGap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: primitives.radii.full,
    // Pastille claire opaque (sans bordure) pour que l'étiquette sarcelle foncé
    // se lise en AAA sur le héros sarcelle — un fond translucide avec texte blanc
    // échouerait au AA ici.
    backgroundColor: PILL_BG,
    marginTop: 12,
  },
  pillText: {
    color: PILL_TEXT,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.1,
  },
});

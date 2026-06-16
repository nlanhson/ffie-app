// Connexion SSO fédération — le sélecteur de fournisseur d'identité.
//
// Le SSO fédération (« Single Sign-On ») permet à un adhérent de se connecter
// avec le compte qu'il possède déjà auprès de sa fédération régionale /
// départementale (le réseau d'identité FFB) plutôt qu'avec un e-mail + mot de
// passe propre à la FFIE. Avant une vraie redirection, l'adhérent doit indiquer
// QUELLE fédération délivre son identité — choisissez votre fédération, puis
// Continuer.
//
// DISPOSITION : reflète délibérément l'annuaire d'adhésion (BecomeMemberScreen)
// pour que les deux surfaces de fédération paraissent identiques — surface
// claire / blanche, grand titre, carte à épingles, recherche avec un bouton de
// tout effacer (✕), une liste repliable (« Afficher N de plus » / « Afficher
// moins »), et un « retour en haut » flottant une fois descendu loin. La seule
// différence est le COMPORTEMENT : les rangées ici SÉLECTIONNENT une seule
// fédération (bouton radio) et un « Continuer » épinglé vous connecte, plutôt
// que de se déplier vers des contacts.
//
// En production, Continuer ouvrirait la connexion sécurisée de la fédération
// choisie (redirection OAuth2 / OIDC via expo-auth-session) et renverrait un
// jeton. En v1, c'est simulé : sélectionnez n'importe quelle fédération +
// Continuer authentifie localement (voir TESTFLIGHT.md / CLAUDE.md — pas de
// backend, ne reliez pas à un vrai fournisseur d'identité sans instruction).
// Piloté par les données de src/data/federations.ts.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { ArrowUp, Check, ChevronDown, ChevronUp, Search, X } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { themes, primitives, semantics } from "@tokens";
import {
  FederationMap,
  type FederationMapHandle,
  type FederationPin,
} from "@/components/ui/FederationMap";
import {
  FEDERATIONS,
  FEDERATIONS_WITH_COORDS,
  type Federation,
} from "@/data/federations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SearchClearButton } from "@/components/ui/ios";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

// Surface claire — se lit comme le reste de l'app (fond blanc, texte foncé),
// même si elle est lancée depuis la connexion sombre. L'app est en thème clair
// uniquement pour l'instant.
const t = themes.light;
const GUTTER = semantics.spacing.gutter.mobile; // 16 — identique à l'annuaire d'adhésion
const RADIUS = primitives.radii.lg; // 12 — champs, rangées, boutons, carte
const NAVY = t.brand.accent; // #222D5D — surbrillance de sélection (radio / bordures) ; désormais le même navy de marque que le CTA plus bas
const NAVY_TINT = primitives.colors.brand.navy[50]; // #ECEEF6 — remplissage de rangée sélectionnée
// Le CTA Continuer utilise navy[700] — le navy de marque FFIE, en cohérence avec
// l'action principale par défaut de l'app (≈11:1 blanc-sur-navy, respecte WCAG AAA).
const CTA_BG = primitives.colors.brand.navy[700]; // #222D5D
const CTA_PRESSED = primitives.colors.brand.navy[800]; // #1A2349

// Vue initiale de la carte centrée sur la France métropolitaine (même cadrage
// que l'annuaire d'adhésion ; les fédérations d'outre-mer sont en dehors —
// déplacez / zoomez pour les atteindre).
const FRANCE_REGION = {
  latitude: 46.6,
  longitude: 2.5,
  latitudeDelta: 9.5,
  longitudeDelta: 9.5,
};
const MAP_HEIGHT = 180;

// Une épingle par fédération qui a une coordonnée. Construit une seule fois — la
// source est statique. (Les fédérations sans coordonnée n'ont pas d'épingle mais
// restent sélectionnables depuis la liste.)
const FEDERATION_PINS: FederationPin[] = FEDERATIONS_WITH_COORDS.map((f) => ({
  id: f.id,
  lat: f.lat as number,
  lng: f.lng as number,
  title: f.area,
  description: f.name,
}));

// Affiche une liste courte par défaut ; « Afficher plus » révèle le reste. Une
// recherche en direct contourne le plafond pour que chaque correspondance soit
// visible.
const INITIAL_COUNT = 10;

// La barre de défilement d'Android se cale sur le bord droit de la ScrollView et
// ignore scrollIndicatorInsets ; on décale donc légèrement la liste interne pour
// soulever la barre du bord de l'écran comme sur iOS. iOS garde la pleine
// largeur + les marges d'indicateur.
const ANDROID_BAR_INSET = Platform.OS === "android" ? 8 : 0;

export function SSOFederationScreen({
  onBack,
  onConnect,
}: {
  onBack: () => void;
  // Une fédération a été choisie et confirmée — promouvoir la session (maquette v1).
  onConnect: (federation: Federation) => void;
}) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { height: windowHeight } = useWindowDimensions();
  // La liste défile dans cette fenêtre à hauteur fixe pour que la page externe
  // puisse défiler autour (défilement imbriqué). ~42 % de l'écran — assez de
  // rangées à parcourir, en laissant la carte + la recherche visibles au-dessus.
  const listWindowHeight = Math.max(260, Math.round(windowHeight * 0.42));

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [footerH, setFooterH] = useState(0);

  const mapRef = useRef<FederationMapHandle>(null);
  const pageRef = useRef<ScrollView>(null); // défilement de la page externe
  const listRef = useRef<ScrollView>(null); // fenêtre de liste interne
  const backToTopAnim = useRef(new Animated.Value(0)).current;

  // Filtre par code de département, zone ou nom officiel — les trois choses
  // qu'un adhérent pourrait taper pour trouver sa fédération.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FEDERATIONS;
    return FEDERATIONS.filter(
      (f) =>
        f.code.toLowerCase().includes(q) ||
        f.area.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q),
    );
  }, [query]);

  const isSearching = query.trim().length > 0;
  const collapsedList = !showAll && !isSearching;
  const visible = collapsedList ? results.slice(0, INITIAL_COUNT) : results;
  const hiddenCount = results.length - visible.length;

  const selected = useMemo(
    () => FEDERATIONS.find((f) => f.id === selectedId) ?? null,
    [selectedId],
  );
  const canConnect = selected !== null;

  // Le retour en haut apparaît en fondu une fois descendu loin (opacité
  // seulement — pas de glissement), réduit à une bascule instantanée en mouvement
  // réduit. L'hystérésis évite le scintillement.
  useEffect(() => {
    Animated.timing(backToTopAnim, {
      toValue: showBackToTop ? 1 : 0,
      duration: reducedMotion ? 0 : primitives.motion.duration.base,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showBackToTop, reducedMotion, backToTopAnim]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 400 && !showBackToTop) setShowBackToTop(true);
    else if (y < 200 && showBackToTop) setShowBackToTop(false);
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
    pageRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  };

  // Un seul chemin de sélection pour les deux entrées : toucher une rangée de
  // liste ou une épingle de carte sélectionne cette fédération et recentre la
  // carte dessus (mouvement réduit → instantané).
  const selectFederation = (id: number) => {
    setSelectedId(id);
    const f = FEDERATIONS.find((x) => x.id === id);
    if (f && typeof f.lat === "number" && typeof f.lng === "number") {
      mapRef.current?.animateToRegion(
        { latitude: f.lat, longitude: f.lng, latitudeDelta: 1.5, longitudeDelta: 1.5 },
        reducedMotion ? 0 : 500,
      );
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <StatusBar style="dark" />

      {/* Fermer — en haut à droite, dégagé du grand titre aligné à gauche (suit
          la fermeture de la modale de l'annuaire d'adhésion). */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fermer"
        onPress={onBack}
        hitSlop={10}
        // Les enfants absolus ne sont pas décalés par la marge supérieure de la
        // SafeAreaView ; on ajoute donc la marge nous-mêmes — sinon le bouton se
        // place sous la barre d'état (horloge / batterie). +12 l'aligne ensuite
        // avec le titre en dessous.
        style={({ pressed }) => [
          styles.close,
          { top: insets.top + 12 },
          pressed && styles.closePressed,
        ]}
      >
        <X size={18} color={t.text.muted} />
      </Pressable>

      {/* Défilement de la page externe — faites glisser n'importe où HORS de la
          boîte de liste (titre, carte, recherche) pour faire défiler toute la
          page ; faites glisser DANS la boîte de liste pour ne faire défiler que
          la liste (la fenêtre imbriquée ci-dessous). */}
      <ScrollView
        ref={pageRef}
        style={styles.page}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre + sous-titre */}
        <View style={styles.head}>
          <Text accessibilityRole="header" style={styles.title}>
            Connectez-vous avec votre fédération
          </Text>
          <Text style={styles.subtitle}>
            Choisissez votre fédération ci-dessous. Vous serez redirigé en toute
            sécurité pour confirmer votre identité.
          </Text>
        </View>

        {/* Carte — touchez une épingle pour sélectionner cette fédération (même
            composant que celui de l'annuaire d'adhésion). Module natif : Apple
            Maps sur iOS, Google sur Android. */}
        <View style={styles.mapCard}>
          <FederationMap
            ref={mapRef}
            style={styles.map}
            initialRegion={FRANCE_REGION}
            pins={FEDERATION_PINS}
            accessibilityLabel="Carte des fédérations départementales"
            onPinPress={selectFederation}
          />
        </View>

        {/* Recherche avec tout effacer */}
        <View style={styles.searchWrap}>
          <Search size={17} color={t.text.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un département ou une fédération"
            placeholderTextColor={t.text.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Rechercher des fédérations"
            style={styles.searchInput}
          />
          {query.length > 0 ? (
            <SearchClearButton themeName="light" onPress={() => setQuery("")} />
          ) : null}
        </View>

        {/* Liste des fédérations */}
        {results.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>Aucune fédération trouvée.</Text>
            <Text style={styles.emptyHint}>
              Essayez un numéro de département (« 69 »), un nom (« Rhône ») ou « Bâtiment ».
            </Text>
          </View>
        ) : (
          <>
            {/* La liste défile dans sa propre fenêtre à hauteur fixe (défilement
                imbriqué) pour que la carte reste visible ; la page externe défile
                quand vous faites glisser hors de cette boîte. */}
            <View style={{ paddingRight: ANDROID_BAR_INSET }}>
              <ScrollView
                ref={listRef}
                nestedScrollEnabled
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                style={{ height: listWindowHeight }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator
                indicatorStyle="default"
                scrollIndicatorInsets={{ right: 3, top: 4, bottom: 4 }}
              >
                {visible.map((item) => {
                  const isSelected = item.id === selectedId;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`${item.area} — département ${item.code}`}
                      onPress={() => selectFederation(item.id)}
                      style={({ pressed }) => [
                        styles.row,
                        isSelected && styles.rowSelected,
                        pressed && !isSelected && styles.rowPressed,
                      ]}
                    >
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.code}</Text>
                      </View>
                      <View style={styles.rowText}>
                        <Text style={styles.rowArea} numberOfLines={1}>
                          {item.area}
                        </Text>
                        <Text style={styles.rowName} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={[styles.radio, isSelected && styles.radioOn]}>
                        {isSelected ? <Check size={14} color="#FFFFFF" /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Afficher plus / moins + légende de comptage se placent dans la
                page, sous la fenêtre — re-toucher agit au niveau de la page, pas
                du défilement de la liste. */}
            {collapsedList && hiddenCount > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Afficher les ${results.length} fédérations`}
                onPress={() => setShowAll(true)}
                style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
              >
                <Text style={styles.toggleLabel}>Afficher {hiddenCount} de plus</Text>
                <ChevronDown size={18} color={NAVY} />
              </Pressable>
            ) : null}

            {showAll && !isSearching ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Afficher moins de fédérations"
                onPress={() => {
                  setShowAll(false);
                  scrollToTop();
                }}
                style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
              >
                <Text style={styles.toggleLabel}>Afficher moins</Text>
                <ChevronUp size={18} color={NAVY} />
              </Pressable>
            ) : null}

            {collapsedList ? (
              <Text style={styles.countCaption}>
                {`Affichage de ${visible.length} fédérations départementales sur ${FEDERATIONS.length}.`}
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>

      {/* Pied de page épinglé — Continuer connecte avec la fédération sélectionnée. */}
      <View
        onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
        style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canConnect }}
          accessibilityLabel={selected ? `Continuer avec ${selected.area}` : "Continuer"}
          disabled={!canConnect}
          onPress={() => selected && onConnect(selected)}
          style={({ pressed }) => [
            styles.cta,
            canConnect ? styles.ctaActive : styles.ctaDisabled,
            canConnect && pressed && styles.ctaPressed,
          ]}
        >
          <Text style={[styles.ctaLabel, !canConnect && styles.ctaLabelDisabled]}>
            {selected ? `Continuer avec ${selected.area}` : "Sélectionnez une fédération"}
          </Text>
        </Pressable>
      </View>

      {/* Retour en haut — apparaît en fondu sur la liste une fois descendu loin,
          relevé au-dessus du pied de page. */}
      <Animated.View
        pointerEvents={showBackToTop ? "box-none" : "none"}
        style={[styles.backToTop, { bottom: 24 + footerH, opacity: backToTopAnim }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour en haut"
          onPress={scrollToTop}
          style={({ pressed }) => [
            styles.backToTopBtn,
            { backgroundColor: pressed ? t.action.primary.bgPressed : t.action.primary.bg },
          ]}
        >
          <ArrowUp size={22} color={t.action.primary.fg} strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: t.surface.default },

  close: {
    position: "absolute",
    right: GUTTER,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.surface.subtle,
  },
  closePressed: { backgroundColor: t.border.subtle },

  head: {
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    paddingBottom: 6,
    paddingRight: 52, // dégagé du bouton de fermeture
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: t.text.body,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    color: t.text.muted,
    fontFamily: ralewayFamily("400"),
  },

  mapCard: {
    marginHorizontal: GUTTER,
    marginTop: 12,
    borderRadius: RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: t.border.default,
  },
  map: { width: "100%", height: MAP_HEIGHT },

  searchWrap: {
    marginHorizontal: GUTTER,
    marginTop: 16,
    marginBottom: 12,
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 7,
    backgroundColor: t.border.subtle,
  },
  searchInput: {
    flex: 1,
    color: t.text.body,
    fontSize: 16,
    fontFamily: ralewayFamily("400"),
  },

  emptyWrap: { padding: 48, alignItems: "center" },
  empty: { color: t.text.muted, fontSize: 15, marginBottom: 6 },
  emptyHint: { color: t.text.muted, fontSize: 13, opacity: 0.8, textAlign: "center" },

  page: { flex: 1 },
  pageContent: { paddingBottom: 24 },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: 4,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: t.border.default,
    backgroundColor: t.surface.default,
    marginBottom: 8,
  },
  rowSelected: { backgroundColor: NAVY_TINT, borderColor: NAVY },
  rowPressed: { backgroundColor: t.surface.subtle },
  badge: {
    minWidth: 40,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: t.border.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: t.text.body,
    fontSize: 13,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  rowText: { flex: 1 },
  rowArea: {
    color: t.text.body,
    fontSize: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
  },
  rowName: {
    marginTop: 2,
    color: t.text.muted,
    fontSize: 12,
    fontFamily: ralewayFamily("400"),
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: t.border.strong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { backgroundColor: NAVY, borderColor: NAVY },

  toggle: {
    marginTop: 12,
    marginHorizontal: GUTTER,
    minHeight: 44,
    borderRadius: primitives.radii.md,
    backgroundColor: t.surface.subtle,
    borderWidth: 1,
    borderColor: t.border.subtle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
  },
  togglePressed: { backgroundColor: t.border.subtle },
  toggleLabel: {
    fontSize: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    color: t.text.body,
  },
  countCaption: {
    color: t.text.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    marginHorizontal: GUTTER + 4,
  },

  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.border.default,
    backgroundColor: t.surface.default,
  },
  cta: {
    height: 56,
    borderRadius: RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaActive: { backgroundColor: CTA_BG },
  ctaPressed: { backgroundColor: CTA_PRESSED },
  ctaDisabled: { backgroundColor: t.border.subtle },
  ctaLabel: {
    color: t.action.primary.fg,
    fontSize: 16,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  ctaLabelDisabled: { color: t.text.placeholder },

  backToTop: { position: "absolute", right: GUTTER },
  backToTopBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
});

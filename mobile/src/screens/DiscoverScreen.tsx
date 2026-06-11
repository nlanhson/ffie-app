// Onglet Métiers — la surface de découverte publique pour les invités (Karim + Léa).
//
// Un contrôle segmenté sous le grand titre divise l'onglet en trois segments,
// comme le sélecteur des onglets Actualités / Partenaires :
//   • Métiers      — le contenu carrières (l'écran Découvrir original, ci-dessous).
//   • Vidéos       — contenu multimédia (FFIE-VIDEO-01, 🔵 Phase 1) : un clone de
//                    la page « Vidéos » de la FFIE — quatre catégories thématiques
//                    qui ouvrent les pages vidéo de la fédération dans le navigateur intégré.
//   • Calculateurs — outils de calcul technique (FFIE-CALC-01/02, 🟢 Phase 2,
//                    réservés aux adhérents). Le module + l'outil puissance↔courant
//                    sont construits (voir CalculatorsView) ; les invités obtiennent un état verrouillé.
//
// Le segment « Métiers » (TradesBody) reproduit la page carrières du client
// (ffie.fr/les-metiers-de-lelectricite/metiers-et-formations) section par section :
//   1. Le paragraphe d'introduction du client (verbatim).
//   2. Explorer le domaine — les 5 domaines en lignes touchables ouvrant une feuille de détail.
//   3. Deux cartes vedettes — « 7 raisons… » et le « kit métiers » ; chacune ouvre
//      sa page (le kit est un PDF) dans le navigateur intégré.
//   4. « Les métiers de demain » — titre + intro + une grille FORMATION à 2 colonnes
//      + un bouton « Voir plus de formations » (ouvre l'index des métiers).
//
// Périmètre : Métiers correspond à FFIE-TRADES-01 (fiches métiers + contenu
// pédagogique). Toute l'imagerie est provisoire (voir data/trades.ts) ; les liens
// s'ouvrent en externe (P6).

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react-native";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, useNavigationContainerRef, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { useHomeColors } from "@/components/home/homeColors";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VideoCategoryScreen } from "./VideoCategoryScreen";
import { ToolsHubView } from "./ToolsHubView";
import { ProfessionsView } from "./ProfessionsView";
import {
  VIDEOS_INTRO,
  VIDEO_CATEGORIES,
  YOUTUBE_CHANNEL_URL,
  youtubeThumb,
  type VideoCategory,
} from "@/data/videos";

// Ouvre un lien externe dans le navigateur intégré natif (page sheet, glisse
// vers le haut depuis le bas), comme les lecteurs Actualités / formations et
// l'annuaire Partenaires. Utilisé par les cartes vedettes Métiers, le bouton
// « Voir plus de formations » et le lien de la chaîne Vidéos.
function openInBrowser(url: string, themeName: ThemeName) {
  const t = themes[themeName];
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    controlsColor: t.brand.accent,
    toolbarColor: t.surface.default,
    dismissButtonStyle: "close",
  }).catch(() => {});
}

// L'onglet Découvrir est une pile native autonome (Feed → VideoCategory),
// comme l'onglet Actualités : ouvrir une catégorie vidéo empile le lecteur
// intégré, qui obtient gratuitement les affordances de retour de la plateforme
// (balayage depuis le bord gauche sur iOS, retour système Android). Les routes
// ne transportent que l'id de catégorie (les params doivent être sérialisables).
type TradesStackParamList = {
  Feed: undefined;
  VideoCategory: { id: string };
};

const Stack = createNativeStackNavigator<TradesStackParamList>();

const GRID_GAP = 14;

// Les segments à l'intérieur de l'onglet Découvrir. "trades" est le contenu
// carrières public (l'atterrissage par défaut — un espace réservé vide pour
// l'instant, en attendant le contenu FFIE) ; "tools" est la grille de lancement
// qui accueille désormais aussi les calculateurs (voir ToolsHubView) ; "videos"
// clone la page vidéos de la FFIE. Un contrôle segmenté en haut bascule entre
// eux, comme l'onglet Actualités.
type TradesTab = "trades" | "tools" | "videos";

// Texte du grand titre par segment (l'en-tête se retitre comme le fait l'onglet Actualités).
const TAB_TITLES: Record<TradesTab, string> = {
  trades: "Métiers",
  tools: "Outils",
  videos: "Vidéos",
};

export function DiscoverScreen({
  themeName = "light",
  resetSignal,
  initialSegment,
}: {
  themeName?: ThemeName;
  /** Incrémenté par le shell quand l'onglet Métiers est re-touché alors qu'il est
   *  déjà actif. On l'utilise pour dépiler la pile jusqu'à la grille depuis un lecteur ouvert. */
  resetSignal?: number;
  /** Ouvrir sur un segment spécifique (p. ex. "tools" en arrivant depuis le
   *  raccourci « Outils FFIE » de l'Accueil). Par défaut, le contenu carrières ("trades"). */
  initialSegment?: TradesTab;
}) {
  const reducedMotion = useReducedMotion();
  const navRef = useNavigationContainerRef<TradesStackParamList>();

  // Re-toucher l'onglet Métiers actif dépile le lecteur de formation jusqu'à la grille.
  // On ignore la première exécution (montage) pour ne réagir qu'aux véritables re-touches.
  const isFirstResetRun = useRef(true);
  useEffect(() => {
    if (isFirstResetRun.current) {
      isFirstResetRun.current = false;
      return;
    }
    if (navRef.isReady() && navRef.canGoBack()) {
      navRef.dispatch(StackActions.popToTop());
    }
  }, [resetSignal, navRef]);

  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // chaque écran dessine son propre en-tête iOS-HIG
          // Le mouvement réduit est non négociable (P5) : on réduit la transition
          // d'empilement/dépilement à une coupe instantanée. Le geste de retour
          // par balayage depuis le bord gauche reste activé dans tous les cas —
          // c'est une entrée, pas un mouvement décoratif.
          animation: reducedMotion ? "none" : "default",
        }}
      >
        <Stack.Screen name="Feed">
          {({ navigation }) => (
            <DiscoverFeed
              themeName={themeName}
              initialTab={initialSegment}
              onOpenVideo={(id) => navigation.navigate("VideoCategory", { id })}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="VideoCategory">
          {({ navigation, route }) => (
            <VideoCategoryRoute
              id={route.params.id}
              themeName={themeName}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// VideoCategoryRoute — résout l'id de catégorie de la route en lecteur vidéo.
// Un id inconnu dépile simplement jusqu'à la grille.
function VideoCategoryRoute({
  id,
  themeName,
  onBack,
}: {
  id: string;
  themeName: ThemeName;
  onBack: () => void;
}) {
  const category = VIDEO_CATEGORIES.find((cat) => cat.id === id) ?? null;

  useEffect(() => {
    if (!category) onBack();
  }, [category, onBack]);
  if (!category) return null;

  return <VideoCategoryScreen category={category} themeName={themeName} onBack={onBack} />;
}

// DiscoverFeed — le flux de l'onglet Métiers lui-même : le contrôle segmenté
// (Métiers / Vidéos / Calculateurs) et, sur le segment Métiers, le contenu
// carrières. Détient l'état du segment actif ; reste monté sous un lecteur de
// formation empilé (pile native), de sorte que le défilement et le segment
// survivent à l'aller-retour.
function DiscoverFeed({
  themeName = "light",
  initialTab,
  onOpenVideo,
}: {
  themeName?: ThemeName;
  initialTab?: TradesTab;
  onOpenVideo?: (id: string) => void;
}) {
  const c = useGroupedColors(themeName);
  // La grille de lancement « Outils » adopte l'allure du tableau de bord de
  // l'Accueil — page grise en creux derrière des cartes blanches surélevées —
  // elle obtient donc la palette de l'Accueil, et non celle inversée des écrans
  // de liste (page blanche / carte grise).
  const homeC = useHomeColors(themeName);

  // Segment actif. Le contenu carrières « Métiers » est l'atterrissage par défaut
  // (un espace réservé vide pour l'instant). « Outils » est la grille de lancement
  // (qui accueille désormais les calculateurs) et « Vidéos » clone la page vidéos
  // de la FFIE. `initialTab` permet à un lien profond (raccourci « Outils FFIE » /
  // « Nos métiers » de l'Accueil) d'ouvrir un segment spécifique.
  const [tab, setTab] = useState<TradesTab>(initialTab ?? "trades");

  // Changer de segment repart en haut, comme Actualités / Partenaires.
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [tab]);

  // Le lanceur Outils repose sur la page tableau de bord grise en creux ; les
  // autres segments conservent le fond de page des écrans de liste.
  const pageBg = tab === "tools" || tab === "trades" ? homeC.pageBg : c.pageBg;

  return (
    // Le titre de page vit désormais dans l'AppHeader partagé (shell) ; le
    // contenu se rend directement en dessous.
    <View style={{ flex: 1, backgroundColor: pageBg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sélecteur de segment. Placé sous le grand titre comme un contrôle
            segmenté iOS : Métiers (contenu carrières, par défaut), Outils (grille
            de lancement + calculateurs) et Vidéos. */}
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 6, paddingBottom: 18 }}>
          <SegmentedControl
            themeName={themeName}
            value={tab}
            options={[
              { key: "trades", label: "Métiers" },
              { key: "tools", label: "Outils" },
              { key: "videos", label: "Vidéos" },
            ]}
            onChange={setTab}
          />
        </View>

        {tab === "tools" ? (
          // La grille de lancement « Outils FFIE » — accueille désormais aussi les
          // calculateurs sous forme de tuiles (PowerCalculatorSheet /
          // VoltageDropSheet), réservées aux adhérents. Voir ToolsHubView.
          <ToolsHubView themeName={themeName} />
        ) : tab === "videos" ? (
          // FFIE-VIDEO-01 (🔵 Phase 1) — clone de la page « Vidéos » de la FFIE.
          <VideosView themeName={themeName} onOpenCategory={onOpenVideo} />
        ) : (
          // « Métiers » (par défaut) — la section publique « Découvrir les métiers »
          // (WBS Epic 4) : fiches métiers + parcours de formation + vidéos de
          // présentation. Le contenu carrières précédent est conservé dans
          // TradesBody (ci-dessous).
          <ProfessionsView themeName={themeName} />
        )}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// VideosView — le segment « Vidéos » : un clone de la page « Vidéos » de la FFIE.
// Une ligne d'introduction, une grille à deux colonnes de catégories vidéo
// thématiques (chacune empilant un lecteur de catégorie intégré qui joue les
// films), et un bouton vers la chaîne YouTube de la fédération. Les données
// vivent dans data/videos.ts.
// ---------------------------------------------------------------------------
function VideosView({
  themeName,
  onOpenCategory,
}: {
  themeName: ThemeName;
  onOpenCategory?: (id: string) => void;
}) {
  const t = themes[themeName];
  const { width: screenW } = useWindowDimensions();
  const colW = (screenW - GUTTER * 2 - GRID_GAP) / 2;

  return (
    <>
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 2 }}>
        <Text style={{ color: t.text.muted, fontSize: 15, lineHeight: 22 }}>{VIDEOS_INTRO}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: GRID_GAP,
          rowGap: 18,
          paddingHorizontal: GUTTER,
          marginTop: 20,
        }}
      >
        {VIDEO_CATEGORIES.map((category) => (
          <VideoTile
            key={category.id}
            category={category}
            width={colW}
            themeName={themeName}
            onPress={() => onOpenCategory?.(category.id)}
          />
        ))}
      </View>

      {/* L'introduction oriente les utilisateurs vers la chaîne de la fédération
          « pour tout voir » — voici ce lien, qui ouvre la chaîne dans le navigateur intégré. */}
      <View style={{ alignItems: "center", marginTop: 24 }}>
        <ChannelButton themeName={themeName} />
      </View>
    </>
  );
}

// ChannelButton — le bouton encadré « Voir notre chaîne YouTube » sous la grille
// Vidéos. Reflète SeeMoreButton, avec un glyphe de lien externe (la chaîne
// s'ouvre dans le navigateur intégré, pas en ligne) — YOUTUBE_CHANNEL_URL.
function ChannelButton({ themeName }: { themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voir notre chaîne YouTube."
      accessibilityHint="Ouvre la chaîne YouTube de la FFIE"
      onPress={() => openInBrowser(YOUTUBE_CHANNEL_URL, themeName)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
        minHeight: 48,
        paddingHorizontal: 22,
        borderRadius: primitives.radii.md,
        borderWidth: 1.5,
        borderColor: t.brand.accent,
        backgroundColor: pressed ? t.border.subtle : "transparent",
      })}
    >
      <ExternalLink size={17} color={t.brand.accent} />
      <Text
        style={{
          color: t.brand.accent,
          fontSize: 13,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: 0.4,
          textTransform: "uppercase",
        }}
      >
        Voir notre chaîne YouTube
      </Text>
    </Pressable>
  );
}

// VideoTile — une carte de grille à deux colonnes pour une catégorie vidéo :
// miniature 16:9 avec un badge de lecture centré, puis le titre et le nombre de films.
function VideoTile({
  category,
  width,
  themeName,
  onPress,
}: {
  category: VideoCategory;
  width: number;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const count = category.videos.length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category.title}. ${count > 1 ? `${count} vidéos` : "1 vidéo"}.`}
      onPress={onPress}
      style={({ pressed }) => ({
        width,
        backgroundColor: pressed ? t.border.subtle : c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: c.cardBorder ? 1 : 0,
        borderColor: c.cardBorder,
        overflow: "hidden",
        transform: pressed ? [{ scale: 0.985 }] : [{ scale: 1 }],
      })}
    >
      <View>
        <RemoteImage
          uri={category.videos[0] ? youtubeThumb(category.videos[0].youtubeId) : category.imageUrl}
          seed={category.seed}
          width="100%"
          aspectRatio={16 / 9}
          pixelWidth={640}
          pixelHeight={360}
          themeName={themeName}
          accessibilityLabel={category.alt}
        />
        {/* Badge de lecture centré par-dessus la miniature. */}
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(0,0,0,0.55)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>
      </View>
      <View style={{ padding: 12 }}>
        <Text
          style={{
            color: t.text.body,
            fontSize: 14.5,
            lineHeight: 19,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.1,
          }}
        >
          {category.title}
        </Text>
        <Text style={{ color: t.text.muted, fontSize: 12.5, marginTop: 4 }}>
          {count > 1 ? `${count} vidéos` : "1 vidéo"}
        </Text>
      </View>
    </Pressable>
  );
}

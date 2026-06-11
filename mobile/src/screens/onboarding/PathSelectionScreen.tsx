// Bienvenue / Sélection de parcours — v2.
//
// Disposition (affiche façon Mobbin + carte en bas) :
//   - home-banner-bg.jpg en pleine page derrière tout le reste.
//   - Fin voile pour que l'en-tête en haut à gauche se lise sur la bande de ciel sombre.
//   - En-tête : petit logo FFIE + logotype, ancré en haut à gauche.
//   - Carte du bas : blanche, coins supérieurs arrondis seulement, titre
//     « Commencer » + sous-titre d'une ligne, puis deux CTA empilés
//     (Se connecter / Naviguer librement).
//
// L'inscription est délibérément omise — les adhérents des fédérations FFIE sont
// admis par le personnel de la FFIE, pas auto-inscrits sur l'app. Si l'auto-
// inscription est activée plus tard, ajoutez un bouton fantôme « S'inscrire »
// sous le CTA principal « Se connecter ».

import React from "react";
import { ArrowRight } from "lucide-react-native";
import {
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes, type ThemeName } from "@tokens";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

const BG = require("../../../assets/home-banner-bg.jpg");

export type OnboardingPath = "member" | "discover";

export function PathSelectionScreen({
  themeName = "light",
  onSelect,
}: {
  themeName?: ThemeName;
  onSelect: (path: OnboardingPath) => void;
}) {
  const t = themes[themeName];

  return (
    <View style={styles.root}>
      {/* Cet écran est une photo sombre fixe dans tous les thèmes ; la barre
          d'état doit donc toujours utiliser un contenu clair (blanc) —
          indépendamment de la StatusBar globale pilotée par le thème de l'app.
          La StatusBar montée le plus en profondeur l'emporte tant que cet écran
          est affiché, puis revient à la navigation suivante. */}
      <StatusBar style="light" />
      <ImageBackground source={BG} resizeMode="cover" style={StyleSheet.absoluteFill} />
      {/* Voile subtil — garde le texte d'en-tête blanc lisible sur l'image sans
          ternir la photo. */}
      <View style={styles.scrim} pointerEvents="none" />

      <View style={styles.layout}>
        <SafeAreaView edges={["top"]} style={styles.posterArea}>
          {/* Le logo centré + le texte de bienvenue se placent à peu près dans le
              tiers supérieur de l'image visible, au-dessus de la carte blanche. */}
          <View style={{ flex: 1 }} />
          <View style={styles.poster}>
            <FFIELogo size={104} themeName="dark" />
            <Text style={styles.posterTitle}>Bienvenue à la FFIE</Text>
          </View>
          <View style={{ flex: 1.4 }} />
        </SafeAreaView>

        <View style={[styles.card, Platform.OS === "android" && styles.cardAndroid]}>
          <Text style={styles.cardHeading}>Commencer</Text>
          <Text style={styles.subtitle}>
            Adhérents comme visiteurs — chacun a son propre parcours à partir d'ici.
          </Text>

          <View style={styles.actions}>
            <PrimaryAction
              label="Se connecter"
              accessibilityLabel="Se connecter en tant qu'adhérent FFIE"
              onPress={() => onSelect("member")}
              bg={t.action.primary.bg}
              bgPressed={t.action.primary.bgPressed}
            />
            <SecondaryAction
              label="Naviguer librement"
              accessibilityLabel="Continuer en tant que visiteur"
              onPress={() => onSelect("discover")}
            />
          </View>

          <SafeAreaView edges={["bottom"]} />
        </View>
      </View>
    </View>
  );
}

function PrimaryAction({
  label,
  accessibilityLabel,
  onPress,
  bg,
  bgPressed,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: (e: GestureResponderEvent) => void;
  bg: string;
  bgPressed: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cta,
        { backgroundColor: pressed ? bgPressed : bg },
      ]}
    >
      <Text style={styles.ctaLabelPrimary}>{label}</Text>
      <ArrowRight size={18} color="#FFFFFF" />
    </Pressable>
  );
}

function SecondaryAction({
  label,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: (e: GestureResponderEvent) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.ctaOutline,
        pressed && styles.ctaOutlinePressed,
      ]}
    >
      <Text style={styles.ctaLabelSecondary}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0E18" },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  layout: { flex: 1, justifyContent: "space-between" },

  posterArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  poster: {
    alignItems: "center",
    rowGap: 16,
  },
  posterTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: displayFamily("600"), fontWeight: "600",
    letterSpacing: -0.4,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 8,
  },
  // La marge de zone sûre du bas d'Android est bien plus petite que celle de
  // l'indicateur d'accueil d'iOS ; l'espaceur SafeAreaView vide sous les CTA
  // laisse donc la carte coller au bord de l'écran. On ajoute de l'air sur
  // Android seulement (iOS est correct).
  cardAndroid: {
    paddingBottom: 28,
  },
  cardHeading: {
    fontSize: 22,
    fontFamily: displayFamily("700"), fontWeight: "700",
    color: "#0A0E18",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#5B6577",
    lineHeight: 20,
  },

  actions: {
    marginTop: 24,
    rowGap: 12,
  },

  cta: {
    height: 56,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  ctaLabelPrimary: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: ralewayFamily("600"), fontWeight: "600",
    letterSpacing: -0.1,
  },
  ctaOutline: {
    height: 56,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: "#D8DCE4",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaOutlinePressed: {
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  ctaLabelSecondary: {
    color: "#0A0E18",
    fontSize: 16,
    fontFamily: ralewayFamily("600"), fontWeight: "600",
    letterSpacing: -0.1,
  },
});

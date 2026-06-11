// Écran de démarrage FFIE — fond blanc minimal v1.4.
//
// v1.4 — fond blanc uni, logo FFIE centré à l'écran.
// L'image et le dégradé ont été supprimés. Le logo apparaît en fondu une fois
// puis reste visible ~550 ms avant d'émettre onReady (laissant à la marque le
// temps de s'installer même sur un appareil rapide).
//
// Mouvement : un seul fondu du logo (320 ms easing.decelerate). En mouvement
// réduit, il bascule directement vers visible. Maintien de 550 ms après la fin
// de l'animation d'entrée avant que onReady ne se déclenche — s'applique aussi
// bien en cas normal qu'en mouvement réduit.

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  AccessibilityInfo,
  StyleSheet,
  View,
} from "react-native";
import { primitives, type ThemeName } from "@tokens";
import { FFIELogo } from "@/components/ui/FFIELogo";

// Conservé pour l'accessibilityLabel afin que les utilisateurs de lecteur
// d'écran entendent quand même l'identité de la fédération même si le texte
// n'est pas à l'écran.
const FEDERATION = "Fédération Française des Intégrateurs Électriciens";

// Combien de temps le logo reste visible après la fin de l'animation d'entrée,
// avant que l'on émette onReady et laisse l'OnboardingFlow avancer.
const DWELL_AFTER_ENTER_MS = 550;

export function SplashScreen({
  themeName = "light",
  onReady,
}: {
  themeName?: ThemeName;
  onReady?: () => void;
}) {
  void themeName; // le traitement visuel est indépendant du thème

  const logoFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    const fireReady = () => {
      dwellTimer = setTimeout(() => {
        if (!cancelled) onReady?.();
      }, DWELL_AFTER_ENTER_MS);
    };

    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return;

      if (reduced) {
        // Bascule vers visible. On respecte tout de même le maintien pour que la marque s'imprime.
        logoFade.setValue(1);
        fireReady();
        return;
      }

      Animated.timing(logoFade, {
        toValue: 1,
        duration: primitives.motion.duration.slow, // 320ms
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) fireReady();
      });
    });

    return () => {
      cancelled = true;
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [logoFade, onReady]);

  // Translation vers le haut de 8 → 0 associée au fondu.
  const enterTransform = {
    opacity: logoFade,
    transform: [
      {
        translateY: logoFade.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
    ],
  };

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`FFIE · ${FEDERATION}`}
      style={styles.root}
    >
      <Animated.View style={enterTransform}>
        <FFIELogo size={120} themeName="light" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});

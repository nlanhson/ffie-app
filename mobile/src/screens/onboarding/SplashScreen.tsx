// FFIE Splash — minimal v1.4 white background.
//
// v1.4 — solid white background, FFIE logo centered on screen.
// The image and gradient have been removed. Logo fades in once and then
// holds visible for ~550ms before emitting onReady (giving the brand
// room to land even on a fast device).
//
// Motion: single logo fade (320ms easing.decelerate). Reduced-motion snaps
// to visible. Dwell hold of 550ms after the enter animation completes
// before onReady fires — applies in both normal and reduced-motion cases.

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

// Kept for the accessibilityLabel so screen-reader users still hear the
// federation identity even though the text isn't on-screen.
const FEDERATION = "Fédération Française des Intégrateurs Électriciens";

// How long the logo stays visible after the enter animation finishes,
// before we emit onReady and let the OnboardingFlow advance.
const DWELL_AFTER_ENTER_MS = 550;

export function SplashScreen({
  themeName = "light",
  onReady,
}: {
  themeName?: ThemeName;
  onReady?: () => void;
}) {
  void themeName; // visual treatment is theme-agnostic

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
        // Snap to visible. Still honor the dwell so the brand registers.
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

  // Translate-up by 8 → 0 paired with fade.
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

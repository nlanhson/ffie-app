// Skeleton — loading-state placeholder primitives.
//
// A skeleton screen mirrors the SHAPE of the page that's about to land:
// same gutters, same card sizes, same row rhythm, so the layout doesn't jump
// when real content swaps in. The blocks pulse gently in unison (a single
// shared Animated value drives every block under a SkeletonGroup) so the
// effect reads as "loading", not decoration.
//
// Motion safety (non-negotiable, P5): when the OS "Reduce Motion" setting is
// on, the pulse is disabled and blocks render as a flat, calm grey — no
// looping animation at all.
//
// Usage:
//   <SkeletonGroup themeName={themeName}>
//     <SkeletonBlock width={120} height={16} />
//     <SkeletonBlock width="100%" aspectRatio={16 / 9} radius={primitives.radii.lg} />
//   </SkeletonGroup>

import React, { createContext, useContext, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  type DimensionValue,
  type ViewStyle,
} from "react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// The shared pulse (0 → 1 → 0). Null when no group wraps a block, in which
// case the block falls back to a static mid opacity.
const PulseContext = createContext<Animated.Value | null>(null);

const PULSE_PERIOD = 850; // ms per half-cycle — slow, "breathing", non-distracting

// ---------------------------------------------------------------------------
// SkeletonGroup — owns the looping pulse and shares it with every SkeletonBlock
// underneath, so the whole screen shimmers as one. One animation, native-driven.
// ---------------------------------------------------------------------------
export function SkeletonGroup({ children }: { children: React.ReactNode }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Settle to a steady mid value — a calm static placeholder, no loop.
      pulse.setValue(0.5);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_PERIOD,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: PULSE_PERIOD,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [reducedMotion, pulse]);

  return <PulseContext.Provider value={pulse}>{children}</PulseContext.Provider>;
}

// Resting fill tone — visible against both the white/grey page and the grouped
// card surfaces, in every theme. border.default is the decorative divider grey
// (gray200 light / gray700 dark), which reads as a classic skeleton block.
function skeletonTone(themeName: ThemeName): string {
  return themes[themeName].border.default;
}

// ---------------------------------------------------------------------------
// SkeletonBlock — one placeholder rectangle. Pulses opacity in sync with its
// SkeletonGroup. Width/height/aspectRatio/radius mirror the real element it
// stands in for.
// ---------------------------------------------------------------------------
export function SkeletonBlock({
  width = "100%",
  height,
  aspectRatio,
  radius = primitives.radii.sm,
  themeName = "light",
  style,
}: {
  width?: DimensionValue;
  height?: DimensionValue;
  aspectRatio?: number;
  radius?: number;
  themeName?: ThemeName;
  style?: ViewStyle;
}) {
  const pulse = useContext(PulseContext);
  // Gentle "slight" shimmer: never fully opaque, never fully gone.
  const opacity = pulse
    ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] })
    : 0.6;

  return (
    <Animated.View
      // Skeletons are decorative — keep them off the accessibility tree so a
      // screen reader announces nothing while content loads.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          aspectRatio,
          borderRadius: radius,
          backgroundColor: skeletonTone(themeName),
          opacity,
        },
        style,
      ]}
    />
  );
}

// SkeletonCircle — convenience for avatars / monograms / round tiles.
export function SkeletonCircle({
  size,
  themeName = "light",
  style,
}: {
  size: number;
  themeName?: ThemeName;
  style?: ViewStyle;
}) {
  return (
    <SkeletonBlock
      width={size}
      height={size}
      radius={size / 2}
      themeName={themeName}
      style={style}
    />
  );
}

// SkeletonTextLine — a single line of "text". `width` lets callers vary line
// lengths so a paragraph reads as a paragraph, not a slab.
export function SkeletonTextLine({
  width = "100%",
  height = 12,
  themeName = "light",
  style,
}: {
  width?: DimensionValue;
  height?: number;
  themeName?: ThemeName;
  style?: ViewStyle;
}) {
  return (
    <SkeletonBlock
      width={width}
      height={height}
      radius={primitives.radii.sm}
      themeName={themeName}
      style={StyleSheet.flatten([{ marginVertical: 2 }, style])}
    />
  );
}

// FFIE StatusPill — React Native port of
// /Users/du-mac/FFIE/design-system-preview/src/components/ui/StatusPill.tsx
// Same public API. Reads identical tokens from the canonical tokens.ts.
//
// Differences from web:
//   - <View> / <Text> / <Pressable> instead of <span> / <button>
//   - Animated.View for rotation (no CSS keyframes)
//   - No SVG dichromacy filter (that was a preview-only audit tool)
//   - No focus ring CSS — RN handles focus via Pressable + accessibility props

import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  RefreshCw,
  WifiOff,
  type LucideIcon,
} from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

export type StatusName =
  | "success" | "warning" | "danger" | "info"
  | "offline" | "syncing" | "stale" | "fresh";
export type StatusPillVariant = "filled" | "subtle";
export type StatusPillSize = "sm" | "md" | "lg";

type Base = {
  name: StatusName;
  variant?: StatusPillVariant;
  label?: string;
  themeName?: ThemeName;
  accessibilityLabel?: string;
};
type Tappable =
  | { size: "lg"; onPress?: () => void }
  | { size?: "sm" | "md"; onPress?: never };

export type StatusPillProps = Base & Tappable;

const ICON_BY_NAME: Record<StatusName, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  offline: WifiOff,
  syncing: RefreshCw,
  stale: Clock,
  fresh: CheckCircle2,
};

// Canonical labels — same source of truth as web.
const LABEL_BY_NAME: Record<StatusName, string> = {
  success: "Réussi",
  warning: "Attention",
  danger: "Erreur",
  info: "Info",
  offline: "Hors ligne",
  syncing: "Synchro…",
  stale: "Obsolète",
  fresh: "À jour",
};

function resolveFeedbackName(name: StatusName): Exclude<StatusName, "fresh"> {
  return name === "fresh" ? "success" : name;
}

const SIZE_TABLE: Record<StatusPillSize, { height: number; iconSize: number; fontSize: number; padX: number; gap: number }> = {
  sm: { height: 20, iconSize: 12, fontSize: 11, padX: 6, gap: 4 },
  md: { height: 24, iconSize: 14, fontSize: 12, padX: primitives.space[2], gap: 4 },
  lg: { height: 32, iconSize: 16, fontSize: 14, padX: primitives.space[3], gap: 6 },
};

type Resolved = { bg: string; fg: string; border: string | null };

function resolveColors(name: StatusName, variant: StatusPillVariant, themeName: ThemeName): Resolved {
  const t = themes[themeName];
  const fb = resolveFeedbackName(name);
  if (variant === "filled") {
    return { bg: t.feedback[fb], fg: t.text.inverse, border: null };
  }
  const sub = t.feedback.subtle[fb];
  return { bg: sub.bg, fg: sub.fg, border: sub.border };
}

export const StatusPill = forwardRef<View, StatusPillProps>(function StatusPill(props, ref) {
  const {
    name,
    variant = "filled",
    size = "md",
    label,
    themeName = "light",
    accessibilityLabel,
    onPress,
  } = props as StatusPillProps & { size: StatusPillSize; onPress?: () => void };

  const colors = resolveColors(name, variant, themeName);
  const sz = SIZE_TABLE[size];
  const Icon = ICON_BY_NAME[name];
  const isTappable = size === "lg" && typeof onPress === "function";
  const isSyncing = name === "syncing";
  const displayLabel = label ?? LABEL_BY_NAME[name];

  // Rotation animation for syncing icon — Animated, looped, motion.duration.loop.
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isSyncing) return;
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: primitives.motion.duration.loop,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isSyncing, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const baseStyle: ViewStyle = {
    height: sz.height,
    paddingHorizontal: sz.padX,
    backgroundColor: colors.bg,
    borderRadius: primitives.radii.full,
    flexDirection: "row",
    alignItems: "center",
    columnGap: sz.gap,
    alignSelf: "flex-start",
  };
  if (colors.border) {
    baseStyle.borderWidth = 1;
    baseStyle.borderColor = colors.border;
  }

  const content = (
    <>
      {isSyncing ? (
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon size={sz.iconSize} color={colors.fg} />
        </Animated.View>
      ) : (
        <Icon size={sz.iconSize} color={colors.fg} />
      )}
      <Text
        style={{
          color: colors.fg,
          fontSize: sz.fontSize,
          fontFamily: ralewayFamily("600"), fontWeight: "600",
          lineHeight: sz.fontSize * 1.1,
          includeFontPadding: false,
        }}
        numberOfLines={1}
      >
        {displayLabel}
      </Text>
    </>
  );

  if (isTappable) {
    // Hit-slop pushes the 32pt visible target to a 44pt accessible target
    // (WCAG 2.5.5) — same contract as the web Button + StatusPill specs.
    return (
      <Pressable
        ref={ref as React.Ref<View>}
        onPress={onPress}
        hitSlop={{ top: 6, bottom: 6, left: 0, right: 0 }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? displayLabel}
        style={({ pressed }) => [baseStyle, pressed ? styles.pressed : null]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      ref={ref}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? displayLabel}
      style={baseStyle}
    >
      {content}
    </View>
  );
});

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});

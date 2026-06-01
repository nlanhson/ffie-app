// FFIE Button — React Native port of
// /Users/du-mac/FFIE/design-system-preview/src/components/ui/Button.tsx
// (and project/design-system/components/Button.md).
//
// v0.1 — covers what the onboarding flow needs:
//   - variants: primary / secondary / ghost
//   - sizes: md (48pt P1 default) + lg (56pt hero CTA)
//   - states: default / pressed / disabled / loading
//   - fullWidth + iconLeading
// Deferred until needed:
//   - variant=destructive (no destructive action in onboarding)
//   - confirm modes (undo / hold)
//   - iconOnly / iconTrailing
//   - sm size (back-office only)

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  type GestureResponderEvent,
  type ViewStyle,
} from "react-native";
import { Loader2, type LucideIcon } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

export type ButtonProps = {
  children: React.ReactNode;
  onPress: (e?: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  iconLeading?: LucideIcon;
  themeName?: ThemeName;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const SIZE_TABLE: Record<ButtonSize, { height: number; padX: number; iconSize: number; fontSize: number }> = {
  md: { height: 48, padX: primitives.space[4], iconSize: 18, fontSize: 16 }, // P1 floor
  lg: { height: 56, padX: primitives.space[5], iconSize: 20, fontSize: 17 }, // hero CTA
};

type VariantColors = { bg: string; bgPressed: string; fg: string; border: string | null };

function resolveVariant(variant: ButtonVariant, themeName: ThemeName): VariantColors {
  const t = themes[themeName];
  switch (variant) {
    case "primary":
      return {
        bg: t.action.primary.bg,
        bgPressed: t.action.primary.bgPressed,
        fg: t.action.primary.fg,
        border: null,
      };
    case "secondary":
      return {
        bg: t.action.secondary.bg === "transparent" ? "transparent" : t.action.secondary.bg,
        bgPressed: t.action.secondary.bgPressed,
        fg: t.action.secondary.fg,
        border: t.action.secondary.border,
      };
    case "ghost":
      return {
        bg: "transparent",
        bgPressed: t.surface.subtle,
        fg: t.text.muted,
        border: null,
      };
  }
}

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  iconLeading,
  themeName = "light",
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const sz = SIZE_TABLE[size];
  const colors = resolveVariant(variant, themeName);
  const isInteractive = !disabled && !loading;

  // Spinner rotation for loading state — motion.duration.loop = 1000ms.
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!loading) return;
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
  }, [loading, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  const baseStyle = ({ pressed }: { pressed: boolean }): ViewStyle => ({
    height: sz.height,
    paddingHorizontal: sz.padX,
    minWidth: fullWidth ? undefined : 80,
    width: fullWidth ? "100%" : undefined,
    backgroundColor: pressed && isInteractive ? colors.bgPressed : colors.bg,
    borderRadius: 0,
    borderWidth: colors.border ? 1 : 0,
    borderColor: colors.border ?? "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: primitives.space[2],
    opacity: disabled ? primitives.opacity.disabled : 1,
    transform: pressed && isInteractive ? [{ scale: 0.97 }] : [{ scale: 1 }],
  });

  const Icon = iconLeading;

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={baseStyle}
    >
      {loading ? (
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Loader2 size={sz.iconSize} color={colors.fg} />
        </Animated.View>
      ) : Icon ? (
        <Icon size={sz.iconSize} color={colors.fg} />
      ) : null}
      <Text
        style={{
          color: colors.fg,
          fontSize: sz.fontSize,
          fontFamily: ralewayFamily("600"), fontWeight: "600",
          letterSpacing: -0.1,
          opacity: loading ? primitives.opacity.disabled : 1,
        }}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}


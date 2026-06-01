// BottomTabBar — home-rolled tab strip.
//
// Why home-rolled, not react-navigation:
//   - v1 has 1 main screen per role; bottom tabs are pure chrome
//   - keeps the design system as the single source of truth (tokens, theme)
//   - swap-in to react-navigation later is a contract-preserving move:
//     the same `tabs` + `activeKey` + `onSelect` shape lives behind
//     a Navigator wrapper.
//
// Contract:
//   - tabs: ordered config; the bar renders in this order, equal widths
//   - activeKey: drives active-state styling
//   - onSelect: called with the tapped tab's key
//
// Motion (per emil-design-eng): no entry animation on tabs — they are
// chrome, not content. The only animation is a 100ms scale-down on press
// (handled by Pressable's pressed prop). No bouncy active indicator.
//
// Accessibility:
//   - role="tab" + selected state per WCAG
//   - ≥48pt touch target (height: 56 + safe area inset)
//   - label is read by VoiceOver even though it's also visible
//   - active state communicated by color + weight (NOT color alone)
//     so it survives color-blind users (per accessibility-decisions)

import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import type { AnyTabConfig, TabKey } from "@/navigation/tabs";

export type BottomTabBarProps = {
  tabs: ReadonlyArray<AnyTabConfig>;
  activeKey: TabKey;
  onSelect: (key: TabKey) => void;
  themeName?: ThemeName;
};

export function BottomTabBar({
  tabs,
  activeKey,
  onSelect,
  themeName = "light",
}: BottomTabBarProps) {
  const t = themes[themeName];
  const insets = useSafeAreaInsets();

  // Extra breathing room above and below the tab row, on top of the device's
  // bottom safe-area inset (home indicator).
  const VERTICAL_PADDING = 12;

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: t.surface.default,
          borderTopColor: t.border.subtle,
          paddingTop: VERTICAL_PADDING,
          paddingBottom: insets.bottom + VERTICAL_PADDING,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={isActive}
            themeName={themeName}
            onPress={() => onSelect(tab.key)}
          />
        );
      })}
    </View>
  );
}

function TabButton({
  tab,
  isActive,
  themeName,
  onPress,
}: {
  tab: AnyTabConfig;
  isActive: boolean;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const Icon = tab.icon;

  // iOS tab bars communicate the active tab with the accent TINT. We add a
  // weight difference on the label as the non-colour signal (WCAG 1.4.1) so
  // colour-blind users still perceive selection without a Material-style dot.
  const fg = isActive ? t.brand.accent : t.text.muted;
  const weight: "600" | "400" = isActive ? "600" : "400";

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={({ pressed }): ViewStyle => ({
        ...styles.tab,
        opacity: pressed ? 0.5 : 1,
      })}
      hitSlop={4}
    >
      <Icon size={26} color={fg} strokeWidth={isActive ? 2.2 : 1.8} />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 10,
          fontFamily: ralewayFamily(weight),
          fontWeight: weight,
          color: fg,
          marginTop: 3,
          letterSpacing: 0,
        }}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth, // iOS-thin separator
  },
  tab: {
    flex: 1,
    minHeight: 50, // iOS tab-bar height; still ≥44 hit target with hitSlop
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
});

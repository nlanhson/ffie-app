// QuickAccessGrid — the "Quick access" 2×2 block at the top of the Home hub.
//
// Four shortcut cards (Documentation / Tools FFIE / Partners / Agenda) that
// jump straight to the load-bearing surfaces. Each is a raised white card with
// a thin outline icon, a bold title, and a muted one-line descriptor. Cards
// route via the shared `onNavigate` target union (resolved to a tab/action by
// the shell) so this stays a presentational, data-driven block.
//
// To change the shortcuts, edit SHORTCUTS below — order is row-major (top-left,
// top-right, bottom-left, bottom-right).

import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import {
  CalendarDays,
  FileText,
  Landmark,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { CARD_SHADOW, useHomeColors } from "./homeColors";
import type { HomeNavTarget } from "@/screens/HomeScreen";

const GRID_GAP = 12;

type Shortcut = {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  target: HomeNavTarget;
};

const SHORTCUTS: ReadonlyArray<Shortcut> = [
  { key: "docs", icon: FileText, title: "Documentation", subtitle: "Standards & Guides", target: "docs" },
  { key: "tools", icon: Wrench, title: "Tools FFIE", subtitle: "Calculations & aids", target: "tools" },
  { key: "partners", icon: Landmark, title: "Partners", subtitle: "Ecosystem & Lab", target: "partners" },
  { key: "agenda", icon: CalendarDays, title: "Agenda", subtitle: "Events", target: "agenda" },
];

export function QuickAccessGrid({
  themeName = "light",
  onNavigate,
}: {
  themeName?: ThemeName;
  onNavigate?: (target: HomeNavTarget) => void;
}) {
  // Render row-major in pairs so each row stretches its two cards to equal
  // height regardless of how the descriptor wraps.
  const rows: Shortcut[][] = [SHORTCUTS.slice(0, 2), SHORTCUTS.slice(2, 4)];

  return (
    <View style={{ paddingHorizontal: GUTTER, rowGap: GRID_GAP }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row", columnGap: GRID_GAP }}>
          {row.map((item) => (
            <ShortcutCard
              key={item.key}
              item={item}
              themeName={themeName}
              onPress={() => onNavigate?.(item.target)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function ShortcutCard({
  item,
  themeName,
  onPress,
}: {
  item: Shortcut;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const Icon = item.icon;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint={item.subtitle}
      style={({ pressed }): ViewStyle => ({
        flex: 1,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: 1,
        borderColor: c.cardBorder,
        padding: 16,
        minHeight: 104,
        opacity: pressed ? 0.85 : 1,
        ...(CARD_SHADOW as ViewStyle),
      })}
    >
      {/* Icon sits in a rounded-square tile with a border + faint brand tint —
          the same treatment as the Public Space cards, adapted to the white
          card (navy glyph on a light navy wash instead of white-on-gradient).
          The glyph is dimmed (alpha < 1) so the dark navy stroke doesn't
          over-pull the eye against the pale tile. */}
      <View
        style={[
          styles.iconTile,
          {
            backgroundColor: tint(t.brand.institutional, 0.07),
            borderColor: tint(t.brand.institutional, 0.18),
          },
        ]}
      >
        <Icon size={22} color={tint(t.brand.institutional, 0.68)} strokeWidth={1.8} />
      </View>
      <Text
        numberOfLines={1}
        style={{
          color: t.text.body,
          fontSize: 15,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: -0.2,
        }}
      >
        {item.title}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color: t.text.muted,
          fontSize: 12.5,
          fontFamily: ralewayFamily("400"),
          marginTop: 2,
        }}
      >
        {item.subtitle}
      </Text>
    </Pressable>
  );
}

// Token colour at reduced alpha — lets the navy icon tile read as a faint
// brand wash + border on the white card (tokens carry no alpha variants).
function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: primitives.radii.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
});

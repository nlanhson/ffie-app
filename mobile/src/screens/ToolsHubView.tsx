// ToolsHubView — the "Tools" segment of the Tools tab (the default landing).
//
// Mirrors the client "Tools FFIE" mockup: a launcher grid of tool tiles grouped
// into two sections ("Calculations & sizing", "Help with compliance"). The
// tiles REUSE the Home hub's card treatment (raised white card with a soft
// elevation, a rounded-square icon tile carrying a faint brand-navy wash, a bold
// title) — see components/home/QuickAccessGrid + homeColors. The page itself
// takes the Home dashboard look too (recessed grey behind the cards), since the
// white-card chrome reads against grey, not against the list screens' white.
//
// Tile behaviour (data lives in data/tools.ts):
//   • Power calculation → the working Power & current sheet (members only).
//   • Falling tension   → the working Voltage drop sheet (members only).
//   • everything else   → rendered DISABLED: a flat, greyed, non-tappable tile
//     with a "Coming soon" caption. FFIE hasn't shipped these tools yet, so the
//     tile honestly reads as unavailable rather than faking a destination
//     (CLAUDE.md). The caption (not dimming alone) carries the meaning, so the
//     state survives for colour-blind / low-vision users.
//   A guest tapping a LIVE calculator tile still gets a calm "members only"
//   sheet — the app's gating convention (inform & invite, never 403), distinct
//   from the coming-soon state above.

import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { CARD_SHADOW, useHomeColors } from "@/components/home/homeColors";
import { canAccess, useRole } from "@/auth/roleContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PowerCalculatorSheet, VoltageDropSheet } from "./CalculatorsView";
import { TOOL_SECTIONS, type ToolSection, type ToolTile } from "@/data/tools";
import type { CalculatorKind } from "@/data/calculators";

// Gap between tiles, matching the Home QuickAccess grid.
const GRID_GAP = 12;

export function ToolsHubView({ themeName = "light" }: { themeName?: ThemeName }) {
  const { role } = useRole();
  const isMember = canAccess(role, "member-only");

  // Which working calculator sheet is open (members only); and the title of the
  // calculator a guest tapped (null = closed), which opens the members-only
  // gate. "Coming soon" tiles aren't interactive, so they need no state.
  const [openKind, setOpenKind] = useState<CalculatorKind | null>(null);
  const [gatedTitle, setGatedTitle] = useState<string | null>(null);

  // Only the live calculator tiles are pressable; disabled "soon" tiles never
  // call this.
  const onTilePress = (tile: ToolTile) => {
    if (tile.action.type !== "calculator") return;
    // Calculators are member-only — gate guests with a calm sheet rather than
    // opening the tool.
    if (!isMember) {
      setGatedTitle(tile.title);
      return;
    }
    setOpenKind(tile.action.kind);
  };

  return (
    <>
      <View style={{ paddingTop: 2 }}>
        {TOOL_SECTIONS.map((section) => (
          <ToolSectionBlock
            key={section.id}
            section={section}
            themeName={themeName}
            onTilePress={onTilePress}
          />
        ))}
      </View>

      {/* Working calculators — reused from CalculatorsView so the tool is
          identical wherever it's launched from. */}
      <PowerCalculatorSheet
        visible={openKind === "power"}
        themeName={themeName}
        onClose={() => setOpenKind(null)}
      />
      <VoltageDropSheet
        visible={openKind === "voltage-drop"}
        themeName={themeName}
        onClose={() => setOpenKind(null)}
      />

      {/* Members-only invite for a guest who tapped a (live) calculator tile. */}
      <MembersOnlySheet title={gatedTitle} themeName={themeName} onClose={() => setGatedTitle(null)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// ToolSectionBlock — one titled section: an uppercase header and its tiles laid
// out two-up. Tiles render in rows of two so paired cards stretch to the same
// height (matching the Home QuickAccess grid), regardless of how the label wraps.
// ---------------------------------------------------------------------------
function ToolSectionBlock({
  section,
  themeName,
  onTilePress,
}: {
  section: ToolSection;
  themeName: ThemeName;
  onTilePress: (tile: ToolTile) => void;
}) {
  const t = themes[themeName];

  const rows: ToolTile[][] = [];
  for (let i = 0; i < section.tiles.length; i += 2) {
    rows.push(section.tiles.slice(i, i + 2));
  }

  return (
    <View style={{ paddingHorizontal: GUTTER, marginTop: 18 }}>
      <Text
        accessibilityRole="header"
        style={{
          color: t.text.muted,
          fontSize: 12.5,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {section.title}
      </Text>

      <View style={{ rowGap: GRID_GAP }}>
        {rows.map((row, i) => (
          <View key={i} style={{ flexDirection: "row", columnGap: GRID_GAP }}>
            {row.map((tile) => (
              <ToolCard
                key={tile.id}
                tile={tile}
                themeName={themeName}
                onPress={() => onTilePress(tile)}
              />
            ))}
            {/* Keep a lone trailing card half-width if a section is odd. */}
            {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ToolCard — a single launcher tile. Live (calculator) tiles reuse the Home
// ShortcutCard treatment: raised white card, faint brand-navy icon tile, bold
// title. "Coming soon" tiles render DISABLED instead: flat (no elevation),
// greyed, non-tappable, with a "Coming soon" caption that carries the meaning
// without relying on dimming alone.
// ---------------------------------------------------------------------------
function ToolCard({
  tile,
  themeName,
  onPress,
}: {
  tile: ToolTile;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const Icon = tile.icon;

  // Not-yet-built tools: a plain (non-Pressable) View so it can't be tapped,
  // greyed and flat, captioned "Coming soon".
  if (tile.action.type === "soon") {
    return (
      <View
        accessibilityLabel={`${tile.title}. Coming soon.`}
        accessibilityState={{ disabled: true }}
        style={{
          flex: 1,
          backgroundColor: c.cardBg,
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: c.cardBorder,
          padding: 16,
          minHeight: 116,
          opacity: 0.6,
        }}
      >
        {/* Muted, neutral icon tile (no brand wash) — reads as inactive. */}
        <View style={[styles.iconTile, { backgroundColor: t.surface.subtle, borderColor: t.border.subtle }]}>
          <Icon size={22} color={t.text.muted} strokeWidth={1.9} />
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: t.text.muted,
            fontSize: 15,
            lineHeight: 20,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.2,
          }}
        >
          {tile.title}
        </Text>
        <Text
          style={{
            color: t.text.muted,
            fontSize: 11,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          Coming soon
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tile.title}
      accessibilityHint="Opens the calculator"
      style={({ pressed }): ViewStyle => ({
        flex: 1,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        borderWidth: 1,
        borderColor: c.cardBorder,
        padding: 16,
        minHeight: 116,
        opacity: pressed ? 0.85 : 1,
        ...(CARD_SHADOW as ViewStyle),
      })}
    >
      {/* Icon tile — same faint brand-navy wash + border as the Home cards.
          The glyph itself is dimmed (alpha < 1) so the dark navy stroke doesn't
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
        numberOfLines={2}
        style={{
          color: t.text.body,
          fontSize: 15,
          lineHeight: 20,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: -0.2,
        }}
      >
        {tile.title}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// MembersOnlySheet — the calm gate shown when a guest taps a (live) calculator
// tile: the tool's title, an honest one-liner, and a "Members only" pill. A
// page sheet matching the calculators' own modals. (`title` null = closed.)
//
// Reduced motion (P5): snaps in with no slide when the OS setting is on.
// ---------------------------------------------------------------------------
function MembersOnlySheet({
  title,
  themeName,
  onClose,
}: {
  title: string | null;
  themeName: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const reduceMotion = useReducedMotion();

  return (
    <Modal
      visible={title != null}
      animationType={reduceMotion ? "none" : "slide"}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
        {/* Close affordance — top-trailing X (≥44pt touch target). */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 8, paddingTop: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <X size={26} color={t.text.body} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: GUTTER, paddingTop: 8 }}>
          <Text
            accessibilityRole="header"
            style={{
              color: t.text.body,
              fontSize: 28,
              lineHeight: 34,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              letterSpacing: -0.6,
            }}
          >
            {title}
          </Text>
          <Text style={{ color: t.text.muted, fontSize: 15, lineHeight: 23, marginTop: 12 }}>
            This tool is reserved for FFIE members. Sign in or join the
            federation to use it.
          </Text>

          {/* Status pill — text carries the meaning, not colour alone (P). */}
          <View
            style={{
              marginTop: 18,
              alignSelf: "flex-start",
              backgroundColor: t.surface.subtle,
              borderWidth: 1,
              borderColor: t.border.subtle,
              borderRadius: primitives.radii.full,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color: t.brand.accent,
                fontSize: 12,
                fontFamily: ralewayFamily("700"),
                fontWeight: "700",
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              Members only
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Token colour at reduced alpha — the same helper the Home cards use to render
// the navy icon tile as a faint brand wash + border (tokens carry no alpha
// variants). Kept local to avoid widening the Home module's surface.
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

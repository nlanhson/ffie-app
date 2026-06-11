// SavedBadge — the document library's two-state offline indicator.
//
// Scope: the visible surface of FFIE-DOC-03 ("download documents to keep
// locally") + Principle 2 (offline-first). Deliberately just two states —
// saved / not saved — not a richer cache taxonomy (out of scope).
//
// Accessibility (Principle 4): status is carried by ICON + TEXT, never colour
// alone. "Saved" reads as a check on a subtle green; "Not saved" as a download
// glyph on a neutral surface.

import React from "react";
import { Text, View } from "react-native";
import { CheckCircle2, ArrowDownToLine } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

export function SavedBadge({
  saved,
  themeName = "light",
  size = "sm",
}: {
  saved: boolean;
  themeName?: ThemeName;
  size?: "sm" | "md";
}) {
  const t = themes[themeName];
  const sz =
    size === "md"
      ? { height: 24, icon: 14, font: 12, padX: 8 }
      : { height: 20, icon: 12, font: 11, padX: 6 };

  // Saved → subtle success tint; Not saved → neutral surface. Both pair the
  // colour with an icon + word so the meaning survives without colour.
  const palette = saved
    ? { bg: t.feedback.subtle.success.bg, fg: t.feedback.subtle.success.fg, border: t.feedback.subtle.success.border }
    : { bg: t.surface.subtle, fg: t.text.muted, border: t.border.default };

  const Icon = saved ? CheckCircle2 : ArrowDownToLine;
  const label = saved ? "Saved" : "Not saved";

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={saved ? "Saved offline" : "Not saved offline"}
      style={{
        height: sz.height,
        paddingHorizontal: sz.padX,
        backgroundColor: palette.bg,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: primitives.radii.full,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
        alignSelf: "flex-start",
      }}
    >
      <Icon size={sz.icon} color={palette.fg} />
      <Text
        style={{
          color: palette.fg,
          fontSize: sz.font,
          fontFamily: ralewayFamily("600"),
          fontWeight: "600",
          lineHeight: sz.font * 1.1,
          includeFontPadding: false,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

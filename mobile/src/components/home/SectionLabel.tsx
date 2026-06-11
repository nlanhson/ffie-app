// SectionLabel — the small uppercase eyebrow that heads each Home dashboard
// section ("QUICK ACCESS", "PUBLIC SPACE", "RECENT NEWS"). Optional trailing
// "See all" action on the right for sections that have an overflow surface.
//
// Marked as an accessibility header so screen-reader users can navigate the
// dashboard section-by-section (the visual is a muted eyebrow, but it IS the
// structural heading for the group beneath it).

import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";

export function SectionLabel({
  title,
  themeName = "light",
  actionLabel,
  onActionPress,
}: {
  title: string;
  themeName?: ThemeName;
  /** Optional right-aligned action (e.g. "See all"). */
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  const t = themes[themeName];
  const hasAction = actionLabel != null && onActionPress != null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: GUTTER,
        marginBottom: 12,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{
          color: t.text.muted,
          fontSize: 12,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: 0.7,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>

      {hasAction ? (
        <Pressable
          onPress={onActionPress}
          // Lift the small text target to a >=44pt hit area (WCAG 2.5.5).
          hitSlop={{ top: 14, bottom: 14, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}, ${title}`}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 1,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text
            style={{
              color: t.brand.accent,
              fontSize: 13,
              fontFamily: ralewayFamily("600"),
              fontWeight: "600",
            }}
          >
            {actionLabel}
          </Text>
          <ChevronRight size={15} color={t.brand.accent} strokeWidth={2.4} />
        </Pressable>
      ) : null}
    </View>
  );
}

// AppHeader — the persistent navy "branded bar" shown at the top of every main
// tab page EXCEPT Home (Home has its own richer hero, HomeHeader).
//
// It's the same brand surface as the Home hero, reduced to a pinned nav bar:
//   [logo chip]  Page title ……………  [actions]
// where actions are role-aware:
//   - member → notifications (bell) · profile
//   - guest  → join
//
// Rendered ONCE by the shell (App.tsx), above the scrolling tab content, so it
// stays put as you switch tabs and keeps the status bar over navy (light icons
// stay legible no matter how far a list scrolls). The greeting / identity block
// is deliberately Home-only — other pages just show their title here.
//
// Like FFIELogo / HomeHeader, the navy + on-colors are fixed brand constants,
// not theme tokens: this is a brand surface, not a themed surface.

import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, UserPlus, type LucideIcon } from "lucide-react-native";
import { primitives } from "@tokens";
import { displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { HEADER_SURFACE } from "@/theme/brandHeader";

// --- fixed brand-surface colors (shared with HomeHeader) -------------------
const WHITE = primitives.colors.white;

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const PRESS_BG = withAlpha(WHITE, 0.12); // icon-button pressed tint
const CIRCLE_BG = withAlpha(WHITE, 0.2); // resting fill behind the profile glyph — visible enough to read as a button and anchor the right edge at the gutter (mirrors the white logo chip on the left)

const TOP_GAP = Platform.OS === "android" ? 14 : 12; // kept identical to HomeHeader
const LOGO_SIZE = 42; // matches the Home hero logo

export type AppHeaderProps = {
  title: string;
  variant: "member" | "guest";
  hasUnread?: boolean;
  /** Member: open notifications (bell). Omit to hide the bell. */
  onPressNotifications?: () => void;
  /** Open search. Omit to hide the search button. */
  onPressSearch?: () => void;
  /** Member: open the personal Profile page. Omit to hide the profile button. */
  onPressProfile?: () => void;
  /** Guest: open the join flow. Omit to hide the join button. */
  onPressJoin?: () => void;
};

// A plain top-bar icon button (white glyph on the brand surface). hitSlop lifts
// the 40pt visible disc to a ≥44pt accessible target.
function IconButton({
  icon: Icon,
  label,
  hint,
  onPress,
  filled = false,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  onPress?: () => void;
  /** Show a resting translucent circle behind the glyph (profile action). */
  filled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconBtn,
        filled ? styles.iconBtnFilled : null,
        pressed && onPress ? { backgroundColor: PRESS_BG } : null,
      ]}
    >
      <Icon size={22} color={WHITE} strokeWidth={2} />
    </Pressable>
  );
}

export function AppHeader({
  title,
  variant,
  hasUnread = false,
  onPressNotifications,
  onPressSearch,
  onPressProfile,
  onPressJoin,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const isMember = variant === "member";

  return (
    <View style={[styles.root, { paddingTop: insets.top + TOP_GAP }]}>
      <View style={styles.logoChip} accessibilityRole="image" accessibilityLabel="FFIE">
        <FFIELogo size={LOGO_SIZE} themeName="light" />
      </View>

      <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.actions}>
        {isMember && onPressProfile ? (
          <IconButton
            icon={User}
            label="My profile"
            hint="Opens your profile and settings"
            onPress={onPressProfile}
            filled
          />
        ) : null}
        {!isMember && onPressJoin ? (
          <IconButton
            icon={UserPlus}
            label="Join the FFIE"
            hint="Opens membership information"
            onPress={onPressJoin}
            filled
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: HEADER_SURFACE,
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
    columnGap: 10,
  },
  logoChip: {
    backgroundColor: WHITE,
    borderRadius: 6, // between radii.sm (4) and radii.md (8) — no exact token
    padding: 5,
  },
  title: {
    flex: 1, // take the middle; truncate before the actions
    color: WHITE,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    fontSize: 22,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 2,
    // Trailing action is a filled circle; align its outer edge to the gutter so
    // the right padding mirrors the logo chip on the left (matches HomeHeader).
    marginRight: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: primitives.radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnFilled: {
    backgroundColor: CIRCLE_BG,
  },
});

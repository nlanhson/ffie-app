// Home tab — the app's landing surface (first bottom-tab, both roles).
//
// Opens on the navy "hero" header (HomeHeader): the FFIE lockup, top-right
// actions (notifications + search), and a greeting + identity block (member
// name + status pill, or a guest welcome + join CTA). Beneath it, a lifted
// grey "dashboard sheet" (rounded top corners, pulled up over the navy) hosts
// the hub content:
//   • Quick access — a 2×2 grid of shortcut cards to the load-bearing tabs
//   • Public space — the two public gradient cards (Find a pro / Our trades)
//     + the "member of the FFB" affiliation card
//   • Recent news  — a horizontal teaser rail of the newest articles
//
// The header is a fixed navy brand surface that bleeds up behind the status
// bar, so this screen does NOT use SafeAreaView for the top edge — HomeHeader
// consumes the top inset itself. A status-bar-height navy layer sits behind
// the scroll view so a top-overscroll bounce reveals navy (not grey), while
// the dashboard background stays grey below.
//
// Navigation: cards report an abstract `HomeNavTarget`; the shell (App.tsx)
// resolves each to a tab switch or action, so this screen stays presentational
// and the home → tab routing lives next to the tab state.

import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { primitives, themes, type ThemeName } from "@tokens";
import { useRole } from "@/auth/roleContext";
import { HomeHeader } from "@/components/home/HomeHeader";
import { SectionLabel } from "@/components/home/SectionLabel";
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid";
import { PublicSpaceCards } from "@/components/home/PublicSpaceCards";
import { FFBMembershipCard } from "@/components/home/FFBMembershipCard";
import { RecentNews } from "@/components/home/RecentNews";
import { SHEET, useHomeColors } from "@/components/home/homeColors";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import { currentMember } from "@/data/member";

// Backstop behind the lifted dashboard sheet — matches HomeHeader's surface.
const NAVY = HEADER_SURFACE;

// Abstract destinations a Home card can request. The shell maps each to a real
// tab/action (e.g. "docs" → Library tab, "find-pro" → federation directory),
// keeping this screen decoupled from the navigation model.
export type HomeNavTarget =
  | "docs"
  | "tools"
  | "partners"
  | "agenda"
  | "find-pro"
  | "trades"
  | "news";

export function HomeScreen({
  themeName = "light",
  onOpenNotifications,
  onOpenSearch,
  onOpenProfile,
  onJoin,
  onNavigate,
}: {
  themeName?: ThemeName;
  /** Member: open the notifications screen (bell). */
  onOpenNotifications?: () => void;
  /** Open search. */
  onOpenSearch?: () => void;
  /** Member: open the personal Profile page (tap identity block). */
  onOpenProfile?: () => void;
  /** Guest: open the membership / join flow. */
  onJoin?: () => void;
  /** Route a dashboard card to a tab/action (resolved by the shell). */
  onNavigate?: (target: HomeNavTarget) => void;
}) {
  const c = useHomeColors(themeName);
  const { role } = useRole();
  const variant = role === "member" || role === "admin" ? "member" : "guest";

  // The FFB affiliation card opens the federation's site in the in-app browser
  // (page sheet), matching the News / Trades external-link readers.
  const openFFB = () => {
    const t = themes[themeName];
    WebBrowser.openBrowserAsync("https://www.ffbatiment.fr", {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: t.brand.accent,
      toolbarColor: t.surface.default,
      dismissButtonStyle: "close",
    }).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Light status-bar content (clock / signal) over the navy hero. */}
      <StatusBar style="light" />

      {/* Navy backstop behind the status bar so a top-overscroll bounce
          reveals navy rather than the grey page. Sits under the scroll
          content, which covers it at rest. */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400, backgroundColor: NAVY }}
      />

      {/* contentInsetAdjustmentBehavior="never": the navy header applies the
          top safe-area inset itself (insets.top padding). Without this, iOS
          ALSO auto-insets the scroll content for the safe area, double-counting
          it and pushing the header down with an empty navy gap above. */}
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          themeName={themeName}
          variant={variant}
          member={currentMember}
          hasUnread
          onPressNotifications={onOpenNotifications}
          onPressSearch={onOpenSearch}
          onPressIdentity={onOpenProfile}
          onPressJoin={onJoin}
        />

        {/* Dashboard sheet — lifted over the navy with rounded top corners. The
            navy backstop above shows through the corners for the "sheet rising
            over the hero" look. */}
        <View
          style={{
            flex: 1,
            backgroundColor: c.pageBg,
            borderTopLeftRadius: SHEET.radius,
            borderTopRightRadius: SHEET.radius,
            marginTop: -SHEET.lift,
            paddingTop: SHEET.padTop,
            paddingBottom: SHEET.padBottom,
          }}
        >
          {/* Quick access — shortcut grid */}
          <View style={{ marginBottom: 28 }}>
            <SectionLabel title="Quick access" themeName={themeName} />
            <QuickAccessGrid themeName={themeName} onNavigate={onNavigate} />
          </View>

          {/* Public space — gradient entry points + FFB affiliation */}
          <View style={{ marginBottom: 28 }}>
            <SectionLabel title="Public space" themeName={themeName} />
            <PublicSpaceCards themeName={themeName} onNavigate={onNavigate} />
            <View style={{ height: 12 }} />
            <FFBMembershipCard themeName={themeName} onPress={openFFB} />
          </View>

          {/* Recent news — horizontal teaser rail */}
          <View>
            <SectionLabel
              title="Recent news"
              themeName={themeName}
              actionLabel="See all"
              onActionPress={() => onNavigate?.("news")}
            />
            <RecentNews
              themeName={themeName}
              onPressArticle={() => onNavigate?.("news")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

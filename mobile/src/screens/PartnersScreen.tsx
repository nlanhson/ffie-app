// Partners tab — the federation's partner showcase, organized into three
// segments under the persistent app header: Ecosystem, Lab_FFIE and Partners.
// Each segment is a set of grouped iOS-HIG lists (e.g. Distributors,
// Manufacturers) of brand rows: a logo chip, the partner name, a one-line
// descriptor, and a chevron that opens the partner's official site in the
// native in-app browser (expo-web-browser → SFSafariViewController on iOS /
// Chrome Custom Tabs on Android, presented as a page sheet). The Lab_FFIE
// segment closes with an explanatory "About the Lab_FFIE" card.
//
// The screen is data-driven: the segments, their sections, and every row come
// from PARTNER_TABS in data/partners.ts. To change what's listed (or add a
// segment / section), edit that data file, not this screen. The matching
// loading skeleton lives in components/skeletons/PartnersSkeleton.tsx — keep
// the two in step when the layout changes.

import React, { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import * as WebBrowser from "expo-web-browser";
import {
  PARTNER_TABS,
  type PartnerEntry,
  type PartnerLogo,
  type PartnerNote,
  type PartnerTabKey,
} from "@/data/partners";
import { ralewayFamily } from "@/theme/fonts";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import { GUTTER, InsetGroup, useGroupedColors } from "@/components/ui/ios";

// Leading brand-logo chip size. A touch larger than the old monogram (38) so
// the wordmark reads, matching the mockup's logo tiles.
const TILE = 46;

// Segments for the control, in page order, derived from the data.
const SEGMENT_OPTIONS: { key: PartnerTabKey; label: string }[] = PARTNER_TABS.map(
  (t) => ({ key: t.key, label: t.label }),
);

// PartnerLogoTile — stands in for a partner's real logo: a tinted tile carrying
// the brand wordmark, scaled to fit. A hairline border keeps the chip readable
// against the card: on the light theme it's drawn for light/white chips
// (logo.outlined) that would otherwise melt into the white card; on the dark /
// sunlight themes it's drawn for every chip (a light/strong edge) so dark chips
// separate from the dark or bordered card. Decorative: the row's accessibility
// label already names the partner, so the tile is hidden from assistive tech.
function PartnerLogoTile({ logo, themeName }: { logo: PartnerLogo; themeName: ThemeName }) {
  const borderColor =
    themeName === "dark"
      ? "rgba(255,255,255,0.16)"
      : themeName === "sunlight"
        ? "rgba(0,0,0,0.30)"
        : "rgba(17,24,39,0.12)";
  const showBorder = logo.outlined || themeName !== "light";
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: TILE,
        height: TILE,
        borderRadius: 11,
        backgroundColor: logo.bg,
        borderWidth: showBorder ? StyleSheet.hairlineWidth * 2 : 0,
        borderColor,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        overflow: "hidden",
      }}
    >
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        style={{
          color: logo.fg,
          fontSize: 12.5,
          lineHeight: 13.5,
          textAlign: "center",
          fontFamily: ralewayFamily("800"),
          fontWeight: "800",
          letterSpacing: -0.3,
        }}
      >
        {logo.text}
      </Text>
    </View>
  );
}

// PartnerRow — one grouped-list row: logo chip + bold name + muted descriptor +
// chevron. The hairline separator is inset past the chip so it aligns under the
// text (the iOS grouped-list detail). Tapping opens the partner's site; rows
// without a URL render the same but aren't tappable (no chevron).
function PartnerRow({
  entry,
  themeName,
  isLast,
  onPress,
}: {
  entry: PartnerEntry;
  themeName: ThemeName;
  isLast: boolean;
  onPress?: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const Wrapper: typeof Pressable | typeof View = onPress ? Pressable : View;
  const separatorInset = GUTTER + TILE + 12;

  return (
    <Wrapper
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${entry.name}. ${entry.descriptor}`}
      accessibilityHint={onPress ? "Opens the partner's website in the app" : undefined}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => ({
        // Pressed tint steps a notch darker than the grey card so feedback
        // survives on grey-on-white elements.
        backgroundColor: pressed && onPress ? t.border.subtle : "transparent",
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 12,
          paddingHorizontal: GUTTER,
          minHeight: 64, // taller than the 48 floor — the chip + two lines need room
          paddingVertical: 12,
        }}
      >
        <PartnerLogoTile logo={entry.logo} themeName={themeName} />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              color: t.text.body,
              fontFamily: ralewayFamily("700"),
              fontWeight: "700",
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {entry.name}
          </Text>
          <Text
            style={{ fontSize: 13, color: t.text.muted, marginTop: 2, lineHeight: 17 }}
            numberOfLines={1}
          >
            {entry.descriptor}
          </Text>
        </View>

        {onPress ? (
          <ChevronRight size={18} color={t.text.muted} style={{ opacity: 0.5 }} />
        ) : null}
      </View>

      {!isLast ? (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: c.separator,
            marginLeft: separatorInset,
          }}
        />
      ) : null}
    </Wrapper>
  );
}

// AboutCard — the explanatory note under a segment's groups (Lab_FFIE). A
// teal-tinted, brand-aligned info card (subtle.syncing tokens) so it reads as
// "informational", distinct from the tappable partner rows above it.
function AboutCard({ note, themeName }: { note: PartnerNote; themeName: ThemeName }) {
  const t = themes[themeName];
  const tint = t.feedback.subtle.syncing;
  return (
    <View
      style={{
        marginHorizontal: GUTTER,
        marginBottom: 12,
        backgroundColor: tint.bg,
        borderWidth: 1,
        borderColor: tint.border,
        borderRadius: primitives.radii.lg,
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{
          color: t.text.body,
          fontSize: 15,
          fontFamily: ralewayFamily("700"),
          fontWeight: "700",
          letterSpacing: -0.2,
          marginBottom: 6,
        }}
      >
        {note.title}
      </Text>
      <Text style={{ color: t.text.muted, fontSize: 13.5, lineHeight: 20 }}>
        {note.body}
      </Text>
    </View>
  );
}

export function PartnersScreen({ themeName = "light" }: { themeName?: ThemeName }) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const [tab, setTab] = useState<PartnerTabKey>("ecosystem");
  const scrollRef = useRef<ScrollView>(null);

  const activeTab = PARTNER_TABS.find((tt) => tt.key === tab) ?? PARTNER_TABS[0];

  // Open a partner's site in the native in-app browser (page sheet, slides up
  // from the bottom). Dismissing it returns here automatically.
  const openPartner = (entry: PartnerEntry) => {
    if (!entry.url) return;
    WebBrowser.openBrowserAsync(entry.url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: t.brand.accent,
      toolbarColor: t.surface.default,
      dismissButtonStyle: "close",
    }).catch(() => {});
  };

  // Switching segment starts fresh at the top.
  const onChangeTab = (key: PartnerTabKey) => {
    setTab(key);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    // Page title lives in the shared AppHeader (shell); content renders beneath.
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Segment toggle — Ecosystem / Lab_FFIE / Partners. */}
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 6, paddingBottom: 16 }}>
          {/* Selected pill uses the exact brand teal of the app header above it
              (HEADER_SURFACE) so the toggle reads as part of the same branded
              bar rather than a separate accent. */}
          <SegmentedControl
            themeName={themeName}
            value={tab}
            options={SEGMENT_OPTIONS}
            onChange={onChangeTab}
            tint={HEADER_SURFACE}
          />
        </View>

        {/* Each segment's grouped lists, then its optional note card. */}
        {activeTab.groups.map((group) => (
          <InsetGroup key={group.header} header={group.header} themeName={themeName}>
            {group.entries.map((entry, i) => (
              <PartnerRow
                key={entry.id}
                entry={entry}
                themeName={themeName}
                isLast={i === group.entries.length - 1}
                onPress={entry.url ? () => openPartner(entry) : undefined}
              />
            ))}
          </InsetGroup>
        ))}

        {activeTab.note ? <AboutCard note={activeTab.note} themeName={themeName} /> : null}
      </ScrollView>
    </View>
  );
}

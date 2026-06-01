// Become-a-member tab — the "Join FFIE" page.
//
// FFIE's membership model is federated: you join through your *departmental*
// federation, not a single national form. So the page is a directory — a
// subtitle pointing people to their department, then the full list of
// departmental federations as a searchable, grouped-inset list (same
// data-driven pattern as the Library). Each row expands to reveal that
// federation's local contacts (Chairman, Secretary General, phone, address).
//
// Structure:
//   - Large title + subtitle ("go to your departmental federation below")
//   - Departmental federation directory (search + expandable rows, show more)
//   - Eligibility note
//
// Federation contact details come from data/federations.ts. Entries not yet
// filled expand to a clean "details coming" state — nothing fabricated.

import React, { useMemo, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Globe,
  Mail,
  MapPin,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react-native";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Linking,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, semantics, themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { useGroupedColors } from "@/components/ui/ios";
import {
  FEDERATIONS,
  hasContactDetails,
  type Federation,
} from "@/data/federations";

const GUTTER = semantics.spacing.gutter.mobile;

// Top padding for the page content above the safe-area inset. On Android we
// match the Debug chip's offset (its TOP_GAP = 24) so the title lines up with
// it; iOS keeps the tighter 12.
const PAGE_TOP_PADDING = Platform.OS === "android" ? 24 : 12;

// Reduced-motion: read once and subscribe. Gates the chevron spin + the
// expand/collapse height animation so vestibular-sensitive users get an
// instant snap instead of motion (harm prevention, non-negotiable).
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  React.useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (v) => setReduced(v)
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

// ---------------------------------------------------------------------------
// ContactLine — one labelled detail inside an expanded federation. Tappable
// when it resolves to an action (tel:, mailto:, https:).
// ---------------------------------------------------------------------------
function ContactLine({
  icon: Icon,
  value,
  href,
  themeName,
}: {
  icon: LucideIcon;
  value: string;
  href?: string;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  const open = href ? () => Linking.openURL(href).catch(() => {}) : undefined;
  const Wrapper: typeof Pressable | typeof View = open ? Pressable : View;
  return (
    <Wrapper
      onPress={open}
      accessibilityRole={open ? "link" : undefined}
      style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 10 }}
    >
      <Icon size={16} color={t.brand.accent} style={{ marginTop: 2 }} />
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          lineHeight: 20,
          color: t.text.muted,
        }}
      >
        {value}
      </Text>
    </Wrapper>
  );
}

// ---------------------------------------------------------------------------
// FederationRow — accordion row. Area + federation name, with a chevron that
// rotates down when open. Tapping reveals the contact panel.
// ---------------------------------------------------------------------------
function FederationRow({
  federation,
  isLast,
  themeName,
  reducedMotion,
  open,
  onToggle,
}: {
  federation: Federation;
  isLast: boolean;
  themeName: ThemeName;
  reducedMotion: boolean;
  /** Controlled by the parent so only one row is open at a time (accordion). */
  open: boolean;
  onToggle: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  // One progress value (0 = closed, 1 = open) drives the panel height, its
  // fade, and the chevron together. Non-native so we can animate `height`;
  // a single row's worth of JS-driven animation is cheap.
  const progress = React.useRef(new Animated.Value(open ? 1 : 0)).current;
  // Natural height of the panel content, measured off-flow so we can animate
  // the container between 0 and it.
  const [contentHeight, setContentHeight] = useState(0);

  // Drive from the controlled `open` prop — a row may be closed by the parent
  // (when another row opens), not only by its own tap.
  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: reducedMotion ? 0 : primitives.motion.duration.slow,
      easing: Easing.bezier(0.4, 0, 0.2, 1), // standard ease — smooth in/out
      useNativeDriver: false,
    }).start();
  }, [open, reducedMotion, progress]);

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const panelHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });
  // Fade the content over the first ~60% of the travel so it's fully visible
  // before the slide finishes (and gone early on close) — no lingering ghost.
  const panelOpacity = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1, 1],
  });

  const hasDetails = hasContactDetails(federation);
  // No leading visual now — separator + expanded panel align to the gutter.
  const separatorInset = GUTTER;

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${federation.area}. ${federation.name}`}
        accessibilityHint={open ? "Réduire les coordonnées de la fédération" : "Afficher les coordonnées de la fédération"}
        onPress={onToggle}
        style={({ pressed }) => ({
          backgroundColor: pressed ? t.border.subtle : "transparent",
        })}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 12,
            paddingHorizontal: GUTTER,
            minHeight: 48, // P1 touch-target floor
            paddingVertical: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: ralewayFamily("500"),
                fontWeight: "500",
                color: t.text.body,
                letterSpacing: -0.2,
              }}
              numberOfLines={1}
            >
              {federation.area}
            </Text>
            <Text
              style={{ fontSize: 12.5, color: t.text.muted, marginTop: 4, lineHeight: 17 }}
              numberOfLines={1}
            >
              {federation.name}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <ChevronDown size={20} color={t.text.muted} style={{ opacity: 0.6 }} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Expanded contact panel — height-animated reveal. The content is kept
          mounted and measured off-flow (absolute) so the container can slide
          smoothly between 0 and its natural height. */}
      <Animated.View
        style={{ height: panelHeight, opacity: panelOpacity, overflow: "hidden" }}
        pointerEvents={open ? "auto" : "none"}
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? "auto" : "no-hide-descendants"}
      >
        <View
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            paddingLeft: separatorInset,
            paddingRight: GUTTER,
            paddingBottom: 16,
            paddingTop: 2,
            rowGap: 10,
          }}
        >
          {hasDetails ? (
            <View style={{ rowGap: 10 }}>
              {/* Named contacts — role + name, then their email/phone */}
              {federation.members?.map((m, i) => (
                <View key={`${m.role}-${i}`} style={{ rowGap: 6 }}>
                  <Text style={{ fontSize: 13.5, color: t.text.muted, lineHeight: 19 }}>
                    {`${m.role} : `}
                    <Text style={{ fontFamily: ralewayFamily("700"), fontWeight: "700", color: t.text.muted }}>
                      {m.name}
                    </Text>
                  </Text>
                  {m.email ? (
                    <ContactLine
                      icon={Mail}
                      value={m.email}
                      href={`mailto:${m.email}`}
                      themeName={themeName}
                    />
                  ) : null}
                  {m.phone ? (
                    <ContactLine
                      icon={Phone}
                      value={m.phone}
                      href={`tel:${m.phone.replace(/\s+/g, "")}`}
                      themeName={themeName}
                    />
                  ) : null}
                </View>
              ))}
              {federation.phone ? (
                <ContactLine
                  icon={Phone}
                  value={federation.phone}
                  href={`tel:${federation.phone.replace(/\s+/g, "")}`}
                  themeName={themeName}
                />
              ) : null}
              {federation.fax ? (
                <ContactLine icon={Printer} value={`Fax ${federation.fax}`} themeName={themeName} />
              ) : null}
              {federation.address ? (
                <ContactLine icon={MapPin} value={federation.address} themeName={themeName} />
              ) : null}
              {federation.website ? (
                <ContactLine
                  icon={Globe}
                  value={federation.website.replace(/^https?:\/\//, "")}
                  href={federation.website}
                  themeName={themeName}
                />
              ) : null}
            </View>
          ) : (
            // No fabricated coordinates — clean placeholder until FFIE provides
            // this federation's contact block.
            <Text style={{ fontSize: 13, color: t.text.muted, lineHeight: 19 }}>
              Les coordonnées de cette fédération départementale apparaîtront ici.
              La FFIE finalise l'annuaire.
            </Text>
          )}
        </View>
      </Animated.View>

      {!isLast ? (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: c.separator,
            marginLeft: separatorInset,
          }}
        />
      ) : null}
    </View>
  );
}

export function BecomeMemberScreen({
  themeName = "light",
}: {
  themeName?: ThemeName;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  // Accordion: at most one federation expanded at a time. Opening a new row
  // collapses the previously open one.
  const [openId, setOpenId] = useState<number | null>(null);
  // Show a short list by default; "Show more" reveals the rest. A live search
  // bypasses the cap so every match is visible.
  const [showAll, setShowAll] = useState(false);

  // "Back to top" — surfaces once the user has scrolled well past the first
  // screen, fades in/out, and jumps the scroll view back to the top.
  const scrollRef = React.useRef<ScrollView>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const backToTopAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(backToTopAnim, {
      toValue: showBackToTop ? 1 : 0,
      duration: reducedMotion ? 0 : primitives.motion.duration.base,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showBackToTop, reducedMotion, backToTopAnim]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    // Hysteresis so the button doesn't flicker around the threshold.
    if (y > 700 && !showBackToTop) setShowBackToTop(true);
    else if (y < 500 && showBackToTop) setShowBackToTop(false);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  };

  const toggleFederation = (id: number) => {
    // Each row animates its own height; opening one and closing the previously
    // open one run in parallel off their `open` prop.
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filtered = useMemo<Federation[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FEDERATIONS;
    return FEDERATIONS.filter(
      (f) =>
        f.code.toLowerCase().includes(q) ||
        f.area.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q)
    );
  }, [query]);

  const INITIAL_COUNT = 10;
  const isSearching = query.trim().length > 0;
  const collapsedList = !showAll && !isSearching;
  const visible = collapsedList ? filtered.slice(0, INITIAL_COUNT) : filtered;
  const hiddenCount = filtered.length - visible.length;

  // Android's scrollbar is pinned to the ScrollView's right edge and ignores
  // scrollIndicatorInsets, so we inset the ScrollView itself by a hair to lift
  // the bar off the screen edge like iOS. iOS keeps full width + indicator
  // insets.
  const ANDROID_BAR_INSET = Platform.OS === "android" ? 8 : 0;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <View style={{ flex: 1, paddingRight: ANDROID_BAR_INSET }}>
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator
        // "default" is the soft translucent grey bar; "black" was too harsh.
        // Dark theme still needs the light bar to stay visible.
        indicatorStyle={themeName === "dark" ? "white" : "default"}
        // iOS: pull the scroll bar in from the edge into the safe zone.
        scrollIndicatorInsets={{ right: 3, top: 4, bottom: 4 }}
      >
        {/* Large title + the requested subtitle */}
        <View style={{ paddingHorizontal: GUTTER, paddingTop: PAGE_TOP_PADDING, paddingBottom: 6 }}>
          <Text
            accessibilityRole="header"
            style={{
              fontSize: 34,
              lineHeight: 41,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              color: t.text.body,
              letterSpacing: -0.8,
            }}
          >
            Adhérer à la FFIE
          </Text>
          <Text style={{ fontSize: 15, color: t.text.muted, marginTop: 6, lineHeight: 21 }}>
            Pour adhérer, adressez-vous à votre fédération départementale ci-dessous.
          </Text>
        </View>

        {/* Search field — same affordance as the Library */}
        <View
          style={{
            paddingHorizontal: GUTTER,
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              height: 38,
              borderRadius: 10,
              backgroundColor: t.border.subtle,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              columnGap: 7,
            }}
          >
            <Search size={17} color={t.text.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un département ou une fédération"
              placeholderTextColor={t.text.placeholder}
              style={{ flex: 1, color: t.text.body, fontSize: 16 }}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              accessibilityLabel="Rechercher une fédération départementale"
            />
          </View>
        </View>

        {/* Departmental federation directory — the grouped inset list */}
        {filtered.length === 0 ? (
          <View style={{ padding: 48, alignItems: "center" }}>
            <Text style={{ color: t.text.muted, fontSize: 15, marginBottom: 6 }}>Aucune fédération trouvée.</Text>
            <Text style={{ color: t.text.muted, fontSize: 13, opacity: 0.8, textAlign: "center" }}>
              Essayez un numéro de département (« 69 »), un nom (« Rhône ») ou « Bâtiment ».
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: 28 }}>
            <View
              style={{
                marginHorizontal: GUTTER,
                backgroundColor: c.cardBg,
                borderRadius: primitives.radii.lg,
                borderWidth: c.cardBorder ? 1 : 0,
                borderColor: c.cardBorder,
                overflow: "hidden",
              }}
            >
              {visible.map((f, i) => (
                <FederationRow
                  key={f.id}
                  federation={f}
                  isLast={i === visible.length - 1}
                  themeName={themeName}
                  reducedMotion={reducedMotion}
                  open={openId === f.id}
                  onToggle={() => toggleFederation(f.id)}
                />
              ))}
            </View>

            {/* Show more — reveals the rest of the directory */}
            {collapsedList && hiddenCount > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Afficher les ${filtered.length} fédérations`}
                onPress={() => setShowAll(true)}
                style={({ pressed }) => ({
                  marginTop: 12,
                  marginHorizontal: GUTTER,
                  minHeight: 44,
                  borderRadius: primitives.radii.md,
                  backgroundColor: pressed ? t.border.subtle : t.surface.subtle,
                  borderWidth: 1,
                  borderColor: t.border.subtle,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: 6,
                })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: ralewayFamily("600"),
                    fontWeight: "600",
                    color: t.text.body,
                  }}
                >
                  Afficher {hiddenCount} de plus
                </Text>
                <ChevronDown size={18} color={t.brand.accent} />
              </Pressable>
            ) : null}

            {/* Show less — collapses back to the short list (only when the user
                expanded it themselves; search manages its own result count) */}
            {showAll && !isSearching ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Afficher moins de fédérations`}
                onPress={() => {
                  setShowAll(false);
                  scrollToTop();
                }}
                style={({ pressed }) => ({
                  marginTop: 12,
                  marginHorizontal: GUTTER,
                  minHeight: 44,
                  borderRadius: primitives.radii.md,
                  backgroundColor: pressed ? t.border.subtle : t.surface.subtle,
                  borderWidth: 1,
                  borderColor: t.border.subtle,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: 6,
                })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: ralewayFamily("600"),
                    fontWeight: "600",
                    color: t.text.body,
                  }}
                >
                  Afficher moins
                </Text>
                <ChevronUp size={18} color={t.brand.accent} />
              </Pressable>
            ) : null}

            {collapsedList ? (
              <Text
                style={{
                  color: t.text.muted,
                  fontSize: 12,
                  lineHeight: 16,
                  marginTop: 10,
                  marginHorizontal: GUTTER + 4,
                }}
              >
                {`${visible.length} fédérations départementales affichées sur ${FEDERATIONS.length}.`}
              </Text>
            ) : null}
          </View>
        )}

        {/* Eligibility */}
        <View style={{ paddingHorizontal: GUTTER }}>
          <View
            style={{
              padding: 16,
              borderRadius: primitives.radii.md,
              backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
              borderWidth: 1,
              borderColor: t.border.subtle,
              flexDirection: "row",
              columnGap: 10,
            }}
          >
            <ShieldCheck size={18} color={t.brand.accent} style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, fontSize: 13, color: t.text.muted, lineHeight: 19 }}>
              Ouvert aux entreprises d'intégration électrique immatriculées en France. Les demandes sont traitées par votre
              fédération départementale, puis examinées par la FFIE avant l'octroi de l'accès. Vous serez notifié par e-mail.
            </Text>
          </View>
        </View>
      </ScrollView>
      </View>

      {/* Back to top — floats over the list once scrolled deep, fades in/out */}
      <Animated.View
        pointerEvents={showBackToTop ? "box-none" : "none"}
        style={{
          position: "absolute",
          right: GUTTER,
          bottom: 24,
          opacity: backToTopAnim,
          transform: [
            {
              translateY: backToTopAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour en haut"
          onPress={scrollToTop}
          style={({ pressed }) => ({
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: pressed ? t.action.primary.bgPressed : t.action.primary.bg,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 4,
          })}
        >
          <ArrowUp size={22} color={t.action.primary.fg} strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

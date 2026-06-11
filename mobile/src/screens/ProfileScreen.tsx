// Profile tab — member account, qualifications & settings.
//
// Opens on a navy "identity hero" (avatar + name + job title + member line),
// mirroring the Home hero pattern: a fixed navy brand surface that bleeds up
// behind the status bar. The shell (App.tsx) suppresses the persistent
// AppHeader on this tab so the hero owns the top — one navy region, not two.
//
// Beneath it, grouped inset lists (iOS Settings look, via the shared ios.tsx
// primitives) host, in order:
//   • My company     — company name, region, SIRET (read-only account facts)
//   • Qualifications — trade certifications + a "Valid" badge each
//   • Push notifications / Alert types — the master switch + per-category
//     toggles (colour-coded dots). Local UI state only — there is no
//     notifications backend in v1 (see NotificationsScreen / CLAUDE.md).
//   • Preferences    — region displayed, interests (stubs)
//   • Account        — edit profile, change password, sign out
//
// Identity + company + qualifications come from src/data/member.ts so the app
// reads coherently wherever the signed-in member appears (Home hero, here).
// Rows delegate to the parent via onRowPress; "signout" is handled by the
// shell (clears the mock session + returns to login), the rest are stubs.

import React, { useState } from "react";
import {
  Building2,
  Check,
  Globe,
  Hash,
  Lock,
  LogOut,
  MapPin,
  SlidersHorizontal,
  SquarePen,
  type LucideIcon,
} from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { useRole } from "@/auth/roleContext";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { HEADER_SURFACE } from "@/theme/brandHeader";
import {
  GUTTER,
  InsetGroup,
  InsetRow,
  useGroupedColors,
} from "@/components/ui/ios";
import { currentMember } from "@/data/member";
import {
  ChangePasswordSheet,
  EditProfileSheet,
  INTEREST_OPTIONS,
  InterestsSheet,
  RegionPickerSheet,
  type EditableProfile,
  type InterestKey,
} from "@/screens/settings/ProfileSettingsSheets";

// --- fixed brand-surface colours (teal hero, shared with HomeHeader) --------
const SURFACE = HEADER_SURFACE; // brand teal behind the identity hero
const WHITE = primitives.colors.white;
const AVATAR = primitives.colors.white; // white monogram chip — matches the header logo chip
const INITIALS = primitives.colors.brand.teal[800]; // #045764 — AAA on the white avatar

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ROLE_LINE = withAlpha(WHITE, 0.72); // muted job-title line on navy
const TOP_GAP = Platform.OS === "android" ? 14 : 12; // matches Home/AppHeader

// Apple's real iOS 26 "Liquid Glass" (UIGlassEffect) is only present on iOS 26+.
// isLiquidGlassAvailable() is false on Android and older iOS, where GlassView
// would silently fall back to a plain View — so we branch on it ourselves to
// render an intentional frosted token capsule instead (see GlassSwitch). Read
// once at module load: a device's OS can't change mid-session.
const LIQUID_GLASS = isLiquidGlassAvailable();

// Default ON-state for every alert category except partner offers, matching
// the design. Local-only — no persistence/back-end in v1.
type AlertKey = "news" | "events" | "regulatory" | "trainings" | "partners";

export function ProfileScreen({
  themeName = "light",
  onRowPress,
}: {
  themeName?: ThemeName;
  onRowPress?: (rowKey: string) => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const insets = useSafeAreaInsets();
  const { role } = useRole();
  const m = currentMember;

  // Notification toggles — local UI state. The master switch gates the whole
  // alert group; when off, the per-category switches read as disabled.
  const [pushEnabled, setPushEnabled] = useState(true);
  const [alerts, setAlerts] = useState<Record<AlertKey, boolean>>({
    news: true,
    events: true,
    regulatory: true,
    trainings: true,
    partners: false,
  });
  const toggleAlert = (key: AlertKey) =>
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));

  // Editable account state — local to this session (v1 is mocked UI; the
  // settings sheets validate and apply here but don't sync to a server). The
  // Home hero still reads the original currentMember, so edits here aren't
  // reflected there until a real profile store lands.
  const [profile, setProfile] = useState<EditableProfile & { region: string }>({
    fullName: m.fullName,
    jobTitle: m.jobTitle,
    companyName: m.company.name,
    region: m.region,
  });
  const [interests, setInterests] = useState<InterestKey[]>([
    "regulatory",
    "training",
    "events",
  ]);
  // Which settings sheet is open (one at a time).
  const [sheet, setSheet] = useState<"none" | "edit" | "password" | "region" | "interests">(
    "none"
  );
  const closeSheet = () => setSheet("none");

  // Monogram derived from the (editable) name so the avatar stays in sync.
  const initials =
    profile.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || m.initials;

  const interestsSummary =
    interests.length === INTEREST_OPTIONS.length
      ? "All"
      : interests.length > 0
        ? `${interests.length} selected`
        : "None";

  const handlePress = (rowKey: string) => onRowPress?.(rowKey);

  return (
    <View style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Light status-bar content (clock / signal) over the navy hero. */}
      <StatusBar style="light" />

      {/* Teal backstop behind the status bar so a top-overscroll bounce reveals
          the header colour, not the page below (same trick as HomeScreen). It
          only shows ABOVE the hero — the page-coloured wrapper below the hero
          paints over it for all the content. */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, backgroundColor: SURFACE }}
      />

      {/* contentInsetAdjustmentBehavior="never": the hero applies the top
          safe-area inset itself, so iOS must not also auto-inset the scroll
          content (that would double-count it). flexGrow lets the page-coloured
          content wrapper fill to the bottom even when the list is short. */}
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Identity hero (navy) ------------------------------------- */}
        <View style={[styles.hero, { paddingTop: insets.top + TOP_GAP }]}>
          <View
            style={styles.avatar}
            accessible
            accessibilityRole="image"
            accessibilityLabel={`${profile.fullName}, monogram`}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1} accessibilityRole="header">
              {profile.fullName}
            </Text>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {profile.jobTitle}
            </Text>
            <Text style={styles.memberLine} numberOfLines={1}>
              {role === "admin" ? "Admin" : "Member"} · N° {m.memberNo} · {profile.region}
            </Text>
          </View>
        </View>

        {/* Page-coloured wrapper for everything BELOW the hero. This paints over
            the teal backstop so the header colour wraps the identity block only;
            the grouped content sits on the normal page background like the other
            tabs. flexGrow fills any remaining height below the last group. */}
        <View style={{ flexGrow: 1, backgroundColor: c.pageBg, paddingBottom: 32 }}>
          {/* Small gap above the first group so the teal header reads as a
              distinct band before the grouped content begins. */}
          <View style={{ height: 12 }} />

          {/* ---- My company (read-only account facts) -------------------- */}
          <InsetGroup header="My company" themeName={themeName}>
          <FactRow icon={Building2} title="Company name" value={profile.companyName} themeName={themeName} />
          <FactRow icon={MapPin} title="Region" value={profile.region} themeName={themeName} />
          <FactRow icon={Hash} title="SIRET" value={m.company.siret} themeName={themeName} isLast />
        </InsetGroup>

        {/* ---- Qualifications ----------------------------------------- */}
        <InsetGroup header="Qualifications" themeName={themeName}>
          {m.qualifications.map((q, i) => (
            <InsetRow
              key={q.label}
              leading={<LeadingIcon icon={Check} color={t.feedback.success} />}
              leadingWidth={LEAD_ICON_W}
              title={q.label}
              trailing={q.valid ? <ValidBadge themeName={themeName} /> : undefined}
              themeName={themeName}
              isLast={i === m.qualifications.length - 1}
              accessibilityLabel={`${q.label}, ${q.valid ? "valid" : "not valid"}`}
            />
          ))}
        </InsetGroup>

        {/* ---- Push notifications (master switch) ---------------------- */}
        <InsetGroup header="Push notifications" themeName={themeName}>
          <InsetRow
            leading={<LeadingDot color={t.brand.accent} />}
            leadingWidth={LEAD_DOT_W}
            title="Enable notifications"
            trailing={
              <GlassSwitch
                value={pushEnabled}
                onToggle={() => setPushEnabled((p) => !p)}
                accessibilityLabel="Enable notifications"
                themeName={themeName}
              />
            }
            themeName={themeName}
            isLast
          />
        </InsetGroup>

        {/* ---- Alert types (per-category toggles) --------------------- */}
        <InsetGroup
          header="Alert types"
          footer="Turn off notifications above to pause every alert at once."
          themeName={themeName}
        >
          {ALERT_ROWS.map((row, i) => (
            <InsetRow
              key={row.key}
              leading={<LeadingDot color={dotColor(row.tone, t)} />}
              leadingWidth={LEAD_DOT_W}
              title={row.title}
              trailing={
                <GlassSwitch
                  value={pushEnabled && alerts[row.key]}
                  onToggle={() => toggleAlert(row.key)}
                  disabled={!pushEnabled}
                  accessibilityLabel={row.title}
                  themeName={themeName}
                />
              }
              themeName={themeName}
              isLast={i === ALERT_ROWS.length - 1}
            />
          ))}
        </InsetGroup>

        {/* ---- Preferences -------------------------------------------- */}
        <InsetGroup header="Preferences" themeName={themeName}>
          <InsetRow
            leading={<LeadingIcon icon={Globe} color={t.text.muted} />}
            leadingWidth={LEAD_ICON_W}
            title="Region displayed"
            value={profile.region}
            themeName={themeName}
            onPress={() => setSheet("region")}
          />
          <InsetRow
            leading={<LeadingIcon icon={SlidersHorizontal} color={t.text.muted} />}
            leadingWidth={LEAD_ICON_W}
            title="Interests"
            value={interestsSummary}
            themeName={themeName}
            isLast
            onPress={() => setSheet("interests")}
          />
        </InsetGroup>

        {/* ---- Account ------------------------------------------------ */}
        <InsetGroup header="Account" themeName={themeName}>
          <InsetRow
            leading={<LeadingIcon icon={SquarePen} color={t.text.muted} />}
            leadingWidth={LEAD_ICON_W}
            title="Edit profile"
            themeName={themeName}
            onPress={() => setSheet("edit")}
          />
          <InsetRow
            leading={<LeadingIcon icon={Lock} color={t.text.muted} />}
            leadingWidth={LEAD_ICON_W}
            title="Change password"
            themeName={themeName}
            onPress={() => setSheet("password")}
          />
          <InsetRow
            leading={<LeadingIcon icon={LogOut} color={t.feedback.danger} />}
            leadingWidth={LEAD_ICON_W}
            title="Sign out"
            themeName={themeName}
            isLast
            destructive
            showChevron={false}
            onPress={() => handlePress("signout")}
          />
        </InsetGroup>

          <Text style={{ textAlign: "center", fontSize: 12, color: t.text.muted, opacity: 0.7 }}>
            FFIE mobile v0.7 · design preview
          </Text>
        </View>
      </ScrollView>

      {/* Settings editors — functional but local/mocked (no backend in v1).
          One open at a time, gated on `sheet`. */}
      <EditProfileSheet
        visible={sheet === "edit"}
        initial={{
          fullName: profile.fullName,
          jobTitle: profile.jobTitle,
          companyName: profile.companyName,
        }}
        onClose={closeSheet}
        onSave={(next) => {
          setProfile((p) => ({ ...p, ...next }));
          closeSheet();
        }}
        themeName={themeName}
      />
      <ChangePasswordSheet
        visible={sheet === "password"}
        onClose={closeSheet}
        onUpdated={closeSheet}
        themeName={themeName}
      />
      <RegionPickerSheet
        visible={sheet === "region"}
        selected={profile.region}
        onClose={closeSheet}
        onSelect={(region) => {
          setProfile((p) => ({ ...p, region }));
          closeSheet();
        }}
        themeName={themeName}
      />
      <InterestsSheet
        visible={sheet === "interests"}
        selected={interests}
        onClose={closeSheet}
        onSave={(next) => {
          setInterests(next);
          closeSheet();
        }}
        themeName={themeName}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Leading-visual widths — fed to InsetRow.leadingWidth so the hairline
// separators inset to line up under the row title (the iOS detail).
// ---------------------------------------------------------------------------
const LEAD_ICON_W = 24;
const LEAD_DOT_W = 12;

// A plain (un-tiled) line icon in a fixed-width box, so different leading
// glyphs align and separators land consistently under the title.
function LeadingIcon({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <View style={{ width: LEAD_ICON_W, alignItems: "center" }}>
      <Icon size={20} color={color} strokeWidth={2} />
    </View>
  );
}

// A small colour-coded status dot (alert categories / push master).
function LeadingDot({ color }: { color: string }) {
  return (
    <View style={{ width: LEAD_DOT_W, alignItems: "center" }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
    </View>
  );
}

// A notification toggle that floats on a Liquid-Glass tray.
//
// On iOS 26 the capsule is Apple's native UIGlassEffect (via expo-glass-effect's
// GlassView): it refracts whatever scrolls behind it and lenses/morphs under
// touch (`isInteractive`). The Switch on top is the ordinary native control —
// the glass is purely the surface it sits on, so behaviour/accessibility are
// unchanged. We pin `colorScheme` to the app's own theme instead of "auto" so
// the glass doesn't follow the OS appearance independently of our toggle.
//
// On Android / iOS < 26 (LIQUID_GLASS === false) GlassView has no system effect
// to render, so we substitute a token-built frosted capsule — a faint accent
// fill + hairline border — so the toggle still reads as an intentional tray
// rather than a bare switch. We never drop GlassView's own opacity below 1
// (the module warns it breaks the effect); the disabled state is carried by the
// Switch alone.
function GlassSwitch({
  value,
  onToggle,
  disabled = false,
  accessibilityLabel,
  themeName,
}: {
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  const sw = (
    <Switch
      value={value}
      onValueChange={onToggle}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      // iOS-style switch colours — teal "on" track (brand accent), neutral off.
      trackColor={{ false: t.border.strong, true: t.brand.accent }}
      thumbColor={WHITE}
      ios_backgroundColor={t.border.strong}
    />
  );

  if (LIQUID_GLASS) {
    return (
      <GlassView
        style={styles.glassCapsule}
        glassEffectStyle="regular"
        isInteractive
        colorScheme={themeName === "dark" ? "dark" : "light"}
      >
        {sw}
      </GlassView>
    );
  }

  // Fallback (Android / iOS < 26): a frosted token capsule, no native glass.
  return (
    <View
      style={[
        styles.glassCapsule,
        {
          backgroundColor: withAlpha(t.brand.accent, 0.06),
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: withAlpha(t.brand.accent, 0.18),
        },
      ]}
    >
      {sw}
    </View>
  );
}

// Read-only "fact" row — plain leading icon, label, right-aligned value, no
// chevron (informational, not tappable).
function FactRow({
  icon,
  title,
  value,
  themeName,
  isLast = false,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  themeName: ThemeName;
  isLast?: boolean;
}) {
  const t = themes[themeName];
  return (
    <InsetRow
      leading={<LeadingIcon icon={icon} color={t.text.muted} />}
      leadingWidth={LEAD_ICON_W}
      title={title}
      value={value}
      themeName={themeName}
      isLast={isLast}
      accessibilityLabel={`${title}: ${value}`}
    />
  );
}

// "Valid" badge — low-emphasis green pill (no icon), used in Qualifications.
// Reads the success subtle tokens so it matches StatusPill's palette without
// pulling in its icon/animation machinery.
function ValidBadge({ themeName }: { themeName: ThemeName }) {
  const sub = themes[themeName].feedback.subtle.success;
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: primitives.radii.full,
        backgroundColor: sub.bg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: sub.border,
      }}
    >
      <Text
        style={{
          color: sub.fg,
          fontSize: 12,
          fontFamily: ralewayFamily("600"),
          fontWeight: "600",
          letterSpacing: 0.1,
        }}
      >
        Valid
      </Text>
    </View>
  );
}

// Alert categories + their dot tone. Order matches the design.
type AlertTone = "accent" | "warning" | "danger" | "success" | "muted";
const ALERT_ROWS: { key: AlertKey; title: string; tone: AlertTone }[] = [
  { key: "news", title: "FFIE news", tone: "accent" },
  { key: "events", title: "Event reminders", tone: "warning" },
  { key: "regulatory", title: "Regulatory alerts", tone: "danger" },
  { key: "trainings", title: "New trainings", tone: "success" },
  { key: "partners", title: "Partner offers", tone: "muted" },
];

function dotColor(tone: AlertTone, t: (typeof themes)[ThemeName]): string {
  switch (tone) {
    case "accent":
      return t.brand.accent;
    case "warning":
      return t.feedback.warning;
    case "danger":
      return t.feedback.danger;
    case "success":
      return t.feedback.success;
    case "muted":
      return t.text.muted;
  }
}

const styles = StyleSheet.create({
  // Liquid-Glass tray hugging the notification Switch. A fully-rounded pill with
  // just enough padding to read as a capsule around the control; borderRadius +
  // overflow:hidden keep both the native glass and the fallback fill clipped to
  // the pill. Native UIGlassEffect supplies its own depth, so no shadow here.
  glassCapsule: {
    borderRadius: primitives.radii.full,
    paddingHorizontal: 7,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  // Compact identity bar — tuned to the same vertical rhythm as AppHeader on the
  // other tabs (paddingBottom 16, ~52pt content row) so the teal band reads as a
  // header, not a tall hero. A 44pt avatar + tight three-line identity fits that
  // height while keeping every detail.
  hero: {
    backgroundColor: SURFACE,
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AVATAR,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: INITIALS,
    fontSize: 16,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  name: {
    color: WHITE,
    fontSize: 19,
    lineHeight: 23,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  jobTitle: {
    color: ROLE_LINE,
    fontSize: 12.5,
    lineHeight: 16,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    marginTop: 1,
  },
  memberLine: {
    // White (not the old teal accent, which would vanish on the teal hero).
    color: WHITE,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    letterSpacing: 0.1,
    marginTop: 2,
  },
});

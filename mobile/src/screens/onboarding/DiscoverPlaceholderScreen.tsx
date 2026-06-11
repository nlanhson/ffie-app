// Discover (public) path — placeholder for v1.
// This is where Karim and Léa land when they pick "Discover FFIE" on the
// path-selection screen. The real screen (Screen 4 in the roadmap) is the
// "Discover the trades" public landing. For now this is a clear placeholder
// that honors P6 (no login wall) and P7 (substance over brochure copy) by
// showing what the visitor will get + a path back to member sign-in.

import React from "react";
import { ChevronLeft, Newspaper, UserCircle2, Zap } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

export function DiscoverPlaceholderScreen({
  themeName = "light",
  onSignInInstead,
  onContinue,
}: {
  themeName?: ThemeName;
  onSignInInstead: () => void;
  onContinue: () => void;
}) {
  const t = themes[themeName];

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 0,
          paddingBottom: 32,
        }}
      >
        {/* Back row → returns to path selection */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onSignInInstead}
          hitSlop={12}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 4,
            height: 44,
            alignSelf: "flex-start",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <ChevronLeft size={20} color={t.text.muted} />
          <Text style={{ color: t.text.muted, fontSize: 15 }}>Back</Text>
        </Pressable>

        {/* Hero */}
        <View style={{ marginTop: 16, marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 26,
              fontFamily: displayFamily("700"), fontWeight: "700",
              color: t.text.body,
              letterSpacing: -0.4,
              lineHeight: 32,
            }}
          >
            Welcome, visitor
          </Text>
          <Text style={{ fontSize: 15, color: t.text.muted, marginTop: 8, lineHeight: 22 }}>
            Browse freely. No account is needed to explore our public content.
          </Text>
        </View>

        {/* Preview cards */}
        <View style={{ rowGap: 12 }}>
          <PreviewRow
            themeName={themeName}
            icon={Newspaper}
            title="Public news"
            subtitle="Industry news and federation announcements."
          />
          <PreviewRow
            themeName={themeName}
            icon={Zap}
            title="The electrical integration trades"
            subtitle="What our 7,300 member companies actually do."
          />
          <PreviewRow
            themeName={themeName}
            icon={UserCircle2}
            title="Become a member"
            subtitle="Requirements, benefits and steps to join the federation."
          />
        </View>

        {/* Note */}
        <View
          style={{
            marginTop: 32,
            padding: 16,
            borderRadius: primitives.radii.md,
            backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
            borderWidth: 1,
            borderColor: t.border.subtle,
          }}
        >
          <Text style={{ fontSize: 13, color: t.text.muted, lineHeight: 20 }}>
            <Text style={{ fontFamily: ralewayFamily("600"), fontWeight: "600", color: t.text.body }}>v0.1 · </Text>
            public screen under construction. Tap Continue to see the draft of the public news feed.
          </Text>
        </View>

        {/* Spacer + actions */}
        <View style={{ flex: 1 }} />

        <View style={{ marginTop: 32, rowGap: 8 }}>
          <Button themeName={themeName} size="lg" fullWidth onPress={onContinue}>
            Continue
          </Button>
          <Button themeName={themeName} variant="ghost" size="md" fullWidth onPress={onSignInInstead}>
            I already have a member account
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PreviewRow({
  themeName,
  icon: Icon,
  title,
  subtitle,
}: {
  themeName: ThemeName;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
}) {
  const t = themes[themeName];

  return (
    // Informational only — no card background and no chevron, so it doesn't
    // read as a tappable row (these previews aren't actionable in v1).
    <View
      style={{
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color={t.brand.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: ralewayFamily("600"), fontWeight: "600", color: t.text.body }}>{title}</Text>
        <Text style={{ fontSize: 12, color: t.text.muted, marginTop: 2, lineHeight: 16 }}>{subtitle}</Text>
      </View>
    </View>
  );
}

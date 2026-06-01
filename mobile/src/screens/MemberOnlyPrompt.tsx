// MemberOnlyPrompt — upsell surface shown when a guest taps a member-only
// route. Per the access-model tech requirement: gated routes redirect to a
// login + apply CTA, never a 403.
//
// Persona context (Karim): "Why should I pay 600€ a year? Show me what I get."
// So the page leads with concrete value (what unlocks), not a paywall scold.
// Apply is primary; Sign in is the secondary affordance for existing members
// who reached this surface by mistake.
//
// In v1 the CTAs are stubs — onApply / onSignIn callbacks are wired by the
// caller (App.tsx) to navigate to Become-a-member / sign-in respectively.

import React from "react";
import { ChevronLeft, Lock } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

export function MemberOnlyPrompt({
  themeName = "light",
  onApply,
  onSignIn,
  onBack,
}: {
  themeName?: ThemeName;
  onApply?: () => void;
  onSignIn?: () => void;
  /** When provided, renders a slim back affordance (e.g. returning to News). */
  onBack?: () => void;
}) {
  const t = themes[themeName];

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 1,
            alignSelf: "flex-start",
            paddingVertical: 8,
            paddingHorizontal: 12,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <ChevronLeft size={26} color={t.brand.accent} />
          <Text style={{ color: t.brand.accent, fontSize: 16 }}>Retour</Text>
        </Pressable>
      ) : null}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: onBack ? 8 : 24,
          paddingBottom: 24,
        }}
      >
        <View style={{ flex: 0.2 }} />

        {/* Hero */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
              borderWidth: 2,
              borderColor: t.brand.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Lock size={32} color={t.brand.accent} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: displayFamily("700"), fontWeight: "700",
              color: t.text.body,
              textAlign: "center",
              letterSpacing: -0.4,
              lineHeight: 30,
              maxWidth: 320,
            }}
          >
            Réservé aux adhérents FFIE
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: t.text.muted,
              textAlign: "center",
              lineHeight: 22,
              marginTop: 12,
              maxWidth: 320,
            }}
          >
            Ce contenu fait partie de l'offre réservée aux adhérents FFIE. Demandez votre adhésion à la fédération, ou connectez-vous si vous avez déjà un compte.
          </Text>
        </View>

        {/* What members unlock — concrete, scannable, per Karim's "show me what I get". */}
        <View
          style={{
            marginTop: 28,
            padding: 16,
            borderRadius: primitives.radii.md,
            backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
            borderWidth: 1,
            borderColor: t.border.subtle,
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: ralewayFamily("600"), fontWeight: "600", color: t.text.body, marginBottom: 8 }}>
            Ce que les adhérents obtiennent
          </Text>
          <Unlock label="Bibliothèque technique complète (NF C 15-100, RE 2020, circulaires Consuel…)" themeName={themeName} />
          <Unlock label="Cache hors-ligne complet qui fonctionne sur chantier, sans réseau" themeName={themeName} />
          <Unlock label="Ressources didactiques & tutoriels vidéo" themeName={themeName} />
          <Unlock label="Calculateurs techniques (dimensionnement, puissance, normes)" themeName={themeName} />
        </View>

        {/* Spacer pushes actions to bottom for one-handed reach. */}
        <View style={{ flex: 1 }} />

        {/* Actions */}
        <View style={{ rowGap: 8, marginTop: 24 }}>
          <Button
            themeName={themeName}
            size="lg"
            fullWidth
            onPress={onApply ?? (() => {})}
            accessibilityLabel="Demander l'adhésion à la FFIE"
          >
            Demander l'adhésion
          </Button>
          <Button
            themeName={themeName}
            variant="ghost"
            size="md"
            fullWidth
            onPress={onSignIn ?? (() => {})}
            accessibilityHint="Si vous avez déjà un compte adhérent FFIE"
          >
            J'ai déjà un compte
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Unlock({ label, themeName }: { label: string; themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 8, marginTop: 6 }}>
      <Text style={{ fontSize: 13, color: t.brand.accent, fontFamily: ralewayFamily("700"), fontWeight: "700", lineHeight: 20 }}>·</Text>
      <Text style={{ fontSize: 13, color: t.text.muted, flex: 1, lineHeight: 20 }}>{label}</Text>
    </View>
  );
}

// MemberOnlyPrompt — surface d'incitation affichée lorsqu'un invité touche une
// route réservée aux adhérents. Selon l'exigence technique du modèle d'accès :
// les routes protégées redirigent vers un CTA de connexion + adhésion, jamais
// vers un 403.
//
// « Demander l'adhésion » (principal) redirige vers la page Devenir adhérent
// (l'annuaire de la fédération) via onApply ; « J'ai déjà un compte » (secondaire)
// est l'option de connexion pour les adhérents existants arrivés ici par erreur.
// Les deux callbacks sont câblés par l'appelant (App.tsx).

import React from "react";
import { ChevronLeft, Lock } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { displayFamily } from "@/theme/fonts";

export function MemberOnlyPrompt({
  themeName = "light",
  onApply,
  onSignIn,
  onBack,
  documentTitle,
}: {
  themeName?: ThemeName;
  onApply?: () => void;
  onSignIn?: () => void;
  /** Si fourni, affiche une fine option de retour (ex. revenir aux Actualités). */
  onBack?: () => void;
  /** Contexte facultatif — le titre de l'élément protégé que l'utilisateur a touché
   *  (ex. un document verrouillé). Affiché sous forme de pastille pour qu'il sache
   *  ce qui se trouve derrière le mur. */
  documentTitle?: string;
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
            Ce contenu fait partie de l'offre réservée aux adhérents FFIE. Demandez l'adhésion à la fédération, ou connectez-vous si vous avez déjà un compte.
          </Text>

          {/* Pastille de contexte — l'élément protégé que l'utilisateur a touché (ex. le document). */}
          {documentTitle ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
                marginTop: 20,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
                borderWidth: 1,
                borderColor: t.border.subtle,
                maxWidth: 340,
              }}
            >
              <Lock size={14} color={t.text.muted} />
              <Text
                numberOfLines={2}
                style={{ flex: 1, fontSize: 13.5, color: t.text.body, lineHeight: 19 }}
              >
                {documentTitle}
              </Text>
            </View>
          ) : null}
        </View>

        {/* L'espaceur pousse les actions vers le bas pour une portée à une main. */}
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

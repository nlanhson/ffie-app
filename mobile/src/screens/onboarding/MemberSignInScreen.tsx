// Member Sign-In — the auth step on the member path.
// Per Julien's persona: "He doesn't trust new apps with his login credentials"
// + "Hates entering credentials." So:
//   - Field 1: numéro de membre OR email (he'll use whichever he remembers)
//   - Field 2: password (with show/hide ETA later; basic for v1)
//   - Below CTA: "Mot de passe oublié ?" ghost — never forces him to leave
//   - Below: "← Pas membre ? Découvrir FFIE." ghost — escape to the public path
// No marketing copy; no badges of trust beyond the federation header.

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

export function MemberSignInScreen({
  themeName = "light",
  onSignIn,
  onBack,
  onForgotPassword,
  onDiscoverInstead,
}: {
  themeName?: ThemeName;
  onSignIn: (identifier: string) => void;
  onBack: () => void;
  onForgotPassword: () => void;
  onDiscoverInstead: () => void;
}) {
  const t = themes[themeName];
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const canSubmit = identifier.trim().length > 0 && password.length > 0 && !submitting;

  const submit = () => {
    if (!canSubmit) return;
    setError(undefined);
    setSubmitting(true);
    // Mock auth — real flow plugs into FFIE backend later.
    setTimeout(() => {
      setSubmitting(false);
      if (password === "wrong") {
        setError("Identifiants incorrects. Réessayez ou réinitialisez votre mot de passe.");
        return;
      }
      onSignIn(identifier.trim());
    }, 900);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back row */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={onBack}
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
            <Text style={{ color: t.text.muted, fontSize: 15 }}>Retour</Text>
          </Pressable>

          {/* Title block */}
          <View style={{ marginTop: 16, marginBottom: 28 }}>
            <Text
              style={{
                fontSize: 26,
                fontFamily: displayFamily("700"), fontWeight: "700",
                color: t.text.body,
                letterSpacing: -0.4,
                lineHeight: 32,
              }}
            >
              Connexion adhérent
            </Text>
            <Text style={{ fontSize: 15, color: t.text.muted, marginTop: 6, lineHeight: 22 }}>
              Utilisez votre numéro d"adhérent ou votre adresse e-mail.
            </Text>
          </View>

          {/* Form */}
          <View style={{ rowGap: 20 }}>
            <Input
              themeName={themeName}
              label="Numéro d'adhérent ou e-mail"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="ex. 12345 ou jeanne.dupont@exemple.com"
              type="email"
              required
              returnKeyType="next"
            />
            <Input
              themeName={themeName}
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              type="password"
              required
              error={error}
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          </View>

          {/* Primary CTA */}
          <View style={{ marginTop: 28 }}>
            <Button
              themeName={themeName}
              size="lg"
              fullWidth
              loading={submitting}
              disabled={!canSubmit && !submitting}
              onPress={submit}
              accessibilityLabel="Se connecter"
            >
              Se connecter
            </Button>
          </View>

          {/* Ghost actions */}
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <Button
              themeName={themeName}
              variant="ghost"
              size="md"
              onPress={onForgotPassword}
            >
              Mot de passe oublié ?
            </Button>
          </View>

          {/* Escape to public path — honors P6 (no login wall) */}
          <View style={{ flex: 1, justifyContent: "flex-end", marginTop: 32 }}>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: t.border.subtle,
                paddingTop: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13, color: t.text.muted, marginBottom: 8 }}>
                Pas encore adhérent ?
              </Text>
              <Button
                themeName={themeName}
                variant="ghost"
                size="md"
                onPress={onDiscoverInstead}
              >
                Découvrir la FFIE librement
              </Button>
            </View>
          </View>

          {/* Demo hint — remove when wiring real auth */}
          <Text
            style={{
              fontSize: 10,
              color: t.text.muted,
              opacity: 0.5,
              textAlign: "center",
              marginTop: 16,
              fontFamily: "Menlo",
            }}
          >
démo · tout identifiant fonctionne · saisissez "wrong" comme mot de passe pour voir l'erreur
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

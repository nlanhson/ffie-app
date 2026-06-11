// Member Sign-In — the auth step on the member path.
// Per Julien's persona: "He doesn't trust new apps with his login credentials"
// + "Hates entering credentials." So:
//   - Field 1: member number OR email (he'll use whichever he remembers)
//   - Field 2: password (with show/hide ETA later; basic for v1)
//   - Below CTA: "Forgot password?" ghost — never forces him to leave
//   - Below: "← Not a member? Discover FFIE." ghost — escape to the public path
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
        setError("Incorrect credentials. Try again or reset your password.");
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
            accessibilityLabel="Back"
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
            <Text style={{ color: t.text.muted, fontSize: 15 }}>Back</Text>
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
              Member sign-in
            </Text>
            <Text style={{ fontSize: 15, color: t.text.muted, marginTop: 6, lineHeight: 22 }}>
              Use your member number or your email address.
            </Text>
          </View>

          {/* Form */}
          <View style={{ rowGap: 20 }}>
            <Input
              themeName={themeName}
              label="Member number or email"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="e.g. 12345 or jeanne.dupont@example.com"
              type="email"
              required
              returnKeyType="next"
            />
            <Input
              themeName={themeName}
              label="Password"
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
              accessibilityLabel="Sign in"
            >
              Sign in
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
              Forgot password?
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
                Not a member yet?
              </Text>
              <Button
                themeName={themeName}
                variant="ghost"
                size="md"
                onPress={onDiscoverInstead}
              >
                Discover FFIE freely
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
demo · any identifier works · enter "wrong" as the password to see the error
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Connexion adhérent — l'écran de connexion « Espace adhérent & professionnel ».
//
// Un bandeau teal + une feuille blanche, en cohérence avec l'en-tête de
// l'accueil (HEADER_SURFACE teal). La bande teal du haut ne porte que du grand
// texte d'affichage blanc (pastille de logo + « Bienvenue ») ; tout le
// formulaire repose sur une feuille blanche en dessous où chaque libellé et
// contrôle respecte WCAG AA. Les couleurs sont dans auth.login (tokens.ts).
// Atteint de deux façons, toutes deux en Modal plein écran qui glisse vers le
// haut avec son propre SafeAreaProvider :
//   - Onboarding : PathSelection → « Se connecter » → ici → (Se connecter) authentifié.
//   - Coquille invité : « J'ai déjà un compte » → ici (SignInFlow).
//
// Disposition (haut → bas) :
//   - Barre d'en-tête : chevron de retour discret (à gauche) + logotype « FFIE » centré.
//   - Marque : logo FFIE dans une carte blanche, « Bienvenue », « Espace adhérent & professionnel ».
//   - Champ identifiant + champ mot de passe.
//   - CTA « Se connecter » — désactivé tant que les deux champs ne sont pas remplis.
//   - Rangée de liens « Mot de passe oublié ? » / « Aide & contact ».
//   - Séparateur « ou » → « Connexion SSO fédération » (cadenas).
//   - Pied de page : note « La FFIE est membre de la FFB » + barre « Pas encore
//     adhérent ? Adhérer à la FFIE → ».
//
// Maquette v1 : tout identifiant + mot de passe bien formés authentifient (pas
// de backend) ; le SSO ouvre le sélecteur de fédération → connexion fédération
// (vérification) avant l'authentification ; Mot de passe oublié / Aide sont
// inertes. Ne reliez pas ces écrans à une vraie API sans instruction explicite
// (voir TESTFLIGHT.md / CLAUDE.md).

import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArrowRight, ChevronLeft, Lock } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "@/screens/auth/tokens";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { FFBLogo } from "@/components/ui/FFBLogo";
import { SSOFlow } from "@/screens/auth/SSOFlow";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

const L = auth.login;

export function LoginScreen({
  initialIdentifier,
  onBack,
  onSubmit,
  onSso,
  onForgotPassword,
  onHelp,
  onJoin,
}: {
  initialIdentifier?: string;
  onBack: () => void;
  // Se connecter avec un identifiant + mot de passe bien formés — la v1 accepte tout.
  onSubmit: (identifier: string) => void;
  onSso?: () => void;
  onForgotPassword?: () => void;
  onHelp?: () => void;
  onJoin?: () => void;
}) {
  const [identifier, setIdentifier] = useState(initialIdentifier ?? "");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"identifier" | "password" | null>(null);
  // Le bouton « Connexion SSO fédération » ouvre le parcours SSO sur place :
  // choisissez votre fédération → connectez-vous à elle (vérification) → onSso
  // se déclenche. Sélectionner une fédération seule n'authentifie plus.
  const [ssoOpen, setSsoOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const trimmedId = identifier.trim();
  const canConnect = trimmedId.length > 0 && password.length > 0;
  const submit = () => canConnect && onSubmit(trimmedId);

  if (ssoOpen) {
    return (
      <SSOFlow
        onCancel={() => setSsoOpen(false)}
        onAuthenticated={() => {
          setSsoOpen(false);
          onSso?.();
        }}
      />
    );
  }

  return (
    // Seulement le bord du HAUT ici — la feuille blanche du formulaire descend
    // jusqu'en bas et gère elle-même la marge pour l'indicateur d'accueil
    // (insets.bottom).
    <SafeAreaView edges={["top"]} style={styles.root}>
      {/* Surface du bandeau teal — force un contenu de barre d'état clair
          (horloge / batterie blanches). La StatusBar montée le plus en
          profondeur l'emporte tant que cet écran est affiché. */}
      <StatusBar style="light" />

      {/* En-tête — affordance de retour discrète (la modale a besoin d'une
          sortie ; le logotype centré de la maquette reste) + « FFIE » centré. */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.pressedDim]}
        >
          <ChevronLeft size={24} color={L.headerLabel} />
        </Pressable>
        <Text style={styles.headerTitle}>FFIE</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Bandeau — pastille de logo blanche + « Bienvenue » sur la bande teal. */}
          <View style={styles.brand}>
            <View style={styles.logoCard}>
              <FFIELogo size={56} themeName="light" />
            </View>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Espace adhérent &amp; professionnel</Text>
          </View>

          {/* Feuille blanche du formulaire — haut arrondi, descend jusqu'au bord
              du bas. Chaque petit libellé + contrôle repose sur cette surface
              blanche pour respecter AA (le bandeau teal au-dessus ne porte que
              du grand texte d'affichage blanc). */}
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Identifiants */}
          <View style={styles.fields}>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              onFocus={() => setFocused("identifier")}
              onBlur={() => setFocused(null)}
              placeholder="Adresse e-mail ou identifiant FFIE"
              placeholderTextColor={L.field.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              accessibilityLabel="Adresse e-mail ou identifiant FFIE"
              style={[styles.field, focused === "identifier" && styles.fieldFocused]}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Mot de passe"
              placeholderTextColor={L.field.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={submit}
              accessibilityLabel="Mot de passe"
              style={[styles.field, focused === "password" && styles.fieldFocused]}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canConnect }}
            accessibilityLabel="Se connecter"
            disabled={!canConnect}
            onPress={submit}
            style={({ pressed }) => [
              styles.cta,
              canConnect ? styles.ctaActive : styles.ctaDisabled,
              canConnect && pressed && styles.ctaPressed,
            ]}
          >
            <Text style={[styles.ctaLabel, !canConnect && styles.ctaLabelDisabled]}>
              Se connecter
            </Text>
          </Pressable>

          {/* Récupération + aide — inertes en v1. */}
          <View style={styles.linkRow}>
            <Pressable
              accessibilityRole="link"
              onPress={onForgotPassword}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressedDim}
            >
              <Text style={styles.link}>Mot de passe oublié ?</Text>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              onPress={onHelp}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressedDim}
            >
              <Text style={styles.link}>Aide &amp; contact</Text>
            </Pressable>
          </View>

          {/* Séparateur « ou » */}
          <View style={styles.dividerRow}>
            <View style={styles.rule} />
            <Text style={styles.dividerLabel}>ou</Text>
            <View style={styles.rule} />
          </View>

          {/* SSO — ouvre le sélecteur de fédération ; la confirmation authentifie. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Connexion SSO fédération"
            onPress={() => {
              Keyboard.dismiss();
              setSsoOpen(true);
            }}
            style={({ pressed }) => [styles.sso, pressed && styles.ssoPressed]}
          >
            <Lock size={18} color={L.sso.fg} />
            <Text style={styles.ssoLabel}>Connexion SSO fédération</Text>
          </Pressable>

          {/* Pousse le pied de page vers le bas quand le contenu est court. */}
          <View style={styles.flex} />

          {/* Pied de page — note d'affiliation FFB + barre d'adhésion. */}
          <View style={styles.footer}>
            <View style={styles.fbbNote}>
              {/* Le logo porte son propre fond blanc ; on le rogne en tuile
                  arrondie pour qu'il se lise comme une pastille blanche sur le
                  pied de page navy. */}
              <View style={styles.fbbMark}>
                <FFBLogo size={32} />
              </View>
              <Text style={styles.fbbText}>
                La FFIE est membre{"\n"}de la FFB
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pas encore adhérent ? Adhérer à la FFIE"
              onPress={() => {
                Keyboard.dismiss();
                onJoin?.();
              }}
              style={({ pressed }) => [styles.joinBar, pressed && styles.joinBarPressed]}
            >
              <Text style={styles.joinText}>
                Pas encore adhérent ? <Text style={styles.joinAccent}>Adhérer à la FFIE</Text>
              </Text>
              <ArrowRight size={16} color={L.accent} />
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: L.bg },
  flex: { flex: 1 },
  pressedDim: { opacity: 0.6 },

  header: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    position: "absolute",
    left: 12,
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: L.headerLabel,
    fontSize: 15,
    fontFamily: displayFamily("600"),
    fontWeight: "600",
    letterSpacing: 1,
  },

  scroll: {
    flexGrow: 1,
  },

  // Feuille blanche du formulaire — haut arrondi, s'étend pour remplir sous le bandeau teal.
  sheet: {
    flexGrow: 1,
    backgroundColor: L.sheet,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  brand: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  logoCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 16,
    color: L.title,
    fontSize: 26,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    color: L.subtitle,
    fontSize: 14,
    fontFamily: ralewayFamily("400"),
  },

  fields: {
    rowGap: 12,
  },
  field: {
    height: L.field.height,
    borderRadius: L.radius,
    paddingHorizontal: 16,
    backgroundColor: L.field.bg,
    borderWidth: 1,
    borderColor: L.field.border,
    color: L.field.text,
    fontSize: 16,
    fontFamily: ralewayFamily("400"),
  },
  fieldFocused: {
    borderColor: L.field.borderFocus,
  },

  cta: {
    marginTop: 16,
    height: L.cta.height,
    borderRadius: L.radius,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaActive: { backgroundColor: L.cta.bg },
  ctaPressed: { backgroundColor: L.cta.bgPressed },
  ctaDisabled: { backgroundColor: L.cta.bgDisabled },
  ctaLabel: {
    color: L.cta.fg,
    fontSize: 16,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  ctaLabelDisabled: { color: L.cta.fgDisabled },

  linkRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    color: L.link,
    fontSize: 13,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  dividerRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: L.divider,
  },
  dividerLabel: {
    color: L.footer.noteText, // navy sur la feuille blanche (pas le sous-titre blanc du bandeau)
    fontSize: 13,
    fontFamily: ralewayFamily("400"),
  },

  sso: {
    marginTop: 24,
    height: 52,
    borderRadius: L.radius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: L.sso.bg,
    borderWidth: 1,
    borderColor: L.sso.border,
  },
  ssoPressed: { backgroundColor: L.sso.bgPressed },
  ssoLabel: {
    color: L.sso.fg,
    fontSize: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
  },

  footer: {
    marginTop: 24,
    rowGap: 16,
  },
  fbbNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  fbbMark: {
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  fbbText: {
    color: L.footer.noteText,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: ralewayFamily("400"),
  },
  joinBar: {
    height: 52,
    borderRadius: L.radius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
    backgroundColor: L.footer.bg,
    borderWidth: 1,
    borderColor: L.footer.border,
  },
  joinBarPressed: { opacity: 0.7 },
  joinText: {
    color: L.footer.noteText, // navy sur la feuille blanche (pas le sous-titre blanc du bandeau)
    fontSize: 14,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
  },
  joinAccent: {
    color: L.accent,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
  },
});

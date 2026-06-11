// Connexion fédération — l'étape de redirection SSO.
//
// Une fois que l'adhérent a choisi sa fédération, cet écran représente la
// redirection OAuth / OIDC : la FFIE redirige vers la connexion sécurisée propre
// à CETTE fédération (le réseau d'identité FFB), la fédération vérifie l'adhérent
// et renvoie un jeton. Point crucial, la FFIE ne collecte jamais le mot de passe
// de l'adhérent — il est saisi sur la page de la fédération, pas ici. (Pourquoi
// pas de champ mot de passe : le WBS laisse le modèle d'authentification ouvert
// — « numéro d'adhérent ? SSO par e-mail ? autre chose ? » [questions ouvertes
// du DESIGN_BRIEF] — et une vraie app SSO ne doit pas relayer le mot de passe de
// la fédération. On modélise donc la redirection, pas un formulaire
// d'identifiants.)
//
// Maquette v1 : il n'y a pas de backend ni de vraie redirection, donc
// « Continuer » termine simplement (authentifie localement) — voir TESTFLIGHT.md
// / CLAUDE.md. En production, cela lance une redirection expo-auth-session vers
// le fournisseur d'identité de la fédération. Ne le reliez pas à un vrai
// fournisseur d'identité sans instruction explicite.
//
// Surface claire (themes.light), WCAG AA.

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ExternalLink, ShieldCheck } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { themes, primitives } from "@tokens";
import { type Federation } from "@/data/federations";
import { ralewayFamily, displayFamily } from "@/theme/fonts";

const t = themes.light;
const RADIUS = primitives.radii.lg; // 12
const TEAL = primitives.colors.brand.teal[700]; // #027489 — libellé blanc ≈5.4:1 (AA)
const TEAL_PRESSED = primitives.colors.brand.teal[800]; // #045764

export function FederationSignInScreen({
  federation,
  onBack,
  onSignIn,
}: {
  federation: Federation;
  onBack: () => void;
  // La fédération a vérifié l'adhérent (maquette v1 : Continuer le termine).
  onSignIn: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      <StatusBar style="dark" />

      {/* En-tête — le retour renvoie à la liste des fédérations. */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour à la liste des fédérations"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.dim]}
        >
          <ChevronLeft size={24} color={t.text.body} />
        </Pressable>
        <Text style={styles.headerTitle}>Connexion fédération</Text>
      </View>

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Cadre de sécurité — cela se passe du côté de la fédération, pas du nôtre. */}
          <View style={styles.secureBadge}>
            <ShieldCheck size={16} color={TEAL} />
            <Text style={styles.secureText}>
              Connexion sécurisée via le réseau de fédérations FFB
            </Text>
          </View>

          <Text accessibilityRole="header" style={styles.title}>
            Connectez-vous avec votre fédération
          </Text>
          <Text style={styles.subtitle}>
            Vous serez redirigé en toute sécurité vers votre fédération pour
            confirmer votre identité, puis ramené à la FFIE.
          </Text>

          {/* Quelle fédération vous vérifiera */}
          <View style={styles.fedCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{federation.code}</Text>
            </View>
            <View style={styles.fedText}>
              <Text style={styles.fedArea} numberOfLines={1}>
                {federation.area}
              </Text>
              <Text style={styles.fedName} numberOfLines={2}>
                {federation.name}
              </Text>
            </View>
          </View>

          {/* Réassurance — pourquoi il n'y a pas de mot de passe ici. */}
          <View style={styles.reassure}>
            <ShieldCheck size={18} color={TEAL} style={styles.reassureIcon} />
            <Text style={styles.reassureText}>
              Vous vous connectez sur la page de votre propre fédération — la FFIE
              ne voit jamais votre mot de passe. Votre fédération confirme votre
              adhésion et accorde l'accès.
            </Text>
          </View>
        </ScrollView>

        {/* Continuer → la redirection (maquette : termine la connexion). */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Continuer vers la connexion ${federation.area}`}
            onPress={onSignIn}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaLabel}>Continuer pour se connecter</Text>
            <ExternalLink size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: t.surface.default },
  dim: { opacity: 0.6 },

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
    color: t.text.body,
    fontSize: 15,
    fontFamily: displayFamily("600"),
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  body: { flex: 1, paddingHorizontal: 24 },
  scroll: { paddingTop: 8, paddingBottom: 16 },

  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: primitives.radii.md,
    backgroundColor: primitives.colors.brand.teal[50], // #E6F8FB
    alignSelf: "flex-start",
  },
  secureText: {
    color: t.text.muted,
    fontSize: 13,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
  },

  title: {
    marginTop: 16,
    color: t.text.body,
    fontSize: 24,
    fontFamily: displayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    color: t.text.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: ralewayFamily("400"),
  },

  fedCard: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    padding: 12,
    borderRadius: RADIUS,
    backgroundColor: t.surface.subtle,
    borderWidth: 1,
    borderColor: t.border.default,
  },
  badge: {
    minWidth: 40,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: t.border.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: t.text.body,
    fontSize: 13,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  fedText: { flex: 1 },
  fedArea: {
    color: t.text.body,
    fontSize: 15,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
  },
  fedName: {
    marginTop: 2,
    color: t.text.muted,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: ralewayFamily("400"),
  },

  reassure: {
    marginTop: 20,
    flexDirection: "row",
    columnGap: 10,
    padding: 14,
    borderRadius: RADIUS,
    backgroundColor: t.surface.subtle,
  },
  reassureIcon: { marginTop: 1 },
  reassureText: {
    flex: 1,
    color: t.text.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: ralewayFamily("400"),
  },

  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.border.default,
  },
  cta: {
    height: 56,
    borderRadius: RADIUS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: TEAL,
  },
  ctaPressed: { backgroundColor: TEAL_PRESSED },
  ctaLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});

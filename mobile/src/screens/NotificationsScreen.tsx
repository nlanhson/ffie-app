// Notifications — page de réglages minimale en passe-plat (option A).
//
// FFIE-PUSH-01 indique que les adhérents doivent pouvoir recevoir les alertes de
// la fédération. `expo-notifications` n'est pas encore branché, et la taxonomie
// des notifications du back-office (FFIE-BO-07) n'est pas encore définie — donc
// construire ici 4 bascules de catégorie serait prématuré.
//
// Cette page fait le minimum honnête : expliquer ce que la FFIE envoie, exposer
// l'état d'autorisation au niveau de l'OS (géré par l'appareil), et proposer un
// bouton de lien profond qui ouvre la page des réglages système pour cette app.
// À faire évoluer vers des désinscriptions par catégorie une fois le contrat du
// back-office en place.
//
// L'enveloppe dans un Modal glissant vers le haut est le travail de l'appelant —
// voir App.tsx MemberShell.

import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BellRing, ChevronLeft, ExternalLink } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";

const t = themes.light;

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      // Échoue silencieusement — le lien profond est au mieux-effort. L'utilisateur
      // peut tout de même aller dans Réglages → FFIE manuellement sur iOS / Android.
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      {/* Écran blanc — garde les icônes de barre d'état sombres même lorsqu'ouvert
          par-dessus le hero bleu marine de l'Accueil (qui les met claires). */}
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <ChevronLeft size={20} color={t.text.muted} />
          <Text style={styles.backLabel}>Retour</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            La FFIE envoie des alertes sur les actualités de la fédération, les mises
            à jour de documents et les changements réglementaires urgents. Gérez les
            alertes reçues sur cet appareil depuis vos réglages système.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <BellRing size={20} color={t.brand.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusLabel}>Statut</Text>
            <Text style={styles.statusValue}>Géré par votre appareil</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ouvrir les réglages de notification dans les réglages système de votre appareil"
          onPress={openSystemSettings}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaLabel}>Ouvrir les réglages de l'appareil</Text>
          <ExternalLink size={18} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.footer}>
          Les réglages par catégorie — actualités de la fédération, mises à jour de
          documents, alertes réglementaires — apparaîtront ici une fois configurés
          par la FFIE.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 32,
  },
  back: {
    height: 44,
    alignSelf: "flex-start",
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  backPressed: { opacity: 0.6 },
  backLabel: { color: t.text.muted, fontSize: 15 },
  header: {
    marginTop: 16,
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    color: "#0A0E18",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#5B6577",
    lineHeight: 20,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
    padding: 16,
    backgroundColor: "#F2F4F8",
    marginBottom: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    color: "#5B6577",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  statusValue: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    color: "#0A0E18",
  },
  cta: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: t.action.primary.bg,
  },
  ctaPressed: { backgroundColor: t.action.primary.bgPressed },
  ctaLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  footer: {
    marginTop: 28,
    fontSize: 12,
    color: t.text.muted,
    lineHeight: 18,
  },
});

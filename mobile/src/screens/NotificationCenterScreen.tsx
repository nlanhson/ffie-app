// Centre de notifications — la boîte de réception ouverte par la cloche en haut
// à droite de l'en-tête (AppHeader / HomeHeader).
//
// C'est le pendant « flux » de NotificationsScreen (qui, lui, ne gère que les
// réglages d'autorisation système). Ici on liste les alertes que la FFIE a
// poussées, groupées par récence (Aujourd'hui / Cette semaine / Plus tôt), avec
// une pastille « non lu » et un raccourci vers les réglages (l'engrenage).
//
// Les données viennent de src/data/notifications.ts (factices en v1 — voir la
// note d'en-tête là-bas). L'état lu/non-lu est local à l'écran : pas de backend
// en v1, donc « marquer comme lu » ne persiste pas entre les sessions — il
// reflète simplement l'interaction pendant la session, comme le reste des
// parcours simulés (CLAUDE.md : auth & adhésion simulées).
//
// L'enveloppe dans un Modal glissant vers le haut est le travail de l'appelant —
// voir App.tsx (MemberShell).

import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ChevronLeft, Settings2 } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import {
  NOTIFICATION_GROUPS,
  NOTIFICATION_META,
  NOTIFICATIONS,
  type AppNotification,
} from "@/data/notifications";

const t = themes.light;

// Résout la teinte sémantique d'une famille de notification vers une couleur du
// thème actif (les données restent abstraites — voir notifications.ts).
function toneColor(tone: "accent" | "info" | "success" | "warning"): string {
  switch (tone) {
    case "info":
      return t.feedback.info;
    case "success":
      return t.feedback.success;
    case "warning":
      return t.feedback.warning;
    default:
      return t.brand.accent;
  }
}

export function NotificationCenterScreen({
  onBack,
  onOpenSettings,
}: {
  onBack: () => void;
  /** Ouvrir les réglages de notification (l'engrenage en haut à droite). */
  onOpenSettings: () => void;
}) {
  // État lu/non-lu local à la session (pas de backend en v1 — voir l'en-tête).
  const [items, setItems] = React.useState<ReadonlyArray<AppNotification>>(NOTIFICATIONS);
  const hasUnread = items.some((n) => !n.read);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      {/* Écran blanc — garde les icônes de barre d'état sombres même lorsqu'ouvert
          par-dessus le hero bleu marine de l'Accueil (qui les met claires). */}
      <StatusBar style="dark" />

      {/* Barre supérieure : retour à gauche, engrenage des réglages à droite. */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={onBack}
          hitSlop={16}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ChevronLeft size={20} color={t.text.muted} />
          <Text style={styles.backLabel}>Retour</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Réglages des notifications"
          accessibilityHint="Ouvre les réglages d'autorisation des notifications"
          onPress={onOpenSettings}
          hitSlop={12}
          style={({ pressed }) => [styles.gear, pressed && styles.pressed]}
        >
          <Settings2 size={20} color={t.text.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Notifications
          </Text>
          {hasUnread ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tout marquer comme lu"
              onPress={markAllRead}
              hitSlop={10}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.markAll}>Tout marquer comme lu</Text>
            </Pressable>
          ) : null}
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyBody}>
              Vous serez alerté ici dès que la FFIE publiera une actualité, un
              document ou une mise à jour réglementaire.
            </Text>
          </View>
        ) : (
          NOTIFICATION_GROUPS.map(({ key, label }) => {
            const groupItems = items.filter((n) => n.group === key);
            if (groupItems.length === 0) return null;
            return (
              <View key={key} style={styles.section}>
                <Text style={styles.sectionLabel}>{label}</Text>
                <View style={styles.card}>
                  {groupItems.map((item, index) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      isLast={index === groupItems.length - 1}
                      onPress={() => markRead(item.id)}
                    />
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationRow({
  item,
  isLast,
  onPress,
}: {
  item: AppNotification;
  isLast: boolean;
  onPress: () => void;
}) {
  const meta = NOTIFICATION_META[item.kind];
  const Icon = meta.icon;
  const tint = toneColor(meta.tone);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.body}. ${item.timeLabel}${item.read ? "" : ". Non lu"}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: t.border.subtle }]}
    >
      <View style={[styles.iconTile, { backgroundColor: tint }]}>
        <Icon size={18} color="#FFFFFF" />
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.rowTop}>
          <Text style={[styles.rowTitle, !item.read && styles.rowTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{item.timeLabel}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
      </View>

      {/* Pastille « non lu » — un point, jamais la couleur seule (P : indépendance
          à la couleur) : la graisse du titre porte aussi l'état non-lu. */}
      {!item.read ? <View style={styles.unreadDot} accessibilityElementsHidden /> : null}

      {!isLast ? <View style={styles.separator} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    height: 44,
  },
  back: {
    height: 44,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  pressed: { opacity: 0.6 },
  backLabel: { color: t.text.muted, fontSize: 15 },
  gear: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: GUTTER,
    paddingBottom: 32,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    color: "#0A0E18",
    letterSpacing: -0.5,
  },
  markAll: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: ralewayFamily("600"),
    fontWeight: "600",
    color: t.brand.accent,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 13,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    color: t.text.muted,
    letterSpacing: 0.2,
    textTransform: "uppercase",
    marginLeft: 4,
    marginBottom: 8,
  },
  card: {
    backgroundColor: t.surface.subtle,
    borderRadius: primitives.radii.lg,
    borderWidth: 1,
    borderColor: t.border.subtle,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 12,
    paddingVertical: 14,
    paddingLeft: GUTTER,
    paddingRight: GUTTER,
    minHeight: 48,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
  },
  rowTitle: {
    flex: 1,
    fontSize: 15.5,
    fontFamily: ralewayFamily("500"),
    fontWeight: "500",
    color: t.text.body,
    letterSpacing: -0.2,
  },
  rowTitleUnread: {
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
  },
  time: {
    fontSize: 12,
    color: t.text.muted,
  },
  body: {
    marginTop: 3,
    fontSize: 13.5,
    lineHeight: 19,
    color: t.text.muted,
  },
  unreadDot: {
    position: "absolute",
    top: 18,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: t.feedback.danger,
  },
  separator: {
    position: "absolute",
    left: GUTTER + 34 + 12,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: t.border.default,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: ralewayFamily("700"),
    fontWeight: "700",
    color: t.text.body,
  },
  emptyBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: t.text.muted,
    textAlign: "center",
  },
});

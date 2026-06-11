// EventsView — corps de l'onglet Événements : un calendrier hebdomadaire balayable en
// haut, puis la liste des événements FFIE en dessous. Rendu dans le défilement du flux de
// l'onglet Actualités (il apporte sa propre gouttière, pas sa propre ScrollView).
//
// Les lignes reproduisent la liste des événements du web FFIE : un bloc de date accentué
// + un filet vertical accentué, le titre de l'événement et la marque FFIE. Taper une
// ligne ouvre son écran de détail via onOpenEvent.
//
// Les événements réservés aux adhérents (event.memberOnly) sont filtrés exactement comme
// les articles d'Actualités réservés aux adhérents : un invité voit la ligne grisée avec
// un cadenas, et taper la ligne redirige vers l'incitation à l'adhésion (onOpenLocked)
// plutôt que vers le détail. Aucun événement n'est encore marqué réservé aux adhérents —
// la capacité est câblée et prête.

import React, { useMemo } from "react";
import { Lock } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { WeekCalendar } from "@/components/ui/WeekCalendar";
import { FFIELogo } from "@/components/ui/FFIELogo";
import { canAccess, useRole } from "@/auth/roleContext";
import { EVENTS, type FfieEvent } from "@/data/events";

// Libellés de mois abrégés pour le bloc de date (correspond au traitement de date
// compact de la liste web).
const MONTHS_SHORT = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

function parseIso(iso: string): { day: number; month: number } {
  const [, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return { day: d, month: m - 1 };
}

export function EventsView({
  themeName = "light",
  onOpenEvent,
  onOpenLocked,
}: {
  themeName?: ThemeName;
  onOpenEvent: (id: number) => void;
  /** Un invité tapant un événement réservé aux adhérents atterrit ici (l'incitation à l'adhésion). */
  onOpenLocked: (id: number) => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const { role } = useRole();
  const canReadMemberContent = canAccess(role, "member-only");

  // Dates qui doivent afficher un point sur le calendrier.
  const eventDates = useMemo(() => new Set(EVENTS.map((e) => e.date)), []);

  return (
    <View style={{ paddingHorizontal: GUTTER, paddingTop: 8 }}>
      <WeekCalendar themeName={themeName} eventDates={eventDates} />

      {/* Séparateur entre le calendrier et la liste. */}
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: t.border.default,
          marginTop: 18,
          marginBottom: 4,
        }}
      />

      {EVENTS.map((event, i) => {
        // Événement réservé aux adhérents + un invité → grisé, le tap mène à l'incitation.
        const locked = !!event.memberOnly && !canReadMemberContent;
        return (
          <EventRow
            key={event.id}
            event={event}
            themeName={themeName}
            locked={locked}
            showSeparator={i < EVENTS.length - 1}
            separatorColor={c.separator}
            onPress={() => (locked ? onOpenLocked(event.id) : onOpenEvent(event.id))}
          />
        );
      })}
    </View>
  );
}

function EventRow({
  event,
  themeName,
  locked,
  showSeparator,
  separatorColor,
  onPress,
}: {
  event: FfieEvent;
  themeName: ThemeName;
  locked: boolean;
  showSeparator: boolean;
  separatorColor: string;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const { day, month } = parseIso(event.date);

  // Verrouillé = grisé : l'accent (bloc de date + filet) passe en atténué, le titre
  // s'estompe, et une étiquette cadenas apparaît. La couleur n'est jamais le seul signal —
  // l'icône cadenas + le libellé « Adhérents » le portent aussi (P4).
  const accentColor = locked ? t.text.muted : t.brand.accent;
  const ruleColor = locked ? t.border.default : t.brand.accent;
  const titleColor = locked ? t.text.muted : t.text.body;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, le ${day} ${MONTHS_SHORT[month]}.${
        locked ? " Réservé aux adhérents." : ""
      }`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        borderBottomWidth: showSeparator ? StyleSheet.hairlineWidth : 0,
        borderBottomColor: separatorColor,
        backgroundColor: pressed ? t.surface.subtle : "transparent",
        opacity: locked ? 0.6 : 1,
      })}
    >
      {/* Bloc de date — le jour au-dessus du mois abrégé. */}
      <View style={{ width: 52, alignItems: "flex-end" }}>
        <Text
          style={{
            color: accentColor,
            fontSize: 22,
            lineHeight: 24,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.5,
          }}
        >
          {String(day).padStart(2, "0")}
        </Text>
        <Text
          style={{
            color: accentColor,
            fontSize: 11,
            fontFamily: ralewayFamily("600"),
            fontWeight: "600",
            letterSpacing: 0.3,
            textTransform: "uppercase",
            marginTop: 1,
          }}
        >
          {MONTHS_SHORT[month]}
        </Text>
      </View>

      {/* Filet vertical. */}
      <View
        style={{
          width: 3,
          alignSelf: "stretch",
          minHeight: 40,
          borderRadius: 1.5,
          backgroundColor: ruleColor,
          marginHorizontal: 14,
        }}
      />

      {/* Titre + (si verrouillé) une étiquette réservé aux adhérents. */}
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{
            color: titleColor,
            fontSize: 16.5,
            lineHeight: 22,
            fontFamily: ralewayFamily("600"),
            fontWeight: "600",
            letterSpacing: -0.2,
          }}
        >
          {event.title}
        </Text>
        {locked ? (
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4, marginTop: 5 }}>
            <Lock size={12} color={t.text.muted} />
            <Text
              style={{
                fontSize: 11,
                color: t.text.muted,
                fontFamily: ralewayFamily("500"),
                fontWeight: "500",
              }}
            >
              Adhérents
            </Text>
          </View>
        ) : null}
      </View>

      {/* Marque FFIE. */}
      <View style={{ marginLeft: 12 }}>
        <FFIELogo size={42} themeName={themeName} />
      </View>
    </Pressable>
  );
}

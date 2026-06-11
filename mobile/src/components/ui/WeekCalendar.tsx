// WeekCalendar — une bande calendrier d'une semaine de hauteur pour l'onglet Événements.
// Affiche les sept jours d'une semaine (lun–dim, en français) avec le mois/année au-dessus ;
// l'utilisateur balaie à gauche/droite ou appuie sur les chevrons pour passer à la semaine
// précédente/suivante.
//
// Semaines infinies via l'astuce classique des trois pages : le pager horizontal contient
// toujours [préc., courante, suiv.] et reste calé sur la page du milieu. Un balayage se pose
// sur une page latérale, on décale la semaine de ±1 et on revient brusquement au centre
// (sans animation) — ainsi le contenu sous le doigt est continu et on peut paginer à l'infini
// sans liste géante. Les appuis sur les chevrons changent simplement la semaine sur place
// (pas de défilement), ce qui les rend instantanés et compatibles avec le mouvement réduit.
//
// Les jours qui ont un événement reçoivent un point ; aujourd'hui reçoit un anneau d'accent ;
// le jour sélectionné reçoit un disque d'accent plein. La sélection est interne (aujourd'hui
// par défaut) et exposée via onSelectDate pour les appelants qui veulent y réagir.

import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { MonthYearPickerModal } from "@/components/ui/MonthYearPickerModal";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Noms français des jours + des mois. La semaine commence le lundi (ISO / France).
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

// --- utilitaires de date (dates civiles locales, sans calcul de fuseau horaire) ---
function midnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function startOfWeek(d: Date): Date {
  const x = midnight(d);
  const monIndex = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - monIndex);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function WeekCalendar({
  themeName = "light",
  eventDates,
  onSelectDate,
}: {
  themeName?: ThemeName;
  /** Ensemble de dates ISO (aaaa-mm-jj) qui doivent afficher un point d'événement. */
  eventDates: Set<string>;
  onSelectDate?: (iso: string) => void;
}) {
  const t = themes[themeName];

  // « Aujourd'hui » et la sélection initiale, calculés une fois pour rester stables.
  const [todayIso] = useState(() => isoDate(new Date()));
  const [selected, setSelected] = useState(todayIso);

  // Quelle semaine est centrée, par rapport à la semaine contenant aujourd'hui.
  const [weekOffset, setWeekOffset] = useState(0);

  // Géométrie du pager : on ne peut positionner les trois pages qu'une fois la
  // largeur de la bande connue, donc le pager s'affiche après la première passe de layout.
  const [width, setWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const didCentre = useRef(false);

  useEffect(() => {
    if (width > 0 && !didCentre.current) {
      scrollRef.current?.scrollTo({ x: width, animated: false });
      didCentre.current = true;
    }
  }, [width]);

  const baseMonday = startOfWeek(new Date());

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== width) setWidth(w);
  };

  // Un balayage qui se pose sur une page latérale décale la semaine et recentre pour
  // que le pager puisse continuer indéfiniment.
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width <= 0) return;
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    if (page !== 1) {
      setWeekOffset((o) => o + (page - 1));
      scrollRef.current?.scrollTo({ x: width, animated: false });
    }
  };

  const select = (iso: string) => {
    setSelected(iso);
    onSelectDate?.(iso);
  };

  // Sélecteur de mois/année système (appuyer sur le libellé de l'en-tête l'ouvre).
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sauter à la semaine contenant une date choisie, et sélectionner ce jour. weekOffset
  // est mesuré en semaines entières depuis la semaine d'aujourd'hui ; round() absorbe toute heure de changement d'heure.
  const jumpToDate = (date: Date) => {
    const target = startOfWeek(date);
    const offset = Math.round((target.getTime() - startOfWeek(new Date()).getTime()) / WEEK_MS);
    setWeekOffset(offset);
    select(isoDate(date));
    setPickerOpen(false);
  };

  // Libellé de l'en-tête : le mois dominant de la semaine centrée (son jeudi).
  const centreMonday = addDays(baseMonday, weekOffset * 7);
  const labelDate = addDays(centreMonday, 3);
  const headerLabel = `${capitalize(MONTHS[labelDate.getMonth()])} ${labelDate.getFullYear()}`;
  // Le sélecteur s'ouvre sur le mois affiché (son premier jour).
  const pickerValue = new Date(labelDate.getFullYear(), labelDate.getMonth(), 1);

  return (
    <View>
      {/* Navigation mois + semaine */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <WeekArrow
          dir="left"
          color={t.brand.accent}
          onPress={() => setWeekOffset((o) => o - 1)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${headerLabel}. Choisir le mois et l'année`}
          onPress={() => setPickerOpen(true)}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 4,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text
            accessibilityRole="header"
            style={{
              color: t.text.body,
              fontSize: 16,
              fontFamily: ralewayFamily("700"),
              fontWeight: "700",
              letterSpacing: -0.2,
            }}
          >
            {headerLabel}
          </Text>
          <ChevronDown size={16} color={t.brand.accent} />
        </Pressable>
        <WeekArrow
          dir="right"
          color={t.brand.accent}
          onPress={() => setWeekOffset((o) => o + 1)}
        />
      </View>

      {/* Pager de semaine balayable — trois pages calées sur celle du milieu. */}
      <View onLayout={handleLayout}>
        {width > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            contentOffset={{ x: width, y: 0 }}
            // Les trois pages sont interchangeables ; des clés React par offset
            // remonteraient à chaque décalage, donc on utilise plutôt un slot relatif comme clé.
          >
            {[-1, 0, 1].map((slot) => (
              <WeekRow
                key={slot}
                width={width}
                monday={addDays(baseMonday, (weekOffset + slot) * 7)}
                themeName={themeName}
                todayIso={todayIso}
                selected={selected}
                eventDates={eventDates}
                onSelect={select}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <MonthYearPickerModal
        visible={pickerOpen}
        value={pickerValue}
        themeName={themeName}
        onConfirm={jumpToDate}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

// Une semaine de sept cellules de jour, dimensionnée pour exactement une page du pager.
function WeekRow({
  width,
  monday,
  themeName,
  todayIso,
  selected,
  eventDates,
  onSelect,
}: {
  width: number;
  monday: Date;
  themeName: ThemeName;
  todayIso: string;
  selected: string;
  eventDates: Set<string>;
  onSelect: (iso: string) => void;
}) {
  const t = themes[themeName];

  return (
    <View style={{ width, flexDirection: "row" }}>
      {Array.from({ length: 7 }, (_, i) => {
        const day = addDays(monday, i);
        const iso = isoDate(day);
        const isSelected = iso === selected;
        const isToday = iso === todayIso;
        const hasEvent = eventDates.has(iso);

        return (
          <Pressable
            key={iso}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${WEEKDAYS[i]} ${day.getDate()}${hasEvent ? ", événement" : ""}`}
            onPress={() => onSelect(iso)}
            style={{ flex: 1, alignItems: "center", paddingVertical: 2 }}
          >
            <Text
              style={{
                color: t.text.muted,
                fontSize: 11,
                fontFamily: ralewayFamily("600"),
                fontWeight: "600",
                marginBottom: 6,
              }}
            >
              {WEEKDAYS[i]}
            </Text>

            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSelected ? t.brand.accent : "transparent",
                borderWidth: !isSelected && isToday ? 1.5 : 0,
                borderColor: t.brand.accent,
              }}
            >
              <Text
                style={{
                  color: isSelected
                    ? "#FFFFFF"
                    : isToday
                      ? t.brand.accent
                      : t.text.body,
                  fontSize: 15,
                  fontFamily: ralewayFamily(isSelected || isToday ? "700" : "500"),
                  fontWeight: isSelected || isToday ? "700" : "500",
                }}
              >
                {day.getDate()}
              </Text>
            </View>

            {/* Indicateur d'événement — couleur + position (jamais la couleur seule, P4 : il
                se place aussi sous le numéro, associé à la liste de logos de la ligne). */}
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                marginTop: 5,
                backgroundColor: hasEvent ? t.brand.accent : "transparent",
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

function WeekArrow({
  dir,
  color,
  onPress,
}: {
  dir: "left" | "right";
  color: string;
  onPress: () => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={dir === "left" ? "Semaine précédente" : "Semaine suivante"}
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Icon size={22} color={color} />
    </Pressable>
  );
}

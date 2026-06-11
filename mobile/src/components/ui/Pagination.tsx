// Pagination — indicateur de page en bas de liste avec des flèches préc./suiv., une
// fenêtre centrée de numéros de page, et des écarts en pointillés là où des pages sont
// sautées. Extrait du fil d'Actualités pour que chaque liste paginée (Actualités,
// Bibliothèque) partage un même aspect et un même comportement — la même raison pour
// laquelle FilterControls a été extrait de la Bibliothèque.
//
// Appuyer sur un numéro ou une flèche rappelle avec la page cible ; le composant est
// contrôlé (l'appelant possède `page` et réaffiche la liste).

import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";

// Construit les jetons de l'indicateur de page : toujours la première et la dernière page,
// une fenêtre large de 3 centrée sur la page courante (décalée vers l'intérieur aux bords
// pour rester à 3 numéros), et des marqueurs « gap » (chaînes uniques, pour les clés React)
// partout où une série de pages est sautée. Renvoie par ex. [1,"gap-1",6,7,8,"gap-8",130] pour la page 7.
export function buildPageTokens(page: number, total: number): (number | string)[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  let start = page - 1;
  let end = page + 1;
  if (start < 1) {
    start = 1;
    end = 3;
  }
  if (end > total) {
    end = total;
    start = total - 2;
  }

  const set = new Set<number>([1, total]);
  for (let p = start; p <= end; p++) set.add(p);

  const sorted = [...set].sort((a, b) => a - b);
  const tokens: (number | string)[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) tokens.push(`gap-${prev}`);
    tokens.push(p);
    prev = p;
  }
  return tokens;
}

export function Pagination({
  themeName,
  page,
  totalPages,
  onPrev,
  onNext,
  onJump,
}: {
  themeName: ThemeName;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (p: number) => void;
}) {
  const t = themes[themeName];
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  // Jetons à rendre : la première page, une fenêtre large de 3 centrée sur la page
  // courante (décalée vers l'intérieur aux bords), la dernière page, et des écarts en
  // pointillés là où des numéros sont sautés. par ex. page 7 → 1 … 6 7 8 … 130 ; page 1 → 1 2 3 … 130.
  // Les jetons de type chaîne sont des marqueurs d'écart (gardés uniques par position pour les clés React).
  const tokens = buildPageTokens(page, totalPages);

  const Arrow = ({
    dir,
    disabled,
    onPress,
  }: {
    dir: "left" | "right";
    disabled: boolean;
    onPress: () => void;
  }) => {
    const Icon = dir === "left" ? ChevronLeft : ChevronRight;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={dir === "left" ? "Page précédente" : "Page suivante"}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        hitSlop={6}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: t.border.default,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed && !disabled ? t.border.subtle : "transparent",
          opacity: disabled ? 0.35 : 1,
        })}
      >
        <Icon size={20} color={disabled ? t.text.muted : t.brand.accent} />
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 14,
        marginTop: 28,
        paddingHorizontal: GUTTER,
      }}
    >
      <Arrow dir="left" disabled={atStart} onPress={onPrev} />

      <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
        {tokens.map((tok) => {
          if (typeof tok === "string") {
            // Écart en pointillés (points de suspension) là où une série de pages est sautée.
            return (
              <Text
                key={tok}
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{
                  color: t.text.muted,
                  fontSize: 16,
                  paddingHorizontal: 2,
                  letterSpacing: 1,
                }}
              >
                …
              </Text>
            );
          }
          const active = tok === page;
          return (
            <Pressable
              key={tok}
              accessibilityRole="button"
              accessibilityLabel={`Page ${tok}`}
              accessibilityState={{ selected: active }}
              onPress={() => onJump(tok)}
              hitSlop={4}
              style={({ pressed }) => ({
                minWidth: 30,
                height: 30,
                borderRadius: 15,
                paddingHorizontal: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active
                  ? t.brand.accent
                  : pressed
                    ? t.border.subtle
                    : "transparent",
              })}
            >
              <Text
                style={{
                  color: active ? "#FFFFFF" : t.text.muted,
                  fontSize: 14,
                  fontFamily: ralewayFamily("600"),
                  fontWeight: "600",
                }}
              >
                {tok}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Arrow dir="right" disabled={atEnd} onPress={onNext} />
    </View>
  );
}

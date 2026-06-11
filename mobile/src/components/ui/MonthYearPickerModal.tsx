// MonthYearPickerModal — enveloppe le sélecteur de date de l'OS pour que l'utilisateur
// puisse faire sauter le calendrier-semaine des Événements à un mois/année choisi. Utilise
// le sélecteur *système* (@react-native-community/datetimepicker), qui a donc l'aspect et
// le comportement natifs sur chaque plateforme :
//
//   • iOS     → la molette se trouve dans une feuille du bas avec Annuler / OK.
//               (iOS n'a pas de mode mois-année seul, donc c'est une molette de date
//               complète ; on n'utilise que le mois + l'année — l'appelant cale sur cette semaine.)
//   • Android → la boîte de dialogue de l'OS se présente d'elle-même ; on ne fait que traduire son résultat.
//
// Mouvement réduit (P5) : la feuille iOS n'utilise aucune animation de glissement quand
// l'utilisateur a activé le mouvement réduit.
//
// IMPORTANT — comme FederationMap, le sélecteur natif est chargé avec un
// `require()` protégé plutôt qu'un `import` statique : la bibliothèque appelle
// `TurboModuleRegistry.getEnforcing('RNCDatePicker')` dès que son JS s'évalue,
// ce qui *lève une exception* sur tout binaire qui n'a pas le module lié
// (Expo Go, ou un dev client construit avant l'ajout de
// `@react-native-community/datetimepicker`). On (a) vérifie donc d'abord
// `TurboModuleRegistry.get` et ne fait `require` que quand le module est réellement lié,
// et (b) on se replie sinon sur un court avis « reconstruction requise ». Exécuter
// `npx expo run:ios` (ou reconstruire le dev client) pour le lier ; les builds
// production/EAS l'incluent automatiquement.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
// Import de type uniquement — effacé à la compilation, il ne touche donc jamais le module natif.
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type PickerComponent = React.ComponentType<{
  value: Date;
  mode?: "date" | "time" | "datetime";
  display?: "default" | "spinner" | "compact" | "inline" | "calendar" | "clock";
  locale?: string;
  textColor?: string;
  themeVariant?: "light" | "dark";
  onChange?: (event: DateTimePickerEvent, date?: Date) => void;
  style?: object;
}>;

// Résout le sélecteur natif PARESSEUSEMENT (au premier rendu), enveloppé dans try/catch.
// La spec de la bibliothèque fait `TurboModuleRegistry.getEnforcing('RNCDatePicker')` à
// l'import, ce qui lève une exception sur un binaire dépourvu du module — on le require donc
// à l'exécution (quand le proxy TurboModule est prêt) et on se replie sur null s'il lève.
// Un `.get` en tête de module s'exécute trop tôt dans l'évaluation du bundle pour être fiable.
function loadPicker(): PickerComponent | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("@react-native-community/datetimepicker").default as PickerComponent;
  } catch {
    return null;
  }
}

export function MonthYearPickerModal({
  visible,
  value,
  onConfirm,
  onClose,
  themeName = "light",
}: {
  visible: boolean;
  /** Date sur laquelle le sélecteur s'ouvre (le mois actuellement affiché). */
  value: Date;
  /** Appelé avec la date choisie quand l'utilisateur confirme. */
  onConfirm: (date: Date) => void;
  onClose: () => void;
  themeName?: ThemeName;
}) {
  const t = themes[themeName];
  const reducedMotion = useReducedMotion();

  // Résout le sélecteur natif une fois, paresseusement (l'exécution est prête au premier rendu).
  const DateTimePicker = useMemo(loadPicker, []);

  // iOS modifie un brouillon jusqu'à OK ; Android valide directement depuis la boîte de dialogue.
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  // Animation d'ouverture/fermeture iOS (déclarée avant les retours anticipés pour garder
  // l'ordre des hooks stable). Une unique valeur de progression 0→1 pilote À LA FOIS
  // l'opacité de l'arrière-plan (le noir teinté s'estompe) et le translateY de la feuille
  // (elle glisse) — opacité + transform seulement, elle roule donc sur le pilote natif. On
  // garde la modale montée pendant la sortie pour que le fondu de sortie puisse se jouer
  // avant qu'elle se démonte. Mouvement réduit (P5) : transition instantanée, sans fondu/glissement.
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [mounted, setMounted] = useState(visible);
  const [sheetH, setSheetH] = useState(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      if (reducedMotion) {
        anim.setValue(1);
        return;
      }
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.bezier(0.32, 0.72, 0, 1), // courbe du tiroir iOS
        useNativeDriver: true,
      }).start();
    } else {
      if (reducedMotion) {
        anim.setValue(0);
        setMounted(false);
        return;
      }
      Animated.timing(anim, {
        toValue: 0,
        duration: 200, // sortie un brin plus rapide que l'entrée
        easing: Easing.bezier(0.32, 0.72, 0, 1),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, reducedMotion, anim]);

  // Module natif manquant (binaire non reconstruit) : afficher un avis élégant au lieu
  // de planter. Les builds de production l'ont toujours.
  if (!DateTimePicker) {
    if (!visible) return null;
    return (
      <Modal
        visible={visible}
        transparent
        animationType={reducedMotion ? "none" : "fade"}
        onRequestClose={onClose}
      >
        <Pressable
          onPress={onClose}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 32 }}
        >
          <View
            style={{
              backgroundColor: t.surface.default,
              borderRadius: primitives.radii.lg,
              padding: 20,
            }}
          >
            <Text style={{ color: t.text.body, fontSize: 15, lineHeight: 21 }}>
              Le sélecteur de date nécessite une reconstruction de l'application.
            </Text>
          </View>
        </Pressable>
      </Modal>
    );
  }

  // Android : l'OS possède la boîte de dialogue. Rendre le sélecteur uniquement quand
  // visible et remapper son callback vers confirm/close.
  if (Platform.OS !== "ios") {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="spinner"
        onChange={(e: DateTimePickerEvent, d?: Date) => {
          if (e.type === "set" && d) onConfirm(d);
          else onClose();
        }}
      />
    );
  }

  // iOS : molette en ligne dans une feuille du bas. L'animation de la Modal est « none » —
  // on pilote nous-mêmes le fondu de l'arrière-plan + le glissement de la feuille pour que
  // le noir teinté s'estompe (plutôt que de remonter avec la feuille).
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetH || 600, 0], // 600 = repli avant mesure (reste hors écran)
  });

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      {/* Arrière-plan noir teinté — apparaît/disparaît en fondu via l'opacité. */}
      <Animated.View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", opacity: anim }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={onClose}
          style={{ flex: 1 }}
        />
      </Animated.View>
      <Animated.View
        onLayout={(e: LayoutChangeEvent) => setSheetH(e.nativeEvent.layout.height)}
        style={{
          backgroundColor: t.surface.default,
          borderTopLeftRadius: primitives.radii.xl,
          borderTopRightRadius: primitives.radii.xl,
          paddingBottom: 28,
          transform: [{ translateY }],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border.default,
          }}
        >
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={{ color: t.text.muted, fontSize: 16 }}>Annuler</Text>
          </Pressable>
          <Text
            style={{
              color: t.text.body,
              fontSize: 15,
              fontFamily: ralewayFamily("700"),
              fontWeight: "700",
            }}
          >
            Choisir le mois
          </Text>
          <Pressable onPress={() => onConfirm(draft)} hitSlop={8}>
            <Text
              style={{
                color: t.brand.accent,
                fontSize: 16,
                fontFamily: ralewayFamily("700"),
                fontWeight: "700",
              }}
            >
              OK
            </Text>
          </Pressable>
        </View>

        <DateTimePicker
          value={draft}
          mode="date"
          display="spinner"
          locale="fr-FR"
          textColor={t.text.body}
          themeVariant={themeName === "dark" ? "dark" : "light"}
          onChange={(_e: DateTimePickerEvent, d?: Date) => {
            if (d) setDraft(d);
          }}
          style={{ alignSelf: "stretch" }}
        />
      </Animated.View>
    </Modal>
  );
}

// Custom iOS-style numeric keypad.
//
// We render this in-app (rather than rely on TextInput's `number-pad`
// keyboard) so the keypad style is identical across iOS + Android, the
// letter subscripts are visible (1, 2 ABC, 3 DEF …), and so the keypad
// sits inside the bottom sheet rather than floating above it.
//
// Layout matches the reference:
//   row 1: 1   2(ABC)   3(DEF)
//   row 2: 4(GHI) 5(JKL) 6(MNO)
//   row 3: 7(PQRS) 8(TUV) 9(WXYZ)
//   row 4: ·     0        ⌫
// All keys are equal-width, ~48pt tall, with subtle borders + light fill.

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Delete } from "lucide-react-native";
import { auth } from "@/screens/auth/tokens";
import { ralewayFamily } from "@/theme/fonts";

type Key =
  | { kind: "digit"; digit: string; letters?: string }
  | { kind: "backspace" }
  | { kind: "noop" };

const KEYS: Key[] = [
  { kind: "digit", digit: "1" },
  { kind: "digit", digit: "2", letters: "ABC" },
  { kind: "digit", digit: "3", letters: "DEF" },
  { kind: "digit", digit: "4", letters: "GHI" },
  { kind: "digit", digit: "5", letters: "JKL" },
  { kind: "digit", digit: "6", letters: "MNO" },
  { kind: "digit", digit: "7", letters: "PQRS" },
  { kind: "digit", digit: "8", letters: "TUV" },
  { kind: "digit", digit: "9", letters: "WXYZ" },
  { kind: "noop" },
  { kind: "digit", digit: "0" },
  { kind: "backspace" },
];

export function NumericKeypad({
  onDigit,
  onBackspace,
}: {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
}) {
  return (
    <View style={styles.grid}>
      {KEYS.map((k, i) => (
        <View key={i} style={styles.cell}>
          <KeypadKey
            keyDef={k}
            onDigit={onDigit}
            onBackspace={onBackspace}
          />
        </View>
      ))}
    </View>
  );
}

function KeypadKey({
  keyDef,
  onDigit,
  onBackspace,
}: {
  keyDef: Key;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
}) {
  if (keyDef.kind === "noop") {
    return <View style={styles.keyInvisible} />;
  }

  const handlePress =
    keyDef.kind === "digit"
      ? () => onDigit(keyDef.digit)
      : onBackspace;

  const a11yLabel =
    keyDef.kind === "digit"
      ? keyDef.letters
        ? `${keyDef.digit}, ${keyDef.letters}`
        : keyDef.digit
      : "Effacer";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.key,
        pressed && styles.keyPressed,
        keyDef.kind === "backspace" && styles.keyBackspace,
      ]}
    >
      {keyDef.kind === "digit" ? (
        <>
          <Text style={styles.digit}>{keyDef.digit}</Text>
          {keyDef.letters ? <Text style={styles.letters}>{keyDef.letters}</Text> : null}
        </>
      ) : (
        <Delete size={22} color="#1F2937" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: auth.keypad.keypadPaddingX,
    paddingTop: auth.keypad.keypadPaddingTop,
    paddingBottom: auth.keypad.keypadPaddingBottom,
    rowGap: auth.keypad.rowGap,
  },
  cell: {
    width: "33.333%",
    padding: auth.keypad.keyGap / 2,
  },
  key: {
    height: auth.keypad.keyHeight,
    borderRadius: auth.keypad.keyRadius,
    backgroundColor: auth.keypad.keyBg,
    borderWidth: 1,
    borderColor: auth.keypad.keyBorderColor,
    alignItems: "center",
    justifyContent: "center",
  },
  keyPressed: {
    backgroundColor: "#EEF1F6",
  },
  keyBackspace: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  keyInvisible: {
    height: auth.keypad.keyHeight,
  },
  digit: {
    fontSize: auth.keypad.digitFontSize,
    fontWeight: auth.keypad.digitFontWeight,
    color: "#0A0E18",
    lineHeight: auth.keypad.digitFontSize + 4,
  },
  letters: {
    fontSize: auth.keypad.lettersFontSize,
    color: "#4B5563",
    letterSpacing: auth.keypad.lettersLetterSpacing,
    marginTop: -2,
    fontFamily: ralewayFamily("600"), fontWeight: "600",
  },
});

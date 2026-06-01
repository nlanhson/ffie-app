// 6-position OTP display. Renders six circular pills that:
//   - show a tinted "current" pill on the next-to-fill position before any
//     digit is entered, matching the iOS-native code-entry pattern
//   - fill left-to-right with the typed digits in a darker tint
//
// Stateless — driven entirely by the `value` string passed in. Auto-submit
// is the caller's concern (watch for value.length === length).

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth } from "@/screens/auth/tokens";

export function OtpDots({
  value,
  length = 6,
}: {
  value: string;
  length?: number;
}) {
  const digits = value.split("").slice(0, length);
  const cursor = digits.length;

  return (
    <View style={styles.row} accessibilityLabel={`Code : ${digits.length} chiffres sur ${length} saisis`}>
      {Array.from({ length }).map((_, i) => {
        const digit = digits[i];
        const isCurrent = i === cursor && !digit;
        const isFilled = Boolean(digit);

        const bg = isFilled
          ? auth.otp.dotActiveBg
          : isCurrent
            ? auth.otp.dotCurrentBg
            : auth.otp.dotInactiveBg;

        return (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: bg },
            ]}
          >
            {digit ? <Text style={styles.digit}>{digit}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: auth.otp.dotGap,
  },
  dot: {
    width: auth.otp.dotSize,
    height: auth.otp.dotSize,
    borderRadius: auth.otp.dotSize / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    color: auth.otp.dotDigitColor,
    fontSize: auth.otp.dotDigitFontSize,
    fontWeight: auth.otp.dotDigitFontWeight,
  },
});

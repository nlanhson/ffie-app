// Global default font — React 19 compatible.
//
// The app's design language is Raleway for body text. We want every <Text>
// to inherit Raleway 400 unless it sets its own fontFamily, so screens don't
// each have to repeat it.
//
// The classic way to do this was `Text.defaultProps.style = {...}`. That no
// longer works: React 19 removed defaultProps support for function components,
// and React Native's Text (RN 0.81) is a function component — so the mutation
// is silently ignored and body text falls back to the OS font (San Francisco
// on iOS, Roboto on Android). That mismatch is exactly the cross-platform
// inconsistency this fixes.
//
// Instead we re-wrap the `Text` export on the react-native module object with
// a thin component that injects the default family. react-native/index.js
// exposes `Text` via a configurable object-literal getter, so redefining it
// here is safe, and Babel's CJS interop reads `_reactNative.Text` at each use
// site, so every screen picks up the wrapped version. Imported first in
// index.ts, before the app renders.
//
// Note: this only affects app-level `import { Text } from "react-native"`.
// React Native's own internals import Text directly from its source path, so
// they are intentionally untouched.
//
// Android weight fix: our families are weight-specific (e.g. "Sora_700Bold",
// "Raleway_500Medium") — the weight is baked into the family name. On Android,
// pairing such a family with a numeric `fontWeight` ("700") makes the platform
// try to find that weight *within* the family, fail (each Expo Google Font is
// registered as its own single-weight family), and fall back to Roboto. That's
// why page titles (Sora 700) rendered as the system font on Android while iOS
// — which resolves the exact face from the family name and ignores the
// redundant weight — looked correct. The fix is to drop `fontWeight` on
// Android so the family name alone drives the rendered weight. iOS keeps its
// fast array path unchanged.

import React from "react";
import { Platform, StyleSheet, type Text as RNTextType } from "react-native";
import { ralewayFamily } from "./fonts";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RN = require("react-native") as { Text: typeof RNTextType };

const OriginalText = RN.Text;
const DEFAULT_TEXT_STYLE = { fontFamily: ralewayFamily("400") };

type TextProps = React.ComponentProps<typeof RNTextType>;

// Android: flatten the merged style and strip `fontWeight`. The family name
// carries the weight, so this renders the intended custom face instead of a
// faux-bold system fallback. Shape-only change; iOS is untouched.
function stripWeightForAndroid(style: TextProps["style"]): TextProps["style"] {
  const flat = StyleSheet.flatten(style);
  if (flat && flat.fontWeight != null) {
    const { fontWeight, ...rest } = flat;
    return rest;
  }
  return flat;
}

// Wrapper: default family first so any caller-provided style (incl. its own
// fontFamily) wins. Spreads all props (children, ref, accessibility, …).
function Text(props: TextProps) {
  const merged = props.style ? [DEFAULT_TEXT_STYLE, props.style] : DEFAULT_TEXT_STYLE;
  const style = Platform.OS === "android" ? stripWeightForAndroid(merged) : merged;
  return React.createElement(OriginalText, { ...props, style });
}
Text.displayName = "Text";

Object.defineProperty(RN, "Text", {
  configurable: true,
  enumerable: true,
  get() {
    return Text;
  },
});

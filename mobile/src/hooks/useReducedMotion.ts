// useReducedMotion — read the OS "Reduce Motion" setting once and subscribe to
// changes. Vestibular safety is non-negotiable (P5 / inclusive-interaction):
// any looping or transitional motion must collapse to a static state when this
// returns true.
//
// Extracted from the inline copy that lived in BecomeMemberScreen so the
// skeleton shimmer and other animated surfaces share one source of truth.

import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) =>
      setReduced(v)
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}

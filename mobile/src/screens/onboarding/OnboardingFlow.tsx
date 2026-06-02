// Onboarding flow — the state machine that walks the user from app launch
// to the main app (doc library).
//
// State graph (v0.7 — both paths are slide-up overlays on Welcome):
//   splash → path:
//     "Log in"         → EmailEntryScreen → OtpEntryScreen → DONE (member)
//     "Browse freely"  → DiscoverPlaceholderScreen          → DONE (public)
//
// Both paths render inside slide-up Modals presented over the Welcome
// screen. Back from email → dismisses to Welcome; back from OTP →
// returns to email; back from Discover → dismisses to Welcome.
//
// In production: persist `done` + `mode` in SecureStore / AsyncStorage so
// the user only sees onboarding once. For the design-preview shell, state
// lives in memory and a debug "Reset onboarding" control replays it.

import React, { useCallback, useState } from "react";
import { Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { type ThemeName } from "@tokens";
import { SplashScreen } from "./SplashScreen";
import { PathSelectionScreen, type OnboardingPath } from "./PathSelectionScreen";
import { DiscoverPlaceholderScreen } from "./DiscoverPlaceholderScreen";
import { EmailEntryScreen } from "@/screens/auth/EmailEntryScreen";
import { OtpEntryScreen } from "@/screens/auth/OtpEntryScreen";

export type OnboardingResult = {
  mode: "member" | "public";
  identifier?: string;
};

type Step = "splash" | "path";
type AuthOverlay = "none" | "email" | "otp";

export function OnboardingFlow({
  themeName = "light",
  onComplete,
  initialStep = "splash",
}: {
  themeName?: ThemeName;
  onComplete: (result: OnboardingResult) => void;
  // Launch starts on the brand splash; an explicit sign-out passes "path" to
  // land straight on the login / path-selection screen (no splash replay).
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [authStep, setAuthStep] = useState<AuthOverlay>("none");
  const [discoverVisible, setDiscoverVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [splashAdvanced, setSplashAdvanced] = useState(false);

  const advanceFromSplash = useCallback(() => {
    if (splashAdvanced) return;
    setSplashAdvanced(true);
    const t = setTimeout(() => setStep("path"), 500);
    return () => clearTimeout(t);
  }, [splashAdvanced]);

  const handleEmailSubmit = useCallback((value: string) => {
    setEmail(value);
    setAuthStep("otp");
  }, []);

  const handleOtpSubmit = useCallback(
    (_code: string) => {
      setAuthStep("none");
      onComplete({ mode: "member", identifier: email });
    },
    [email, onComplete],
  );

  switch (step) {
    case "splash":
      return <SplashScreen themeName={themeName} onReady={advanceFromSplash} />;

    case "path":
      return (
        <>
          <PathSelectionScreen
            themeName={themeName}
            onSelect={(p: OnboardingPath) => {
              if (p === "member") setAuthStep("email");
              else setDiscoverVisible(true);
            }}
          />

          {/* Member path — slide-up Modal so the Welcome card visually
              "expands" into a full-screen email form.
              The Modal contents get a fresh SafeAreaProvider — react-native-
              safe-area-context's insets do not propagate reliably through
              the native Modal host view, so without this the top inset
              can grow on remount (email ↔ OTP switching). */}
          <Modal
            visible={authStep === "email" || authStep === "otp"}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setAuthStep("none")}
          >
            <SafeAreaProvider>
              {authStep === "otp" ? (
                <OtpEntryScreen
                  email={email}
                  onBack={() => setAuthStep("email")}
                  onSubmit={handleOtpSubmit}
                  onResend={() => {
                    // Real flow: re-requests the OTP through the auth backend.
                  }}
                />
              ) : (
                <EmailEntryScreen
                  initialEmail={email}
                  onBack={() => setAuthStep("none")}
                  onSubmit={handleEmailSubmit}
                />
              )}
            </SafeAreaProvider>
          </Modal>

          {/* Discover path — same slide-up Modal pattern so the two paths
              feel symmetric. Dismiss returns to Welcome. */}
          <Modal
            visible={discoverVisible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setDiscoverVisible(false)}
          >
            <SafeAreaProvider>
              <DiscoverPlaceholderScreen
                themeName={themeName}
                onSignInInstead={() => setDiscoverVisible(false)}
                onContinue={() => {
                  setDiscoverVisible(false);
                  onComplete({ mode: "public" });
                }}
              />
            </SafeAreaProvider>
          </Modal>
        </>
      );
  }
}

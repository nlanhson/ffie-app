// Onboarding flow — the state machine that walks the user from app launch
// to the main app (doc library).
//
// State graph (v0.8 — both paths are slide-up overlays on Welcome):
//   splash → path:
//     "Log in"         → LoginScreen → DONE (member)
//                          └─ "Join the FFIE" → BecomeMemberScreen (directory)
//     "Browse freely"  → DiscoverPlaceholderScreen → DONE (public)
//
// Both paths render inside slide-up Modals presented over the Welcome
// screen. Back from login → dismisses to Welcome; back from Discover →
// dismisses to Welcome. The password-based LoginScreen replaced the old
// passwordless email → OTP pair, so there is no longer an intermediate
// verification step: Connect (or SSO) authenticates directly (v1 mock).
//
// "Join the FFIE" on the login does NOT enter the app — membership is
// federated (you apply through your departmental federation), so it opens
// the federation directory (map + list) over the login, matching the guest
// shell. Closing it returns to the login.
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
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { BecomeMemberScreen } from "@/screens/BecomeMemberScreen";

export type OnboardingResult = {
  mode: "member" | "public";
  identifier?: string;
};

type Step = "splash" | "path";

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
  const [loginVisible, setLoginVisible] = useState(false);
  // "Not yet a member? Join the FFIE" opens the federation directory (map +
  // departmental list) over the login — the real join funnel, never a silent
  // entry into the app. Same screen the guest shell uses, for consistency.
  const [joinVisible, setJoinVisible] = useState(false);
  const [discoverVisible, setDiscoverVisible] = useState(false);
  const [identifier, setIdentifier] = useState<string>("");
  const [splashAdvanced, setSplashAdvanced] = useState(false);

  const advanceFromSplash = useCallback(() => {
    if (splashAdvanced) return;
    setSplashAdvanced(true);
    const t = setTimeout(() => setStep("path"), 500);
    return () => clearTimeout(t);
  }, [splashAdvanced]);

  // Connect / SSO → authenticate directly (v1 mock: any well-formed input).
  const handleLogin = useCallback(
    (value?: string) => {
      setLoginVisible(false);
      onComplete({ mode: "member", identifier: value ?? identifier });
    },
    [identifier, onComplete],
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
              if (p === "member") setLoginVisible(true);
              else setDiscoverVisible(true);
            }}
          />

          {/* Member path — slide-up Modal so the Welcome card visually
              "expands" into the full-screen login form.
              The Modal contents get a fresh SafeAreaProvider — react-native-
              safe-area-context's insets do not propagate reliably through
              the native Modal host view, so without this the top inset
              can grow on remount. */}
          <Modal
            visible={loginVisible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setLoginVisible(false)}
          >
            <SafeAreaProvider>
              <LoginScreen
                initialIdentifier={identifier}
                onBack={() => setLoginVisible(false)}
                onSubmit={(value) => {
                  setIdentifier(value);
                  handleLogin(value);
                }}
                onSso={() => handleLogin()}
                // "Not yet a member?" — open the federation directory, not the
                // app. Membership is federated: you apply through your
                // departmental federation (no self-signup).
                onJoin={() => setJoinVisible(true)}
              />

              {/* Federation directory — nested INSIDE the login modal's content
                  so it presents over the login on iOS (a sibling modal at the
                  root can't present while the login modal is up — same
                  constraint the guest shell works around). Closing it, or
                  "Already a member? Sign in", returns to the login underneath. */}
              <Modal
                visible={joinVisible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => setJoinVisible(false)}
              >
                <SafeAreaProvider>
                  <BecomeMemberScreen
                    themeName={themeName}
                    onClose={() => setJoinVisible(false)}
                    onLogin={() => setJoinVisible(false)}
                  />
                </SafeAreaProvider>
              </Modal>
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

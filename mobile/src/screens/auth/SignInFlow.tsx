// Sign-in flow — "I already have an account" → login → authenticated.
//
// Reuses the exact LoginScreen from the onboarding login path so the guest
// "I already have an account" CTA behaves like the Welcome-screen login:
// enter your identifier + password, Connect, and the shell promotes the
// session to member.
//
// ONE slide-up Modal hosting LoginScreen. (The earlier version swapped an
// email step and an OTP step inside this modal; the password-based
// LoginScreen replaced both, so there is no longer an internal step to
// switch — a single screen authenticates directly.)
//
// v1 mock: any well-formed identifier + password authenticates; SSO too.
// Production: verify credentials against the FFIE auth API before
// onAuthenticated.

import React from "react";
import { Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginScreen } from "./LoginScreen";

export function SignInFlow({
  visible,
  onClose,
  onAuthenticated,
  onJoin,
}: {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: (identifier: string) => void;
  // "Not yet a member? Join the FFIE" — routes to the membership funnel.
  onJoin?: () => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <LoginScreen
          onBack={onClose}
          onSubmit={(identifier) => onAuthenticated(identifier)}
          onSso={() => onAuthenticated("")}
          onJoin={onJoin}
        />
      </SafeAreaProvider>
    </Modal>
  );
}

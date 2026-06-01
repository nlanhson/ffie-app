// Sign-in flow — "I already have an account" → email → OTP → authenticated.
//
// Reuses the exact screens from the onboarding login path (EmailEntryScreen →
// OtpEntryScreen) so the guest "I already have an account" CTA behaves like
// the Welcome-screen login: enter your email, then the 6-digit code we send.
// Rendered as stacked slide-up modals (OTP slides over email) driven by
// `visible`. A complete code calls onAuthenticated, which the shell uses to
// promote the session to member.
//
// v1 mock: any 6-digit code authenticates (OtpEntryScreen submits on length).
// Production: verify the code against the FFIE auth API before onAuthenticated.

import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { EmailEntryScreen } from "./EmailEntryScreen";
import { OtpEntryScreen } from "./OtpEntryScreen";

export function SignInFlow({
  visible,
  onClose,
  onAuthenticated,
}: {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: (email: string) => void;
}) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  // Reset to the first step whenever the flow is dismissed, so reopening
  // always starts clean.
  useEffect(() => {
    if (!visible) {
      setStep("email");
      setEmail("");
    }
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <SafeAreaProvider>
          <EmailEntryScreen
            initialEmail={email}
            onBack={onClose}
            onSubmit={(value) => {
              setEmail(value);
              setStep("otp");
            }}
          />
        </SafeAreaProvider>
      </Modal>

      {/* OTP slides up over the email screen, matching the onboarding login. */}
      <Modal
        visible={visible && step === "otp"}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setStep("email")}
      >
        <SafeAreaProvider>
          <OtpEntryScreen
            email={email}
            onBack={() => setStep("email")}
            onSubmit={() => onAuthenticated(email)}
            onResend={() => {}}
          />
        </SafeAreaProvider>
      </Modal>
    </>
  );
}

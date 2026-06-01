// Membership application flow — the small state machine behind the Join CTA.
//
//   form → (submit) → submitted/pending
//
// Opened as a slide-up modal by the guest shell. It reads the membership
// context: if an application is already pending (the user reopened the flow),
// it seeds straight to the confirmation screen instead of the empty form.
// Submitting records the application in the context (which flips the global
// status to "pending") and swaps to the confirmation screen.

import React, { useState } from "react";
import { type ThemeName } from "@tokens";
import {
  useMembership,
  type ApplicationInput,
  type MembershipApplication,
} from "@/auth/membershipContext";
import { MembershipApplicationScreen } from "./MembershipApplicationScreen";
import { ApplicationSubmittedScreen } from "./ApplicationSubmittedScreen";

export function MembershipApplicationFlow({
  themeName = "light",
  onClose,
}: {
  themeName?: ThemeName;
  onClose: () => void;
}) {
  const { application, submitApplication } = useMembership();
  // Seed from the context so reopening a pending application lands on the
  // confirmation screen rather than a blank form.
  const [submitted, setSubmitted] = useState<MembershipApplication | null>(application);

  if (submitted) {
    return (
      <ApplicationSubmittedScreen
        themeName={themeName}
        application={submitted}
        onDone={onClose}
      />
    );
  }

  return (
    <MembershipApplicationScreen
      themeName={themeName}
      onBack={onClose}
      onSubmit={(input: ApplicationInput) => setSubmitted(submitApplication(input))}
    />
  );
}

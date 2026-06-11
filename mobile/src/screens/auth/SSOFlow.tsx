// SSO flow — federation picker → federation sign-in (verification) → done.
//
// Selecting a federation no longer authenticates on its own: it only chooses
// WHICH federation identity provider to verify against. The member is then
// handed off to that federation's secure sign-in (FederationSignInScreen — a
// redirect, no in-app credentials) before being let in — closing the "pick a
// random place and you're logged in" gap.
//
//   SSOFederationScreen (pick)  →  FederationSignInScreen (hand-off)  →  onAuthenticated
//
// Rendered in-place by LoginScreen when the "SSO federation connection" button
// is tapped. onCancel returns to the login; onAuthenticated promotes the
// session. v1 mock throughout (no backend) — see FederationSignInScreen.

import React, { useState } from "react";
import { SSOFederationScreen } from "./SSOFederationScreen";
import { FederationSignInScreen } from "./FederationSignInScreen";
import { type Federation } from "@/data/federations";

export function SSOFlow({
  onCancel,
  onAuthenticated,
}: {
  onCancel: () => void;
  onAuthenticated: () => void;
}) {
  // null = picking a federation; set = signing in to it (verification step).
  const [federation, setFederation] = useState<Federation | null>(null);

  if (federation) {
    return (
      <FederationSignInScreen
        federation={federation}
        onBack={() => setFederation(null)}
        onSignIn={onAuthenticated}
      />
    );
  }

  return (
    <SSOFederationScreen onBack={onCancel} onConnect={(fed) => setFederation(fed)} />
  );
}

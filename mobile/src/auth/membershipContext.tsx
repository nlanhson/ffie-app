// Membership application state — v1 mock.
//
// A non-member (Karim) can submit a membership application from the
// Join-FFIE surface. Per the FFIE access model this is LEAD CAPTURE, not a
// purchase: no payment is taken in-app, and real membership is granted
// out-of-band by FFIE staff after review. So a submitted application sits in
// a "pending" state — the app's only job is to capture it, confirm receipt,
// and reflect the pending status if the user comes back.
//
// In v1 there is no backend. The submitted application lives in memory for
// the session. In production: POST to the FFIE membership API, persist the
// returned reference in SecureStore, and refresh status on launch.

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ApplicationStatus = "none" | "pending";

export type CompanySize = "1-5" | "6-20" | "21-50" | "50+";

// What the form collects.
export type ApplicationInput = {
  companyName: string;
  siret: string;
  contactName: string;
  email: string;
  phone?: string;
  companySize?: CompanySize;
};

// The stored application — input plus the server-assigned bits (mocked here).
export type MembershipApplication = ApplicationInput & {
  reference: string;
  submittedAt: string; // display date, Europe/Paris style: "29 May 2026"
};

type MembershipContextValue = {
  status: ApplicationStatus;
  application: MembershipApplication | null;
  /** Records the application and returns it (with reference + date stamped). */
  submitApplication: (input: ApplicationInput) => MembershipApplication;
  /** Dev/testing escape hatch — clears the pending application. */
  withdrawApplication: () => void;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatToday(): string {
  const d = new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Mock reference. The real one comes back from the FFIE membership API.
function makeReference(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `FFIE-${year}-${n}`;
}

const MembershipContext = createContext<MembershipContextValue>({
  status: "none",
  application: null,
  submitApplication: () => {
    throw new Error("submitApplication called outside a MembershipProvider");
  },
  withdrawApplication: () => {},
});

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [application, setApplication] = useState<MembershipApplication | null>(null);

  const submitApplication = useCallback((input: ApplicationInput) => {
    const app: MembershipApplication = {
      ...input,
      reference: makeReference(),
      submittedAt: formatToday(),
    };
    setApplication(app);
    return app;
  }, []);

  const withdrawApplication = useCallback(() => setApplication(null), []);

  const value = useMemo<MembershipContextValue>(
    () => ({
      status: application ? "pending" : "none",
      application,
      submitApplication,
      withdrawApplication,
    }),
    [application, submitApplication, withdrawApplication],
  );

  return <MembershipContext.Provider value={value}>{children}</MembershipContext.Provider>;
}

export function useMembership(): MembershipContextValue {
  return useContext(MembershipContext);
}

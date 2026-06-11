// Role / access model — v1 mock.
//
// The 4-role taxonomy mirrors the FFIE access matrix:
//   - "guest-public"  → General public (Léa)           — unauthenticated
//   - "guest-company" → Non-member company (Karim)     — unauthenticated
//   - "member"        → Member (Julien)                — authenticated, full access
//   - "admin"         → FFIE Admin                     — back-office WEB ONLY
//
// "admin" is intentionally included so the type is total against the brief,
// but it should never appear on a mobile session. RequireRole treats it as
// a hard fail with an AdminWebOnly fallback for safety.
//
// In v1 there is no real auth. Role state lives in memory and is seeded by
// OnboardingFlow's onComplete (mode → role). A debug toggle in dev preview
// builds lets the client cycle through roles to preview every persona.

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Role = "guest-public" | "guest-company" | "member" | "admin";

export type Access = "public" | "member-only" | "admin-only";

// Pure decision function — no React deps. Tested in isolation; reused by
// any nav or feature-gating code (route table, conditional menu items, etc).
export function canAccess(role: Role, access: Access): boolean {
  if (access === "public") return true;
  if (access === "member-only") return role === "member" || role === "admin";
  if (access === "admin-only") return role === "admin";
  return false;
}

// Default role on cold start — the safest assumption for an unauthenticated
// mobile session. The OnboardingFlow updates this once the user picks a path.
const DEFAULT_ROLE: Role = "guest-public";

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextValue>({
  role: DEFAULT_ROLE,
  setRole: () => {
    // No-op default — calling setRole outside a RoleProvider is a bug,
    // but we don't throw to keep the type ergonomic for tests.
  },
});

export function RoleProvider({
  children,
  initialRole = DEFAULT_ROLE,
}: {
  children: React.ReactNode;
  initialRole?: Role;
}) {
  const [role, setRoleState] = useState<Role>(initialRole);
  const setRole = useCallback((next: Role) => setRoleState(next), []);
  const value = useMemo(() => ({ role, setRole }), [role, setRole]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  return useContext(RoleContext);
}

// Convenience: map the OnboardingFlow's mode result to the richer Role type.
// "public" collapses to guest-public in v1 — we don't yet distinguish Karim
// vs Léa from a single path-selection tap. Future: add a second prompt or
// infer from analytics signals.
export function roleFromOnboardingMode(mode: "member" | "public"): Role {
  return mode === "member" ? "member" : "guest-public";
}

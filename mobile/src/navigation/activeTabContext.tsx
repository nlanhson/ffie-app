// ActiveTab context — publishes which top-level tab is currently on screen.
//
// The floating RoleDebugSwitcher renders at the app root, a sibling of the
// shells, so it can't see a shell's local tab state. GuestShell (and any
// future shell) writes its active tab here; debug/overlay UI reads it to
// scope itself to a specific surface — e.g. the membership "Reset" chip only
// shows on the Join-FFIE tab. Null when no tabbed surface is mounted.

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ActiveTabContextValue = {
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
};

const ActiveTabContext = createContext<ActiveTabContextValue>({
  activeTab: null,
  setActiveTab: () => {},
});

export function ActiveTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<string | null>(null);
  const setActiveTab = useCallback((tab: string | null) => setActiveTabState(tab), []);
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab, setActiveTab]);
  return <ActiveTabContext.Provider value={value}>{children}</ActiveTabContext.Provider>;
}

export function useActiveTab(): ActiveTabContextValue {
  return useContext(ActiveTabContext);
}

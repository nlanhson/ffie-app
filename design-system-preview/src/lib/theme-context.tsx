"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { themes, type ThemeName } from "@tokens";

type ThemeContextValue = {
  themeName: ThemeName;
  setThemeName: (n: ThemeName) => void;
  theme: (typeof themes)[ThemeName];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "ffie-ds-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && stored in themes) setThemeNameState(stored);
  }, []);

  // Propagate to <html data-theme> so the shadcn CSS-variable bridge in
  // globals.css activates on every descendant, including portals (toasts,
  // dialogs) that render outside the React tree root.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeName);
  }, [themeName]);

  const setThemeName = (n: ThemeName) => {
    setThemeNameState(n);
    window.localStorage.setItem(STORAGE_KEY, n);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({ themeName, setThemeName, theme: themes[themeName] }),
    [themeName]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}

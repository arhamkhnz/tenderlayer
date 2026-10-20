import { createContext, useContext } from "react";
import type { AppPreferences, ThemePreference } from "../../../shared/contracts/preferences";

export function applyTheme(theme: ThemePreference) {
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.add("disable-transitions");
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => document.documentElement.classList.remove("disable-transitions"));
  });
  return isDark;
}

export async function loadPreferences() {
  const preferences = await window.electronAPI.preferences.get();
  applyTheme(preferences.theme);
  return preferences;
}

interface PreferencesContextValue extends AppPreferences {
  isDark: boolean;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setSidebarOpen: (open: boolean) => Promise<void>;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used within PreferencesProvider");
  return context;
}

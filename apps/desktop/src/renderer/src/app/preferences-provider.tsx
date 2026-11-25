import { useCallback, useEffect, useState, type ReactNode } from "react";

import type { AppPreferences, ThemePreference } from "../../../shared/contracts/preferences";
import { applyTheme, PreferencesContext } from "./preferences";

export function PreferencesProvider({
  initialPreferences,
  children,
}: {
  initialPreferences: AppPreferences;
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(applyTheme(preferences.theme));
    if (preferences.theme !== "system") return;
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preferences.theme]);

  async function setTheme(theme: ThemePreference) {
    try {
      await window.electronAPI.preferences.setTheme(theme);
      setIsDark(applyTheme(theme));
      setPreferences((current) => ({ ...current, theme }));
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  }

  async function setSidebarOpen(sidebarOpen: boolean) {
    try {
      await window.electronAPI.preferences.setSidebarOpen(sidebarOpen);
      setPreferences((current) => ({ ...current, sidebarOpen }));
    } catch (error) {
      console.error("Failed to save sidebar preference", error);
    }
  }

  const setLastOpenedOrganizationId = useCallback(async (lastOpenedOrganizationId: string) => {
    setPreferences((current) => ({ ...current, lastOpenedOrganizationId }));
    try {
      await window.electronAPI.preferences.setLastOpenedOrganizationId(lastOpenedOrganizationId);
    } catch (error) {
      console.error("Failed to save the last opened organization", error);
    }
  }, []);

  return (
    <PreferencesContext.Provider
      value={{ ...preferences, isDark, setTheme, setSidebarOpen, setLastOpenedOrganizationId }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

import Store from "electron-store";
import { nativeTheme } from "electron/main";

import type { AppPreferences, ThemePreference } from "@shared/contracts/preferences";

let preferencesStore: Store<AppPreferences> | undefined;

function getPreferencesStore() {
  preferencesStore ??= new Store<AppPreferences>({
    name: "preferences",
    defaults: { theme: "system", sidebarOpen: true, lastOpenedOrganizationId: null },
    schema: {
      theme: { type: "string", enum: ["light", "dark", "system"] },
      sidebarOpen: { type: "boolean" },
      lastOpenedOrganizationId: { type: ["string", "null"] },
    },
  });
  return preferencesStore;
}

export function getPreferences(): AppPreferences {
  const store = getPreferencesStore();
  return {
    theme: store.get("theme"),
    sidebarOpen: store.get("sidebarOpen"),
    lastOpenedOrganizationId: store.get("lastOpenedOrganizationId"),
  };
}

export function setTheme(theme: ThemePreference) {
  getPreferencesStore().set("theme", theme);
  nativeTheme.themeSource = theme;
}

export function setSidebarOpen(open: boolean) {
  getPreferencesStore().set("sidebarOpen", open);
}

export function setLastOpenedOrganizationId(organizationId: string) {
  getPreferencesStore().set("lastOpenedOrganizationId", organizationId);
}

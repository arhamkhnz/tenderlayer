export type ThemePreference = "light" | "dark" | "system";

export interface AppPreferences {
  theme: ThemePreference;
  sidebarOpen: boolean;
  lastOpenedOrganizationId: string | null;
}

export const preferenceIpcChannels = {
  get: "preferences:get",
  setTheme: "preferences:set-theme",
  setSidebarOpen: "preferences:set-sidebar-open",
  setLastOpenedOrganizationId: "preferences:set-last-opened-organization-id",
} as const;

export interface PreferencesApi {
  get: () => Promise<AppPreferences>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setSidebarOpen: (open: boolean) => Promise<void>;
  setLastOpenedOrganizationId: (organizationId: string) => Promise<void>;
}

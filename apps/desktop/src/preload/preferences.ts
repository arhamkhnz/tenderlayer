import { ipcRenderer } from "electron/renderer";

import { preferenceIpcChannels, type PreferencesApi } from "../shared/contracts/preferences.js";

export const preferencesApi = {
  get: () => ipcRenderer.invoke(preferenceIpcChannels.get) as ReturnType<PreferencesApi["get"]>,
  setTheme: (theme) => ipcRenderer.invoke(preferenceIpcChannels.setTheme, theme) as Promise<void>,
  setSidebarOpen: (open) => ipcRenderer.invoke(preferenceIpcChannels.setSidebarOpen, open) as Promise<void>,
  setLastOpenedOrganizationId: (organizationId) =>
    ipcRenderer.invoke(preferenceIpcChannels.setLastOpenedOrganizationId, organizationId) as Promise<void>,
} satisfies PreferencesApi;

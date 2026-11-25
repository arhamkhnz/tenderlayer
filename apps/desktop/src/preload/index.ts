import { contextBridge } from "electron/renderer";

import type { ElectronApi, ElectronPlatform } from "@shared/electron-api";

import { departmentsApi } from "./departments.js";
import { organizationsApi } from "./organizations.js";
import { preferencesApi } from "./preferences.js";
import { windowStateApi } from "./window-state.js";

const electronApi = {
  platform: process.platform as ElectronPlatform,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  },
  departments: departmentsApi,
  organizations: organizationsApi,
  preferences: preferencesApi,
  windowState: windowStateApi,
} satisfies ElectronApi;

contextBridge.exposeInMainWorld("electronAPI", electronApi);

import { contextBridge } from "electron/renderer";
import type { ElectronApi } from "../shared/electron-api.js";
import { organizationsApi } from "./organizations.js";

const electronApi = {
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  },
  organizations: organizationsApi,
} satisfies ElectronApi;

contextBridge.exposeInMainWorld("electronAPI", electronApi);

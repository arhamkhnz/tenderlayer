import { contextBridge } from "electron/renderer";
import type { ElectronApi, ElectronPlatform } from "../shared/electron-api.js";
import { organizationsApi } from "./organizations.js";

const electronApi = {
  platform: process.platform as ElectronPlatform,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  },
  organizations: organizationsApi,
} satisfies ElectronApi;

contextBridge.exposeInMainWorld("electronAPI", electronApi);

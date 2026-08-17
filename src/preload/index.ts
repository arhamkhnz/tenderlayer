import { contextBridge, ipcRenderer } from "electron/renderer";
import { windowIpcChannels, type ElectronApi, type ElectronPlatform } from "../shared/electron-api.js";
import { organizationsApi } from "./organizations.js";

const electronApi = {
  platform: process.platform as ElectronPlatform,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  },
  onFullScreenChange: (listener: (isFullScreen: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, isFullScreen: boolean) => {
      listener(isFullScreen);
    };

    ipcRenderer.on(windowIpcChannels.fullScreenChanged, handler);

    return () => {
      ipcRenderer.removeListener(windowIpcChannels.fullScreenChanged, handler);
    };
  },
  organizations: organizationsApi,
} satisfies ElectronApi;

contextBridge.exposeInMainWorld("electronAPI", electronApi);

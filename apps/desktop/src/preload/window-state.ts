import { ipcRenderer, type IpcRendererEvent } from "electron/renderer";
import { windowStateIpcChannels, type WindowStateApi } from "../shared/contracts/window-state.js";

export const windowStateApi = {
  getFullscreen: () => ipcRenderer.invoke(windowStateIpcChannels.getFullscreen) as Promise<boolean>,
  onFullscreenChange: (listener) => {
    const onChange = (_event: IpcRendererEvent, isFullscreen: boolean) => listener(isFullscreen);
    ipcRenderer.on(windowStateIpcChannels.fullscreenChanged, onChange);
    return () => {
      ipcRenderer.removeListener(windowStateIpcChannels.fullscreenChanged, onChange);
    };
  },
} satisfies WindowStateApi;

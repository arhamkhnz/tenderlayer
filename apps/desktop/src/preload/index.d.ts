import type { ElectronApi } from "../shared/electron-api.js";

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}

export {};

import type { ElectronApi } from "../shared/ipc.js";

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}

export {};

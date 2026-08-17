import type { OrganizationsApi } from "./contracts/organizations.js";

export type ElectronPlatform = "darwin" | "linux" | "win32";

export const windowIpcChannels = {
  fullScreenChanged: "window:fullscreen-changed",
} as const;

export interface ElectronApi {
  platform: ElectronPlatform;
  versions: Readonly<{
    chrome: string;
    electron: string;
    node: string;
  }>;
  onFullScreenChange: (listener: (isFullScreen: boolean) => void) => () => void;
  organizations: Readonly<OrganizationsApi>;
}

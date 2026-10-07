import type { OrganizationsApi } from "./contracts/organizations.js";

export type ElectronPlatform = "darwin" | "linux" | "win32";

export interface ElectronApi {
  platform: ElectronPlatform;
  versions: Readonly<{
    chrome: string;
    electron: string;
    node: string;
  }>;
  organizations: Readonly<OrganizationsApi>;
}

import type { OrganizationsApi } from "./contracts/organizations.js";
import type { PreferencesApi } from "./contracts/preferences.js";

export type ElectronPlatform = "darwin" | "linux" | "win32";

export interface ElectronApi {
  platform: ElectronPlatform;
  versions: Readonly<{
    chrome: string;
    electron: string;
    node: string;
  }>;
  organizations: Readonly<OrganizationsApi>;
  preferences: Readonly<PreferencesApi>;
}

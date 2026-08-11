import type { OrganizationsApi } from "./contracts/organizations.js";

export interface ElectronApi {
  versions: Readonly<{
    chrome: string;
    electron: string;
    node: string;
  }>;
  organizations: Readonly<OrganizationsApi>;
}

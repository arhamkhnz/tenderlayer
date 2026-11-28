import type { ContractsApi } from "./contracts/contracts.js";
import type { DepartmentsApi } from "./contracts/departments.js";
import type { EmployeesApi } from "./contracts/employees.js";
import type { OrganizationsApi } from "./contracts/organizations.js";
import type { PreferencesApi } from "./contracts/preferences.js";
import type { WindowStateApi } from "./contracts/window-state.js";

export type ElectronPlatform = "darwin" | "linux" | "win32";

export interface ElectronApi {
  platform: ElectronPlatform;
  versions: Readonly<{
    chrome: string;
    electron: string;
    node: string;
  }>;
  contracts: Readonly<ContractsApi>;
  departments: Readonly<DepartmentsApi>;
  employees: Readonly<EmployeesApi>;
  organizations: Readonly<OrganizationsApi>;
  preferences: Readonly<PreferencesApi>;
  windowState: Readonly<WindowStateApi>;
}

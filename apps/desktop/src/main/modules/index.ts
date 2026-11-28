import { registerContractIpcHandlers } from "./contracts/contracts.ipc.js";
import { registerDepartmentIpcHandlers } from "./departments/departments.ipc.js";
import { registerEmployeeIpcHandlers } from "./employees/employees.ipc.js";
import { registerOrganizationIpcHandlers } from "./organizations/organizations.ipc.js";
import { registerPreferenceIpcHandlers } from "./preferences/preferences.ipc.js";
import { registerWindowStateIpcHandlers } from "./window-state/window-state.ipc.js";

export function registerIpcHandlers() {
  registerContractIpcHandlers();
  registerDepartmentIpcHandlers();
  registerEmployeeIpcHandlers();
  registerOrganizationIpcHandlers();
  registerPreferenceIpcHandlers();
  registerWindowStateIpcHandlers();
}

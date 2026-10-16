import { registerOrganizationIpcHandlers } from "./organizations/organizations.ipc.js";
import { registerPreferenceIpcHandlers } from "./preferences/preferences.ipc.js";

export function registerIpcHandlers() {
  registerOrganizationIpcHandlers();
  registerPreferenceIpcHandlers();
}

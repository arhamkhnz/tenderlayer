import { registerOrganizationIpcHandlers } from "./organizations/organizations.ipc.js";
import { registerPreferenceIpcHandlers } from "./preferences/preferences.ipc.js";
import { registerWindowStateIpcHandlers } from "./window-state/window-state.ipc.js";

export function registerIpcHandlers() {
  registerOrganizationIpcHandlers();
  registerPreferenceIpcHandlers();
  registerWindowStateIpcHandlers();
}

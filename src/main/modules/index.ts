import { registerOrganizationIpcHandlers } from "./organizations/organizations.ipc.js";

export function registerIpcHandlers() {
  registerOrganizationIpcHandlers();
}

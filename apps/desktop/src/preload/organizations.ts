import { ipcRenderer } from "electron/renderer";
import { organizationIpcChannels, type OrganizationsApi } from "../shared/contracts/organizations.js";

export const organizationsApi = {
  create: (input) =>
    ipcRenderer.invoke(organizationIpcChannels.create, input) as ReturnType<OrganizationsApi["create"]>,
  list: () => ipcRenderer.invoke(organizationIpcChannels.list) as ReturnType<OrganizationsApi["list"]>,
} satisfies OrganizationsApi;

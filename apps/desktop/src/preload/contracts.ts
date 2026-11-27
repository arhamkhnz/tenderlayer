import { ipcRenderer } from "electron/renderer";

import { contractIpcChannels, type ContractsApi } from "@shared/contracts/contracts";

export const contractsApi = {
  create: (input) => ipcRenderer.invoke(contractIpcChannels.create, input) as ReturnType<ContractsApi["create"]>,
  delete: (input) => ipcRenderer.invoke(contractIpcChannels.delete, input) as ReturnType<ContractsApi["delete"]>,
  get: (input) => ipcRenderer.invoke(contractIpcChannels.get, input) as ReturnType<ContractsApi["get"]>,
  list: (organizationId) =>
    ipcRenderer.invoke(contractIpcChannels.list, organizationId) as ReturnType<ContractsApi["list"]>,
  update: (input) => ipcRenderer.invoke(contractIpcChannels.update, input) as ReturnType<ContractsApi["update"]>,
} satisfies ContractsApi;

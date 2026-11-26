import { ipcRenderer } from "electron/renderer";

import { departmentIpcChannels, type DepartmentsApi } from "@shared/contracts/departments";

export const departmentsApi = {
  create: (input) => ipcRenderer.invoke(departmentIpcChannels.create, input) as ReturnType<DepartmentsApi["create"]>,
  delete: (input) => ipcRenderer.invoke(departmentIpcChannels.delete, input) as ReturnType<DepartmentsApi["delete"]>,
  list: (organizationId) =>
    ipcRenderer.invoke(departmentIpcChannels.list, organizationId) as ReturnType<DepartmentsApi["list"]>,
  update: (input) => ipcRenderer.invoke(departmentIpcChannels.update, input) as ReturnType<DepartmentsApi["update"]>,
} satisfies DepartmentsApi;

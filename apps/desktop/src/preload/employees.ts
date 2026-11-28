import { ipcRenderer } from "electron/renderer";

import { employeeIpcChannels, type EmployeesApi } from "@shared/contracts/employees";

export const employeesApi = {
  create: (input) => ipcRenderer.invoke(employeeIpcChannels.create, input) as ReturnType<EmployeesApi["create"]>,
  delete: (input) => ipcRenderer.invoke(employeeIpcChannels.delete, input) as ReturnType<EmployeesApi["delete"]>,
  get: (input) => ipcRenderer.invoke(employeeIpcChannels.get, input) as ReturnType<EmployeesApi["get"]>,
  list: (organizationId) =>
    ipcRenderer.invoke(employeeIpcChannels.list, organizationId) as ReturnType<EmployeesApi["list"]>,
  update: (input) => ipcRenderer.invoke(employeeIpcChannels.update, input) as ReturnType<EmployeesApi["update"]>,
} satisfies EmployeesApi;

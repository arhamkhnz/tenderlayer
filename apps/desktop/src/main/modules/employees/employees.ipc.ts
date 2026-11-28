import { ipcMain } from "electron/main";
import type { z } from "zod";

import { assertTrustedSender } from "@core/ipc-security";
import { employeeIpcChannels, type EmployeeSaveResult } from "@shared/contracts/employees";
import {
  createEmployeeSchema,
  employeeFormSchema,
  employeeIdentitySchema,
  employeeOrganizationIdSchema,
  updateEmployeeSchema,
  type EmployeeFormValues,
} from "@shared/schemas/employees";

import { createEmployee } from "./create-employee.js";
import { deleteEmployee } from "./delete-employee.js";
import { getEmployee } from "./get-employee.js";
import { listEmployees } from "./list-employees.js";
import { updateEmployee } from "./update-employee.js";

function handleEmployeeSave<Input>(
  schema: z.ZodType<Input>,
  input: unknown,
  save: (values: Input) => EmployeeSaveResult,
): EmployeeSaveResult {
  const result = schema.safeParse(input);
  if (!result.success) {
    const failure: Extract<EmployeeSaveResult, { ok: false }> = { ok: false, fieldErrors: [] };
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && field !== "currency" && Object.hasOwn(employeeFormSchema.shape, field)) {
        failure.fieldErrors.push({ field: field as keyof EmployeeFormValues, message: issue.message });
      } else {
        failure.formError ??= issue.message;
      }
    }
    return failure;
  }

  try {
    return save(result.data);
  } catch {
    console.error("[employees] failed to save an employee");
    return { ok: false, fieldErrors: [], formError: "Couldn’t save the employee. Please try again." };
  }
}

export function registerEmployeeIpcHandlers() {
  ipcMain.handle(employeeIpcChannels.list, (event, input: unknown) => {
    assertTrustedSender(event);
    const organizationId = employeeOrganizationIdSchema.parse(input);

    try {
      return listEmployees(organizationId);
    } catch (error) {
      console.error("[employees] failed to list employees", error);
      throw new Error("Could not load employees");
    }
  });

  ipcMain.handle(employeeIpcChannels.get, (event, input: unknown) => {
    assertTrustedSender(event);
    const identity = employeeIdentitySchema.parse(input);

    try {
      return getEmployee(identity);
    } catch {
      console.error("[employees] failed to load an employee");
      throw new Error("Could not load the employee");
    }
  });

  ipcMain.handle(employeeIpcChannels.create, (event, input: unknown) => {
    assertTrustedSender(event);
    return handleEmployeeSave(createEmployeeSchema, input, createEmployee);
  });

  ipcMain.handle(employeeIpcChannels.update, (event, input: unknown) => {
    assertTrustedSender(event);
    return handleEmployeeSave(updateEmployeeSchema, input, updateEmployee);
  });

  ipcMain.handle(employeeIpcChannels.delete, (event, input: unknown) => {
    assertTrustedSender(event);
    const identity = employeeIdentitySchema.parse(input);

    try {
      return deleteEmployee(identity);
    } catch {
      console.error("[employees] failed to delete an employee");
      throw new Error("Could not delete the employee");
    }
  });
}

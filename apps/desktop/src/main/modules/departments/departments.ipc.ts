import { ipcMain } from "electron/main";
import type { z } from "zod";

import { assertTrustedSender } from "@core/ipc-security";
import { departmentIpcChannels, type DepartmentSaveResult } from "@shared/contracts/departments";
import {
  createDepartmentSchema,
  deleteDepartmentSchema,
  departmentOrganizationIdSchema,
  updateDepartmentSchema,
} from "@shared/schemas/departments";

import { createDepartment } from "./create-department.js";
import { deleteDepartment } from "./delete-department.js";
import { listDepartments } from "./list-departments.js";
import { updateDepartment } from "./update-department.js";

function handleDepartmentSave<Input>(
  schema: z.ZodType<Input>,
  input: unknown,
  save: (values: Input) => DepartmentSaveResult,
): DepartmentSaveResult {
  const result = schema.safeParse(input);
  if (!result.success) {
    const failure: Extract<DepartmentSaveResult, { ok: false }> = { ok: false, fieldErrors: [] };
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "code") failure.fieldErrors.push({ field, message: issue.message });
      else failure.formError ??= issue.message;
    }
    return failure;
  }

  try {
    return save(result.data);
  } catch (error) {
    console.error("[departments] failed to save a department", error);
    return { ok: false, fieldErrors: [], formError: "Couldn’t save the department. Please try again." };
  }
}

export function registerDepartmentIpcHandlers() {
  ipcMain.handle(departmentIpcChannels.list, (event, input: unknown) => {
    assertTrustedSender(event);
    const organizationId = departmentOrganizationIdSchema.parse(input);

    try {
      return listDepartments(organizationId);
    } catch (error) {
      console.error("[departments] failed to list departments", error);
      throw new Error("Could not load departments");
    }
  });

  ipcMain.handle(departmentIpcChannels.create, (event, input: unknown): DepartmentSaveResult => {
    assertTrustedSender(event);
    return handleDepartmentSave(createDepartmentSchema, input, createDepartment);
  });

  ipcMain.handle(departmentIpcChannels.update, (event, input: unknown): DepartmentSaveResult => {
    assertTrustedSender(event);
    return handleDepartmentSave(updateDepartmentSchema, input, updateDepartment);
  });

  ipcMain.handle(departmentIpcChannels.delete, (event, input: unknown) => {
    assertTrustedSender(event);

    try {
      return deleteDepartment(deleteDepartmentSchema.parse(input));
    } catch (error) {
      console.error("[departments] failed to delete a department", error);
      throw new Error("Could not delete the department");
    }
  });
}

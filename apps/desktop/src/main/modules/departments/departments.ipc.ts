import { ipcMain } from "electron/main";

import { assertTrustedSender } from "@core/ipc-security";
import type { Department } from "@db/schema/departments";
import { departmentIpcChannels, type DepartmentRecord } from "@shared/contracts/departments";
import { createDepartmentSchema, departmentOrganizationIdSchema } from "@shared/schemas/departments";

import { createDepartment } from "./create-department.js";
import { listDepartments } from "./list-departments.js";

function toDepartmentRecord({ id, organizationId, name, code }: Department): DepartmentRecord {
  return { id, organizationId, name, code };
}

export function registerDepartmentIpcHandlers() {
  ipcMain.handle(departmentIpcChannels.list, (event, input: unknown) => {
    assertTrustedSender(event);
    const organizationId = departmentOrganizationIdSchema.parse(input);

    try {
      return listDepartments(organizationId).map(toDepartmentRecord);
    } catch (error) {
      console.error("[departments] failed to list departments", error);
      throw new Error("Could not load departments");
    }
  });

  ipcMain.handle(departmentIpcChannels.create, (event, input: unknown) => {
    assertTrustedSender(event);
    const result = createDepartmentSchema.safeParse(input);
    if (!result.success) throw new TypeError(result.error.issues[0]?.message ?? "Invalid department input");

    let department: ReturnType<typeof createDepartment>;
    try {
      department = createDepartment(result.data);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("A department with this name or code already exists in this organization.");
      }
      console.error("[departments] failed to create a department", error);
      throw new Error("Could not create department");
    }

    if (!department) throw new Error("Organization not found");
    return toDepartmentRecord(department);
  });
}

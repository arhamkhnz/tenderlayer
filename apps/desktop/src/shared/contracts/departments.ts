import type { CreateDepartmentInput, UpdateDepartmentInput } from "../schemas/departments.js";

export const departmentIpcChannels = {
  create: "departments:create",
  list: "departments:list",
  update: "departments:update",
} as const;

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string | null;
}

export interface DepartmentFieldError {
  field: "name" | "code";
  message: string;
}

export type DepartmentSaveResult =
  | { ok: true }
  | { ok: false; fieldErrors: DepartmentFieldError[]; formError?: string };

export interface DepartmentsApi {
  create: (input: CreateDepartmentInput) => Promise<DepartmentSaveResult>;
  list: (organizationId: string) => Promise<DepartmentRecord[]>;
  update: (input: UpdateDepartmentInput) => Promise<DepartmentSaveResult>;
}

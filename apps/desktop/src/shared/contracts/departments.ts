import type { CreateDepartmentInput } from "../schemas/departments.js";

export const departmentIpcChannels = {
  create: "departments:create",
  list: "departments:list",
} as const;

export interface DepartmentRecord {
  id: string;
  organizationId: string;
  name: string;
  code: string | null;
}

export interface DepartmentsApi {
  create: (input: CreateDepartmentInput) => Promise<DepartmentRecord>;
  list: (organizationId: string) => Promise<DepartmentRecord[]>;
}

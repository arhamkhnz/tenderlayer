import type {
  CreateEmployeeInput,
  EmployeeFormValues,
  EmployeeIdentity,
  UpdateEmployeeInput,
} from "../schemas/employees.js";

export const employeeIpcChannels = {
  create: "employees:create",
  delete: "employees:delete",
  get: "employees:get",
  list: "employees:list",
  update: "employees:update",
} as const;

export interface EmployeeRecord {
  id: string;
  code: string;
  name: string;
  jobTitle: string;
  contractId: string | null;
  contractTitle: string | null;
  location: string | null;
  status: EmployeeFormValues["status"];
  monthlyPay: number;
  currency: string;
}

export interface EmployeeEditorRecord {
  id: string;
  code: string;
  revision: number;
  values: EmployeeFormValues;
}

export type EmployeeSaveResult =
  | { ok: true }
  | { ok: false; fieldErrors: { field: keyof EmployeeFormValues; message: string }[]; formError?: string };

export interface EmployeesApi {
  create: (input: CreateEmployeeInput) => Promise<EmployeeSaveResult>;
  delete: (input: EmployeeIdentity) => Promise<boolean>;
  get: (input: EmployeeIdentity) => Promise<EmployeeEditorRecord | null>;
  list: (organizationId: string) => Promise<EmployeeRecord[]>;
  update: (input: UpdateEmployeeInput) => Promise<EmployeeSaveResult>;
}

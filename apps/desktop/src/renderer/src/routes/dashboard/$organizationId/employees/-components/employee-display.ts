import type { EmployeeFormValues } from "@shared/schemas/employees";

export const employmentTypeLabels: Record<EmployeeFormValues["employmentType"], string> = {
  "full-time": "Full-time",
  contractual: "Contractual",
  temporary: "Temporary",
  "part-time": "Part-time",
};

export const employeeStatusDisplay: Record<EmployeeFormValues["status"], { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  "on-leave": { label: "On leave", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
};

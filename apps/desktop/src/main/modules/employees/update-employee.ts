import { sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { employees } from "@db/schema/employees";
import type { EmployeeSaveResult } from "@shared/contracts/employees";
import type { UpdateEmployeeInput } from "@shared/schemas/employees";

import { employeeFormColumns, employeeScope, employeeValues, getEmployeeContractError } from "./employee-queries.js";

export function updateEmployee(input: UpdateEmployeeInput): EmployeeSaveResult {
  return getDatabase().transaction<EmployeeSaveResult>(
    (transaction) => {
      if (!isOrganizationActive(transaction, input.organizationId)) {
        return { ok: false, fieldErrors: [], formError: "This organization is no longer available." };
      }

      const scope = employeeScope(input);
      const existing = transaction
        .select({ ...employeeFormColumns, revision: employees.revision })
        .from(employees)
        .where(scope)
        .get();
      if (!existing) {
        return { ok: false, fieldErrors: [], formError: "This employee is no longer available." };
      }
      if (existing.revision !== input.revision) {
        return {
          ok: false,
          fieldErrors: [],
          formError: "This employee has changed. Reopen the editor to load the latest record.",
        };
      }

      const contractError = getEmployeeContractError(transaction, input, existing.contractId);
      if (contractError) {
        return { ok: false, fieldErrors: [{ field: "contractId", message: contractError }] };
      }
      const values = employeeValues(input);
      if (Object.entries(values).every(([field, value]) => existing[field as keyof typeof values] === value)) {
        return { ok: true };
      }

      transaction
        .update(employees)
        .set({ ...values, updatedAt: sql`(unixepoch() * 1000)`, revision: existing.revision + 1 })
        .where(scope)
        .run();
      return { ok: true };
    },
    { behavior: "immediate" },
  );
}

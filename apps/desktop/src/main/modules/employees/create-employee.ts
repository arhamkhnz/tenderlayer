import { eq, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { employees } from "@db/schema/employees";
import type { EmployeeSaveResult } from "@shared/contracts/employees";
import type { CreateEmployeeInput } from "@shared/schemas/employees";

import { employeeValues, isContractAvailable } from "./employee-queries.js";

export function createEmployee(input: CreateEmployeeInput): EmployeeSaveResult {
  const { organizationId, contractId } = input;

  return getDatabase().transaction<EmployeeSaveResult>(
    (transaction) => {
      if (!isOrganizationActive(transaction, organizationId)) {
        return { ok: false, fieldErrors: [], formError: "This organization is no longer available." };
      }
      if (contractId && !isContractAvailable(transaction, organizationId, contractId)) {
        return { ok: false, fieldErrors: [{ field: "contractId", message: "Select an available contract." }] };
      }

      const last = transaction
        .select({ sequence: sql<number>`coalesce(max(cast(substr(${employees.code}, 5) as integer)), 0)` })
        .from(employees)
        .where(eq(employees.organizationId, organizationId))
        .get();
      const sequence = (last?.sequence ?? 0) + 1;
      if (!Number.isSafeInteger(sequence)) throw new Error("Employee code sequence is exhausted");

      const code = `EMP-${String(sequence).padStart(3, "0")}`;
      transaction
        .insert(employees)
        .values({ ...employeeValues(input), organizationId, code })
        .run();
      return { ok: true };
    },
    { behavior: "immediate" },
  );
}

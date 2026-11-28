import { sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { employees } from "@db/schema/employees";
import type { EmployeeIdentity } from "@shared/schemas/employees";

import { employeeScope } from "./employee-queries.js";

export function deleteEmployee(input: EmployeeIdentity) {
  return getDatabase().transaction(
    (transaction) => {
      if (!isOrganizationActive(transaction, input.organizationId)) return false;

      const timestamp = sql`(unixepoch() * 1000)`;
      const result = transaction
        .update(employees)
        .set({ deletedAt: timestamp, updatedAt: timestamp, revision: sql`${employees.revision} + 1` })
        .where(employeeScope(input))
        .run();

      return result.changes === 1;
    },
    { behavior: "immediate" },
  );
}

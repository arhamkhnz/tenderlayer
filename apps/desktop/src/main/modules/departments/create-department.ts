import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { departments } from "@db/schema/departments";
import type { DepartmentSaveResult } from "@shared/contracts/departments";
import type { CreateDepartmentInput } from "@shared/schemas/departments";

import { getConflicts } from "./department-queries.js";

export function createDepartment(input: CreateDepartmentInput): DepartmentSaveResult {
  const { organizationId, name, code } = input;

  return getDatabase().transaction<DepartmentSaveResult>(
    (transaction) => {
      if (!isOrganizationActive(transaction, organizationId)) {
        return { ok: false, fieldErrors: [], formError: "This organization is no longer available." };
      }

      const fieldErrors = getConflicts(transaction, input);
      if (fieldErrors.length) return { ok: false, fieldErrors };

      const result = transaction
        .insert(departments)
        .values({ organizationId, name, code: code || null })
        .run();

      if (result.changes !== 1) throw new Error("Department insert did not write one row");
      return { ok: true };
    },
    { behavior: "immediate" },
  );
}

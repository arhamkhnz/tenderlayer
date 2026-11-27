import { and, eq, isNull, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { departments } from "@db/schema/departments";
import { organizations } from "@db/schema/organizations";
import type { DepartmentSaveResult } from "@shared/contracts/departments";
import type { UpdateDepartmentInput } from "@shared/schemas/departments";

import { getConflicts } from "./department-queries.js";

export function updateDepartment(input: UpdateDepartmentInput): DepartmentSaveResult {
  const { organizationId, departmentId, name, code } = input;

  return getDatabase().transaction<DepartmentSaveResult>(
    (transaction) => {
      const target = and(eq(departments.id, departmentId), eq(departments.organizationId, organizationId));
      const existing = transaction
        .select({ id: departments.id })
        .from(departments)
        .innerJoin(organizations, eq(organizations.id, departments.organizationId))
        .where(and(target, isNull(departments.deletedAt), isNull(organizations.deletedAt)))
        .get();
      if (!existing) {
        return {
          ok: false,
          fieldErrors: [],
          formError: "This department is no longer available in this organization.",
        };
      }

      const fieldErrors = getConflicts(transaction, input, departmentId);
      if (fieldErrors.length) return { ok: false, fieldErrors };

      const result = transaction
        .update(departments)
        .set({
          name,
          code: code || null,
          updatedAt: sql`(unixepoch() * 1000)`,
          revision: sql`${departments.revision} + 1`,
        })
        .where(target)
        .run();

      if (result.changes !== 1) throw new Error("Department update did not write one row");
      return { ok: true };
    },
    { behavior: "immediate" },
  );
}

import { and, eq, isNull, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { departments } from "@db/schema/departments";
import type { DeleteDepartmentInput } from "@shared/schemas/departments";

export function deleteDepartment({ organizationId, departmentId }: DeleteDepartmentInput) {
  return getDatabase().transaction(
    (transaction) => {
      if (!isOrganizationActive(transaction, organizationId)) return false;

      const timestamp = sql`(unixepoch() * 1000)`;
      const result = transaction
        .update(departments)
        .set({ deletedAt: timestamp, updatedAt: timestamp, revision: sql`${departments.revision} + 1` })
        .where(
          and(
            eq(departments.id, departmentId),
            eq(departments.organizationId, organizationId),
            isNull(departments.deletedAt),
          ),
        )
        .run();

      return result.changes === 1;
    },
    { behavior: "immediate" },
  );
}

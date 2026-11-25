import { and, asc, eq, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { departments } from "@db/schema/departments";
import { organizations } from "@db/schema/organizations";
import type { DepartmentRecord } from "@shared/contracts/departments";

export function listDepartments(organizationId: string): DepartmentRecord[] {
  return getDatabase()
    .select({
      id: departments.id,
      name: departments.name,
      code: departments.code,
    })
    .from(departments)
    .innerJoin(organizations, eq(organizations.id, departments.organizationId))
    .where(
      and(
        eq(departments.organizationId, organizationId),
        isNull(departments.deletedAt),
        isNull(organizations.deletedAt),
      ),
    )
    .orderBy(asc(departments.name), asc(departments.id))
    .all();
}

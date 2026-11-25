import { and, asc, eq, getTableColumns, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { departments, type Department } from "@db/schema/departments";
import { organizations } from "@db/schema/organizations";

export function listDepartments(organizationId: string): Department[] {
  return getDatabase()
    .select(getTableColumns(departments))
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

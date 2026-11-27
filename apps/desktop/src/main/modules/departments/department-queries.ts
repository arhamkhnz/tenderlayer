import { and, eq, isNull, ne, or, sql } from "drizzle-orm";

import type { DatabaseClient } from "@db/client";
import { departments } from "@db/schema/departments";
import type { DepartmentFieldError } from "@shared/contracts/departments";
import type { CreateDepartmentInput } from "@shared/schemas/departments";

function getConflicts(db: Pick<DatabaseClient, "select">, input: CreateDepartmentInput, departmentId?: string) {
  const { organizationId, name, code } = input;
  const nameMatches = sql`lower(${departments.name}) = lower(${name})`;
  const codeMatches = sql`lower(${departments.code}) = lower(${code || null})`;
  const matches = db
    .select({ name: nameMatches.mapWith(Boolean), code: codeMatches.mapWith(Boolean) })
    .from(departments)
    .where(
      and(
        eq(departments.organizationId, organizationId),
        isNull(departments.deletedAt),
        departmentId ? ne(departments.id, departmentId) : undefined,
        or(nameMatches, code ? codeMatches : undefined),
      ),
    )
    .all();

  const fieldErrors: DepartmentFieldError[] = [];
  if (matches.some((row) => row.name)) {
    fieldErrors.push({ field: "name", message: "A department with this name already exists in this organization." });
  }
  if (matches.some((row) => row.code)) {
    fieldErrors.push({ field: "code", message: "A department with this code already exists in this organization." });
  }
  return fieldErrors;
}

export { getConflicts };

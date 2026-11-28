import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { contracts } from "@db/schema/contracts";
import { employees } from "@db/schema/employees";
import { organizations } from "@db/schema/organizations";
import type { EmployeeRecord } from "@shared/contracts/employees";

export function listEmployees(organizationId: string): EmployeeRecord[] {
  return getDatabase()
    .select({
      id: employees.id,
      code: employees.code,
      name: employees.name,
      jobTitle: employees.jobTitle,
      contractId: contracts.id,
      contractTitle: contracts.title,
      location: sql<string | null>`coalesce(
        nullif(trim(${employees.workCity}), ''),
        nullif(trim(${employees.workState}), ''),
        nullif(trim(${employees.siteLocation}), ''),
        nullif(trim(${contracts.locationCity}), ''),
        nullif(trim(${contracts.locationState}), ''),
        nullif(trim(${contracts.locationAddress}), '')
      )`,
      status: employees.status,
      monthlyPay: employees.monthlyPay,
      currency: employees.currency,
    })
    .from(employees)
    .innerJoin(organizations, eq(organizations.id, employees.organizationId))
    .leftJoin(
      contracts,
      and(
        eq(contracts.id, employees.contractId),
        eq(contracts.organizationId, employees.organizationId),
        isNull(contracts.deletedAt),
      ),
    )
    .where(
      and(eq(employees.organizationId, organizationId), isNull(employees.deletedAt), isNull(organizations.deletedAt)),
    )
    .orderBy(asc(employees.name), asc(employees.code))
    .all();
}

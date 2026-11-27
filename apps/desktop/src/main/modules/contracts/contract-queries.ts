import { and, eq, isNull } from "drizzle-orm";

import { type DatabaseClient, getDatabase } from "@db/client";
import { contracts } from "@db/schema/contracts";
import { departments } from "@db/schema/departments";
import { organizations } from "@db/schema/organizations";
import { parseMoneyAmount } from "@shared/money";
import type { ContractFormValues } from "@shared/schemas/contracts";

export function selectContracts(organizationId: string, contractId?: string) {
  return getDatabase()
    .select({
      id: contracts.id,
      title: contracts.title,
      gemReference: contracts.gemReference,
      departmentId: contracts.departmentId,
      departmentName: departments.name,
      status: contracts.status,
      amount: contracts.amount,
      currency: contracts.currency,
      includesTax: contracts.includesTax,
      locationState: contracts.locationState,
      locationCity: contracts.locationCity,
      locationAddress: contracts.locationAddress,
      workOrderReceivedDate: contracts.workOrderReceivedDate,
      startDate: contracts.startDate,
      duration: contracts.duration,
      durationUnit: contracts.durationUnit,
      endDate: contracts.endDate,
      requiredHeadcount: contracts.requiredHeadcount,
      deployedHeadcount: contracts.deployedHeadcount,
      notes: contracts.notes,
    })
    .from(contracts)
    .innerJoin(organizations, eq(organizations.id, contracts.organizationId))
    .leftJoin(
      departments,
      and(eq(departments.id, contracts.departmentId), eq(departments.organizationId, contracts.organizationId)),
    )
    .where(
      and(
        eq(contracts.organizationId, organizationId),
        isNull(contracts.deletedAt),
        isNull(organizations.deletedAt),
        contractId === undefined ? undefined : eq(contracts.id, contractId),
      ),
    );
}

export function isDepartmentActive(db: Pick<DatabaseClient, "select">, organizationId: string, departmentId: string) {
  return Boolean(
    db
      .select({ id: departments.id })
      .from(departments)
      .where(
        and(
          eq(departments.organizationId, organizationId),
          eq(departments.id, departmentId),
          isNull(departments.deletedAt),
        ),
      )
      .get(),
  );
}

export function contractValues(input: ContractFormValues) {
  return {
    title: input.title,
    departmentId: input.department,
    gemReference: input.gemReference || null,
    locationState: input.locationState || null,
    locationCity: input.locationCity || null,
    locationAddress: input.locationAddress || null,
    status: input.status,
    amount: parseMoneyAmount(input.value, input.currency),
    currency: input.currency,
    includesTax: input.includesTax,
    workOrderReceivedDate: input.workOrderReceivedDate || null,
    startDate: input.startDate || null,
    duration: input.duration ? Number(input.duration) : null,
    durationUnit: input.durationUnit,
    endDate: input.endDate || null,
    requiredHeadcount: input.required ? Number(input.required) : null,
    deployedHeadcount: Number(input.deployed),
    notes: input.notes || null,
  };
}

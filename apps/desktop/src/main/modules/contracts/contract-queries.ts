import { and, eq, isNull } from "drizzle-orm";

import type { DatabaseClient } from "@db/client";
import { departments } from "@db/schema/departments";
import { parseContractAmount, type ContractFormValues } from "@shared/schemas/contracts";

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
    amount: parseContractAmount(input.value, input.currency),
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

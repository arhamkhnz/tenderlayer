import { and, asc, eq, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { contracts } from "@db/schema/contracts";
import { departments } from "@db/schema/departments";
import { organizations } from "@db/schema/organizations";
import type { ContractRecord } from "@shared/contracts/contracts";

export function listContracts(organizationId: string): ContractRecord[] {
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
      and(eq(contracts.organizationId, organizationId), isNull(contracts.deletedAt), isNull(organizations.deletedAt)),
    )
    .orderBy(asc(contracts.title), asc(contracts.id))
    .all();
}

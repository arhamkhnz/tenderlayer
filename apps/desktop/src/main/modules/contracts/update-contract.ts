import { and, eq, isNull, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { contracts } from "@db/schema/contracts";
import type { ContractSaveResult } from "@shared/contracts/contracts";
import type { UpdateContractInput } from "@shared/schemas/contracts";

import { contractValues, isDepartmentActive } from "./contract-queries.js";

export function updateContract(input: UpdateContractInput): ContractSaveResult {
  const { organizationId, contractId, department } = input;
  return getDatabase().transaction<ContractSaveResult>(
    (transaction) => {
      if (!isOrganizationActive(transaction, organizationId)) {
        return { ok: false, fieldErrors: [], formError: "This organization is no longer available." };
      }

      const target = and(
        eq(contracts.id, contractId),
        eq(contracts.organizationId, organizationId),
        isNull(contracts.deletedAt),
      );
      const existing = transaction.select({ departmentId: contracts.departmentId }).from(contracts).where(target).get();
      if (!existing) {
        return { ok: false, fieldErrors: [], formError: "This contract is no longer available in this organization." };
      }
      if (
        department &&
        department !== existing.departmentId &&
        !isDepartmentActive(transaction, organizationId, department)
      ) {
        return { ok: false, fieldErrors: [{ field: "department", message: "Select an available department." }] };
      }

      const result = transaction
        .update(contracts)
        .set({
          ...contractValues(input),
          updatedAt: sql`(unixepoch() * 1000)`,
          revision: sql`${contracts.revision} + 1`,
        })
        .where(target)
        .run();
      if (result.changes !== 1) throw new Error("Contract update did not write one row");
      return { ok: true };
    },
    { behavior: "immediate" },
  );
}

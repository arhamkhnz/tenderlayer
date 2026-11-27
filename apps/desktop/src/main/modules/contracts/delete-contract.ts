import { and, eq, isNull, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { contracts } from "@db/schema/contracts";
import type { ContractIdentity } from "@shared/schemas/contracts";

export function deleteContract({ organizationId, contractId }: ContractIdentity) {
  return getDatabase().transaction(
    (transaction) => {
      if (!isOrganizationActive(transaction, organizationId)) return false;

      const timestamp = sql`(unixepoch() * 1000)`;
      const result = transaction
        .update(contracts)
        .set({ deletedAt: timestamp, updatedAt: timestamp, revision: sql`${contracts.revision} + 1` })
        .where(
          and(eq(contracts.id, contractId), eq(contracts.organizationId, organizationId), isNull(contracts.deletedAt)),
        )
        .run();

      return result.changes === 1;
    },
    { behavior: "immediate" },
  );
}

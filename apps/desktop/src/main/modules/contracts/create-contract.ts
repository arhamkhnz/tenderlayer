import { getDatabase } from "@db/client";
import { isOrganizationActive } from "@db/organization-queries";
import { contracts } from "@db/schema/contracts";
import type { ContractSaveResult } from "@shared/contracts/contracts";
import type { CreateContractInput } from "@shared/schemas/contracts";

import { contractValues, isDepartmentActive } from "./contract-queries.js";

export function createContract(input: CreateContractInput): ContractSaveResult {
  const { organizationId, department } = input;
  return getDatabase().transaction<ContractSaveResult>(
    (transaction) => {
      if (!isOrganizationActive(transaction, organizationId)) {
        return { ok: false, fieldErrors: [], formError: "This organization is no longer available." };
      }
      if (department && !isDepartmentActive(transaction, organizationId, department)) {
        return { ok: false, fieldErrors: [{ field: "department", message: "Select an available department." }] };
      }

      const result = transaction
        .insert(contracts)
        .values({ ...contractValues(input), organizationId })
        .run();
      if (result.changes !== 1) throw new Error("Contract insert did not write one row");
      return { ok: true };
    },
    { behavior: "immediate" },
  );
}

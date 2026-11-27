import type { ContractRecord } from "@shared/contracts/contracts";
import type { ContractIdentity } from "@shared/schemas/contracts";

import { selectContracts } from "./contract-queries.js";

export function getContract({ organizationId, contractId }: ContractIdentity): ContractRecord | null {
  return selectContracts(organizationId, contractId).get() ?? null;
}

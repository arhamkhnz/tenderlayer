import { asc } from "drizzle-orm";

import { contracts } from "@db/schema/contracts";
import type { ContractRecord } from "@shared/contracts/contracts";

import { selectContracts } from "./contract-queries.js";

export function listContracts(organizationId: string): ContractRecord[] {
  return selectContracts(organizationId).orderBy(asc(contracts.title), asc(contracts.id)).all();
}

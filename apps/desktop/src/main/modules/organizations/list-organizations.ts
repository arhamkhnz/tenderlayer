import { asc, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { organizations } from "@db/schema/organizations";
import type { OrganizationRecord } from "@shared/contracts/organizations";

export function listOrganizations(): OrganizationRecord[] {
  return getDatabase()
    .select({ id: organizations.id, name: organizations.name })
    .from(organizations)
    .where(isNull(organizations.deletedAt))
    .orderBy(asc(organizations.name))
    .all();
}

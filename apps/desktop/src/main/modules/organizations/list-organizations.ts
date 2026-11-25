import { asc, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { organizations, type Organization } from "@db/schema/organizations";

export function listOrganizations(): Organization[] {
  return getDatabase()
    .select()
    .from(organizations)
    .where(isNull(organizations.deletedAt))
    .orderBy(asc(organizations.name))
    .all();
}

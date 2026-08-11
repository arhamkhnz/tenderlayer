import { asc, isNull } from "drizzle-orm";
import { getDatabase } from "../../core/database/client.js";
import { organizations, type Organization } from "../../core/database/schema/organizations.js";

export function listOrganizations(): Organization[] {
  return getDatabase()
    .select()
    .from(organizations)
    .where(isNull(organizations.deletedAt))
    .orderBy(asc(organizations.name))
    .all();
}

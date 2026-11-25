import { and, eq, isNull } from "drizzle-orm";

import type { DatabaseClient } from "./client.js";
import { organizations } from "./schema/organizations.js";

export function isOrganizationActive(database: Pick<DatabaseClient, "select">, organizationId: string) {
  const organization = database
    .select({ id: organizations.id })
    .from(organizations)
    .where(and(eq(organizations.id, organizationId), isNull(organizations.deletedAt)))
    .get();

  return organization !== undefined;
}

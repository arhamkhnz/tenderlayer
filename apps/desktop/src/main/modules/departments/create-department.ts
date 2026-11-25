import { and, eq, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { departments, type Department } from "@db/schema/departments";
import { organizations } from "@db/schema/organizations";
import type { CreateDepartmentInput } from "@shared/schemas/departments";

export function createDepartment({ organizationId, name, code }: CreateDepartmentInput): Department | undefined {
  return getDatabase().transaction(
    (transaction) => {
      const organization = transaction
        .select({ id: organizations.id })
        .from(organizations)
        .where(and(eq(organizations.id, organizationId), isNull(organizations.deletedAt)))
        .get();

      if (!organization) return undefined;

      return transaction
        .insert(departments)
        .values({ organizationId, name, code: code || null })
        .returning()
        .get();
    },
    { behavior: "immediate" },
  );
}

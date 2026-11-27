import { and, isNull, sql } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { organizations } from "@db/schema/organizations";
import type { CreateOrganizationResult } from "@shared/contracts/organizations";
import { organizationSlugMaxLength, type CreateOrganizationInput } from "@shared/schemas/organizations";

import { createOrganizationSlug } from "./create-organization-slug.js";

export function createOrganization({ name }: CreateOrganizationInput): CreateOrganizationResult {
  return getDatabase().transaction<CreateOrganizationResult>(
    (transaction) => {
      const existing = transaction
        .select({ id: organizations.id })
        .from(organizations)
        .where(and(isNull(organizations.deletedAt), sql`lower(${organizations.name}) = lower(${name})`))
        .get();

      if (existing) {
        return {
          ok: false,
          fieldErrors: [{ field: "name", message: "An organization with this name already exists" }],
        };
      }

      const baseSlug = createOrganizationSlug(name);

      for (let attempt = 1; ; attempt++) {
        const suffix = attempt === 1 ? "" : `-${attempt}`;
        const slug = baseSlug.slice(0, organizationSlugMaxLength - suffix.length).replace(/-+$/, "") + suffix;
        const organization = transaction
          .insert(organizations)
          .values({ name, slug })
          .onConflictDoNothing({ target: organizations.slug })
          .returning({ id: organizations.id })
          .get();

        if (organization) {
          // Future cloud sync: enqueue an outbox event using this transaction before returning.
          return { ok: true, organizationId: organization.id };
        }
      }
    },
    { behavior: "immediate" },
  );
}

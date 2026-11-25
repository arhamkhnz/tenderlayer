import { eq } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { organizations, type Organization } from "@db/schema/organizations";
import { organizationSlugMaxLength, type CreateOrganizationInput } from "@shared/schemas/organizations";

import { createOrganizationSlug } from "./create-organization-slug.js";

export function createOrganization({ name }: CreateOrganizationInput): Organization | undefined {
  return getDatabase().transaction(
    (transaction) => {
      const existing = transaction
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.name, name))
        .get();

      if (existing) return undefined;

      const baseSlug = createOrganizationSlug(name);

      for (let attempt = 1; ; attempt++) {
        const suffix = attempt === 1 ? "" : `-${attempt}`;
        const slug = baseSlug.slice(0, organizationSlugMaxLength - suffix.length).replace(/-+$/, "") + suffix;
        const organization = transaction
          .insert(organizations)
          .values({ name, slug })
          .onConflictDoNothing({ target: organizations.slug })
          .returning()
          .get();

        if (organization) {
          // Future cloud sync: enqueue an outbox event using this transaction before returning.
          return organization;
        }
      }
    },
    { behavior: "immediate" },
  );
}

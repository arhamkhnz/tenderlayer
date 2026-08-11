import { parseCreateOrganizationInput } from "../../../shared/schemas/organizations.js";
import { getDatabase } from "../../core/database/client.js";
import { organizations, type Organization } from "../../core/database/schema/organizations.js";

export function createOrganization(input: unknown): Organization {
  const organizationInput = parseCreateOrganizationInput(input);

  return getDatabase().transaction((transaction) => {
    const now = Date.now();
    const organization = transaction
      .insert(organizations)
      .values({
        name: organizationInput.name,
        slug: organizationInput.slug,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    if (!organization) {
      throw new Error("Failed to create organization");
    }

    // Future cloud sync: enqueue an outbox event using this transaction before returning.
    return organization;
  });
}

import { organizationSlugMaxLength } from "../../../shared/schemas/organizations.js";

export function createOrganizationSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, organizationSlugMaxLength)
    .replace(/-+$/g, "");

  return slug || "organization";
}

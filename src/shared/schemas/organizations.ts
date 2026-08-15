import { z } from "zod";

export const organizationNameLimits = {
  min: 3,
  max: 120,
} as const;

export const organizationSlugMaxLength = 80;

const organizationSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const organizationSlugSchema = z
  .string({ error: "Organization slug is required" })
  .trim()
  .toLowerCase()
  .min(1, "Organization slug is required")
  .max(organizationSlugMaxLength, `Organization slug must be at most ${organizationSlugMaxLength} characters`)
  .regex(organizationSlugPattern, "Organization slug must contain lowercase letters, numbers, and single hyphens");

export const createOrganizationSchema = z.object({
  name: z
    .string({ error: "Organization name is required" })
    .trim()
    .min(organizationNameLimits.min, `Organization name must be at least ${organizationNameLimits.min} characters`)
    .max(organizationNameLimits.max, `Organization name must be at most ${organizationNameLimits.max} characters`),
});

export type CreateOrganizationInput = z.input<typeof createOrganizationSchema>;

export function parseCreateOrganizationInput(value: unknown): CreateOrganizationInput {
  const result = createOrganizationSchema.safeParse(value);

  if (!result.success) {
    throw new TypeError(result.error.issues[0]?.message ?? "Invalid organization input");
  }

  return result.data;
}

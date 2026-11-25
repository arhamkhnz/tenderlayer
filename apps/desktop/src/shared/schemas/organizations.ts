import { z } from "zod";

export const organizationNameLimits = {
  min: 2,
  max: 120,
} as const;

export const organizationSlugMaxLength = 80;

export const createOrganizationSchema = z.object({
  name: z
    .string({ error: "Organization name is required" })
    .trim()
    .min(organizationNameLimits.min, `Organization name must be at least ${organizationNameLimits.min} characters`)
    .max(organizationNameLimits.max, `Organization name must be at most ${organizationNameLimits.max} characters`),
});

export type CreateOrganizationInput = z.input<typeof createOrganizationSchema>;

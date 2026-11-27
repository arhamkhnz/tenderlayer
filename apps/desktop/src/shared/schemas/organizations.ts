import { z } from "zod";

const organizationNameLimits = {
  min: 2,
  max: 120,
} as const;

export const organizationSlugMaxLength = 80;

export const createOrganizationSchema = z.object({
  name: z
    .string({ error: "Organization name is required" })
    .trim()
    .refine((name) => !name.includes("\0"), "Organization name cannot contain null characters")
    .refine(
      (name) => Array.from(name).length >= organizationNameLimits.min,
      `Organization name must be at least ${organizationNameLimits.min} characters`,
    )
    .refine(
      (name) => Array.from(name).length <= organizationNameLimits.max,
      `Organization name must be at most ${organizationNameLimits.max} characters`,
    ),
});

export type CreateOrganizationInput = z.input<typeof createOrganizationSchema>;

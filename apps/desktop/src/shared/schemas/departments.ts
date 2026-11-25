import { z } from "zod";

export const departmentOrganizationIdSchema = z.string().min(1, "An organization is required.");

export const createDepartmentSchema = z.object({
  organizationId: departmentOrganizationIdSchema,
  name: z.string().trim().min(1, "Enter a department name."),
  code: z.string().trim().nullish(),
});

export type CreateDepartmentInput = z.input<typeof createDepartmentSchema>;

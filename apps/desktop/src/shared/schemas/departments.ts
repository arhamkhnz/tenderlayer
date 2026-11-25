import { z } from "zod";

export const departmentOrganizationIdSchema = z.string().min(1, "An organization is required.");

export const createDepartmentSchema = z.object({
  organizationId: departmentOrganizationIdSchema,
  name: z.string().trim().min(1, "Enter a department name."),
  code: z.string().trim().nullish(),
});

export const updateDepartmentSchema = createDepartmentSchema.extend({
  departmentId: z.string().min(1, "A department is required."),
});

export type CreateDepartmentInput = z.input<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.input<typeof updateDepartmentSchema>;

import { z } from "zod";

export const departmentOrganizationIdSchema = z.string().min(1, "An organization is required.");

export const createDepartmentSchema = z.object({
  organizationId: departmentOrganizationIdSchema,
  name: z
    .string()
    .trim()
    .min(1, "Enter a department name.")
    .refine((name) => !name.includes("\0"), "Department name cannot contain null characters."),
  code: z
    .string()
    .trim()
    .refine((code) => !code.includes("\0"), "Department code cannot contain null characters.")
    .nullish(),
});

export const updateDepartmentSchema = createDepartmentSchema.extend({
  departmentId: z.string().min(1, "A department is required."),
});

export const deleteDepartmentSchema = updateDepartmentSchema.pick({ organizationId: true, departmentId: true });

export type CreateDepartmentInput = z.input<typeof createDepartmentSchema>;
export type DeleteDepartmentInput = z.input<typeof deleteDepartmentSchema>;
export type UpdateDepartmentInput = z.input<typeof updateDepartmentSchema>;

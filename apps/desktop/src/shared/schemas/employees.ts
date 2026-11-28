import { z } from "zod";

import { parseMoneyAmount } from "../money.js";
import { indianStatesAndUTs } from "../reference-data.js";

export const employeeEmploymentTypes = ["full-time", "contractual", "temporary", "part-time"] as const;
export const employeeStatuses = ["active", "on-leave", "inactive"] as const;
export const employeeBankFields = ["accountHolder", "bankName", "accountNumber", "ifsc"] as const;

export function hasContractWorkLocation(contract?: { locationState: string | null; locationCity: string | null }) {
  return Boolean(contract?.locationState?.trim() && contract.locationCity?.trim());
}

const text = z
  .string()
  .trim()
  .refine((value) => !value.includes("\0"), "Remove null characters.");
const currency = z.string().regex(/^[A-Z]{3}$/, "Enter a valid currency code.");
const optionalPattern = (pattern: RegExp, message: string) =>
  text.refine((value) => !value || pattern.test(value), message);

const personalSchema = z.object({
  name: text.min(1, "Enter the employee's name."),
  phone: text.refine(
    (value) => /^\+?\d{10,15}$/.test(value.replace(/[\s()-]/g, "")),
    "Enter a valid contact number, including the country code if needed.",
  ),
  email: text.pipe(z.union([z.literal(""), z.email("Enter a valid email address.")])),
  address: text,
});

const assignmentSchema = z.object({
  contractId: text,
  useContractLocation: z.boolean(),
  workState: text.refine((value) => !value || indianStatesAndUTs.includes(value), "Select a valid state / UT."),
  workCity: text,
  siteLocation: text,
});

const employmentSchema = z.object({
  jobTitle: text.min(1, "Enter a job title."),
  employmentType: z.enum(employeeEmploymentTypes),
  joiningDate: z.iso.date("Choose the company joining date."),
  status: z.enum(employeeStatuses),
  monthlyPay: text,
  currency,
});

const statutoryIdSchema = z.object({
  pan: optionalPattern(/^[A-Z]{5}\d{4}[A-Z]$/, "Enter a PAN in the format ABCDE1234F."),
  uan: optionalPattern(/^\d{12}$/, "UAN must contain 12 digits."),
});

const bankSchema = z.object({
  accountHolder: text,
  bankName: text,
  ifsc: optionalPattern(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter an IFSC in the format SBIN0001234."),
  accountNumber: optionalPattern(/^\d+$/, "Use digits only for the account number."),
});

export const employeeFormSchema = z
  .object({
    ...personalSchema.shape,
    ...assignmentSchema.shape,
    ...employmentSchema.shape,
    ...statutoryIdSchema.shape,
    ...bankSchema.shape,
    notes: text,
  })
  .superRefine((values, context) => {
    if (
      currency.safeParse(values.currency).success &&
      (parseMoneyAmount(values.monthlyPay, values.currency) ?? 0) <= 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["monthlyPay"],
        message: "Enter a valid monthly wage greater than zero.",
      });
    }
    if (
      !(values.contractId && values.useContractLocation) &&
      (values.contractId || values.workState || values.workCity || values.siteLocation)
    ) {
      if (!values.workState) {
        context.addIssue({ code: "custom", path: ["workState"], message: "Select a work state / UT." });
      }
      if (!values.workCity) {
        context.addIssue({ code: "custom", path: ["workCity"], message: "Enter the work city / town." });
      }
    }
    if (employeeBankFields.some((name) => values[name])) {
      for (const [name, message] of [
        ["accountHolder", "Enter the account holder's name."],
        ["accountNumber", "Enter the bank account number."],
        ["ifsc", "Enter the bank's IFSC."],
      ] as const) {
        if (!values[name]) context.addIssue({ code: "custom", path: [name], message });
      }
    }
  });

export const employeeOrganizationIdSchema = text.min(1, "An organization is required.");
export const employeeIdentitySchema = z.object({
  organizationId: employeeOrganizationIdSchema,
  employeeId: text.min(1, "An employee is required."),
});
export const createEmployeeSchema = employeeFormSchema.safeExtend({
  organizationId: employeeOrganizationIdSchema,
});
export const updateEmployeeSchema = employeeFormSchema.safeExtend({
  ...employeeIdentitySchema.shape,
  revision: z.int().positive(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
export type EmployeeIdentity = z.infer<typeof employeeIdentitySchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

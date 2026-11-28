import { z } from "zod";

import { calculateEndDate, contractDurationUnits } from "../contract-dates.js";
import { contractStatuses } from "../contract-statuses.js";
import { parseMoneyAmount } from "../money.js";
import { indianStatesAndUTs } from "../reference-data.js";

export const contractOrganizationIdSchema = z.string().min(1, "An organization is required.");

const optionalDate = z.union([z.literal(""), z.iso.date("Choose a valid date.")]);
const optionalInteger = (minimum: number) =>
  z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      if (!/^\d+$/.test(value)) return false;
      const number = Number(value);
      return Number.isSafeInteger(number) && number >= minimum;
    }, `Enter a whole number of ${minimum} or more.`);
const text = z
  .string()
  .trim()
  .refine((value) => !value.includes("\0"), "Remove null characters.");
const currencySchema = z.string().regex(/^[A-Z]{3}$/, "Enter a valid currency code.");

const requiredOutsideDraft = [
  ["department", "Select a department."],
  ["gemReference", "Enter the GeM reference number."],
  ["locationState", "Select the contract state / UT."],
  ["locationCity", "Enter the contract city / town."],
  ["value", "Enter the contract value."],
  ["startDate", "Choose the start date."],
  ["duration", "Enter the contract duration."],
  ["required", "Enter the number of employees required."],
] as const;

const contractSchema = z.object({
  title: text.min(1, "Enter a contract title."),
  department: z.string().min(1, "Select a valid department.").nullable(),
  gemReference: text,
  status: z.enum(contractStatuses),
});

const locationSchema = z.object({
  locationState: text.refine((value) => !value || indianStatesAndUTs.includes(value), "Select a valid state / UT."),
  locationCity: text,
  locationAddress: text,
});

const valueSchema = z.object({
  value: text,
  currency: currencySchema,
  includesTax: z.boolean(),
});

const scheduleSchema = z.object({
  workOrderReceivedDate: optionalDate,
  startDate: optionalDate,
  duration: optionalInteger(1),
  durationUnit: z.enum(contractDurationUnits),
  endDate: optionalDate,
});

const staffingSchema = z.object({
  required: optionalInteger(0),
  deployed: optionalInteger(0),
});

export const contractFormSchema = z
  .object({
    ...contractSchema.shape,
    ...locationSchema.shape,
    ...valueSchema.shape,
    ...scheduleSchema.shape,
    ...staffingSchema.shape,
    notes: text,
  })
  .superRefine((values, context) => {
    if (values.endDate && values.startDate && values.endDate < values.startDate) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "The contract can’t end before its start date." });
    }
    if (
      values.duration &&
      values.startDate &&
      !calculateEndDate(values.startDate, values.duration, values.durationUnit)
    ) {
      context.addIssue({
        code: "custom",
        path: ["duration"],
        message: "Enter a duration within the supported date range.",
      });
    }
    if (
      values.value &&
      currencySchema.safeParse(values.currency).success &&
      parseMoneyAmount(values.value, values.currency) === null
    ) {
      context.addIssue({ code: "custom", path: ["value"], message: "Enter a valid contract value." });
    }
    if (values.status === "draft") return;

    for (const [field, message] of requiredOutsideDraft) {
      if (!values[field]) context.addIssue({ code: "custom", path: [field], message });
    }
  });

const contractIdSchema = z.string().min(1, "A contract is required.");

export const createContractSchema = contractFormSchema.safeExtend({ organizationId: contractOrganizationIdSchema });
export const updateContractSchema = createContractSchema.safeExtend({ contractId: contractIdSchema });
export const contractIdentitySchema = z.object({
  organizationId: contractOrganizationIdSchema,
  contractId: contractIdSchema,
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;
export type CreateContractInput = z.infer<typeof createContractSchema>;
export type ContractIdentity = z.infer<typeof contractIdentitySchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;

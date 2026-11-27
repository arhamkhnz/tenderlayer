import { z } from "zod";

import { indianStatesAndUTs } from "../reference-data.js";

export const contractOrganizationIdSchema = z.string().min(1, "An organization is required.");

const contractStatuses = ["draft", "wo-received", "scheduled", "active", "on-hold", "completed", "terminated"] as const;
const durationUnits = ["days", "months", "years"] as const;
type DurationUnit = (typeof durationUnits)[number];

export function calculateEndDate(startDate: string, duration: string, unit: DurationUnit) {
  const amount = Number(duration);
  if (!startDate || !Number.isSafeInteger(amount) || amount < 1) return "";
  const start = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return "";
  const end = new Date(start);

  if (unit === "days") {
    end.setUTCDate(start.getUTCDate() + amount - 1);
  } else {
    // Calendar terms include their final day; short months clamp to their last day.
    end.setUTCDate(1);
    end.setUTCMonth(start.getUTCMonth() + amount * (unit === "years" ? 12 : 1));
    const lastDay = new Date(end);
    lastDay.setUTCMonth(end.getUTCMonth() + 1, 0);
    end.setUTCDate(Math.min(start.getUTCDate() - 1, lastDay.getUTCDate()));
  }

  if (Number.isNaN(end.getTime()) || end.getUTCFullYear() < 1 || end.getUTCFullYear() > 9999) return "";
  return end.toISOString().slice(0, 10);
}

export function getCurrencyFractionDigits(currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 0;
}

export function parseContractAmount(value: string, currency: string) {
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return null;
  const [whole = "", fraction = ""] = value.split(".");
  const digits = getCurrencyFractionDigits(currency);
  if (fraction.length > digits) return null;

  const amount = Number(whole + fraction.padEnd(digits, "0"));
  return Number.isSafeInteger(amount) ? amount : null;
}

const optionalDate = z.union([z.literal(""), z.iso.date("Choose a valid date.")]);
const optionalInteger = (minimum: number) =>
  z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      const number = Number(value);
      return Number.isSafeInteger(number) && number >= minimum;
    }, `Enter a whole number of ${minimum} or more.`);
const text = z
  .string()
  .trim()
  .refine((value) => !value.includes("\0"), "Remove null characters.");
const currencySchema = z.string().regex(/^[A-Z]{3}$/, "Enter a valid currency code.");

export const contractFormSchema = z
  .object({
    title: text.min(1, "Enter a contract title."),
    department: z.string().min(1, "Select a valid department.").nullable(),
    gemReference: text,
    locationState: text.refine((value) => !value || indianStatesAndUTs.includes(value), "Select a valid state / UT."),
    locationCity: text,
    locationAddress: text,
    status: z.enum(contractStatuses),
    value: text,
    currency: currencySchema,
    includesTax: z.boolean(),
    workOrderReceivedDate: optionalDate,
    startDate: optionalDate,
    duration: optionalInteger(1),
    durationUnit: z.enum(durationUnits),
    endDate: optionalDate,
    required: optionalInteger(0),
    deployed: optionalInteger(0),
    notes: text,
  })
  .superRefine((values, context) => {
    if (values.endDate && values.startDate && values.endDate < values.startDate) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "End date must be on or after the start date." });
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
      parseContractAmount(values.value, values.currency) === null
    ) {
      context.addIssue({ code: "custom", path: ["value"], message: "Enter a valid contract value." });
    }
    if (values.status !== "draft") {
      for (const [field, message] of [
        ["department", "Select a department."],
        ["gemReference", "Enter the GeM reference number."],
        ["locationState", "Select the contract state / UT."],
        ["locationCity", "Enter the contract city / town."],
        ["value", "Enter the contract value."],
        ["startDate", "Choose the start date."],
        ["duration", "Enter the contract duration."],
        ["required", "Enter the number of employees required."],
      ] as const) {
        if (!values[field]) context.addIssue({ code: "custom", path: [field], message });
      }
    }
  });

const contractIdSchema = z.string().min(1, "A contract is required.");

export const createContractSchema = contractFormSchema.safeExtend({ organizationId: contractOrganizationIdSchema });
export const updateContractSchema = createContractSchema.safeExtend({ contractId: contractIdSchema });
export const deleteContractSchema = z.object({
  organizationId: contractOrganizationIdSchema,
  contractId: contractIdSchema,
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;
export type CreateContractInput = z.infer<typeof createContractSchema>;
export type DeleteContractInput = z.infer<typeof deleteContractSchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;

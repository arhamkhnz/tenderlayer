import { contractStatuses } from "@shared/contract-statuses";
import type { ContractRecord } from "@shared/contracts/contracts";

export const contractStatusDisplay: Record<ContractRecord["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  "wo-received": {
    label: "WO Received",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  scheduled: { label: "Scheduled", className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200" },
  active: { label: "Active", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  "on-hold": { label: "On Hold", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  terminated: { label: "Terminated", className: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200" },
};

export const contractStatusOptions = contractStatuses.map((value) => ({
  value,
  label: contractStatusDisplay[value].label,
}));

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export function formatContractDate(value: string | null) {
  const date = value ? new Date(`${value}T00:00:00Z`) : null;
  return date && !Number.isNaN(date.getTime()) ? dateFormatter.format(date) : "—";
}

export function formatContractAmount(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
  return formatter.format(amount / 10 ** fractionDigits);
}

export const paymentPeriodOptions = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "next-month", label: "Next month" },
  { value: "custom", label: "Custom" },
] as const;

export type PaymentPeriod = (typeof paymentPeriodOptions)[number]["value"];
export type PaymentDateRange = { from: Date; to: Date };

export function getPaymentMonthRange(today: Date, period: Exclude<PaymentPeriod, "custom">): PaymentDateRange {
  const offset = period === "last-month" ? -1 : period === "next-month" ? 1 : 0;
  return {
    from: new Date(today.getFullYear(), today.getMonth() + offset, 1),
    to: new Date(today.getFullYear(), today.getMonth() + offset + 1, 0),
  };
}

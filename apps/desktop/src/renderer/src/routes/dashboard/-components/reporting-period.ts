export const reportingPeriods = [
  { label: "All time", value: "all-time" },
  { label: "Last 7 days", value: "last-7-days" },
  { label: "Last 30 days", value: "last-30-days" },
  { label: "Last 3 months", value: "last-3-months" },
  { label: "Last 12 months", value: "last-12-months" },
  { label: "This month", value: "this-month" },
  { label: "This year", value: "this-year" },
] as const;

export type ReportingPeriod = (typeof reportingPeriods)[number]["value"];

export function getReportingStart(period: ReportingPeriod, today: Date, earliest: Date) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (period) {
    case "last-7-days":
      start.setDate(start.getDate() - 6);
      break;
    case "last-30-days":
      start.setDate(start.getDate() - 29);
      break;
    case "last-3-months":
      start.setDate(1);
      start.setMonth(start.getMonth() - 2);
      break;
    case "last-12-months":
      start.setDate(1);
      start.setMonth(start.getMonth() - 11);
      break;
    case "this-month":
      start.setDate(1);
      break;
    case "this-year":
      start.setMonth(0, 1);
      break;
    case "all-time":
      return new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  }

  return start;
}

import { CalendarIcon } from "@keyline-icons/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";

const periods = [
  { label: "All time", value: "all-time" },
  { label: "Last 7 days", value: "last-7-days" },
  { label: "Last 30 days", value: "last-30-days" },
  { label: "Last 3 months", value: "last-3-months" },
  { label: "This month", value: "this-month" },
  { label: "This year", value: "this-year" },
];

export function PeriodFilter() {
  return (
    <Select items={periods} defaultValue="all-time">
      <SelectTrigger className="w-36 bg-background dark:bg-background" aria-label="Reporting period">
        <CalendarIcon aria-hidden="true" />
        <SelectValue className="font-medium" placeholder="Select period" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} side="bottom" align="end">
        <SelectGroup>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

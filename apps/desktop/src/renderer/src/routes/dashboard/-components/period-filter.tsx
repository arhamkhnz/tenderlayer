import { CalendarIcon } from "@keyline-icons/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";

import { reportingPeriods, type ReportingPeriod } from "./reporting-period";

export function PeriodFilter({
  value,
  onValueChange,
}: {
  value: ReportingPeriod;
  onValueChange: (value: ReportingPeriod) => void;
}) {
  return (
    <Select
      items={reportingPeriods}
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next);
      }}
    >
      <SelectTrigger className="w-36 bg-background dark:bg-background" aria-label="Reporting period">
        <CalendarIcon aria-hidden="true" />
        <SelectValue className="font-medium" placeholder="Select period" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} side="bottom" align="end">
        <SelectGroup>
          {reportingPeriods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

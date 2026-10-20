import { CalendarIcon } from "@keyline-icons/react";
import { useState } from "react";

import { Button } from "@tenderlayer/ui/components/button";
import { Calendar } from "@tenderlayer/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverTitle } from "@tenderlayer/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";

import {
  getPaymentMonthRange,
  paymentPeriodOptions,
  type PaymentDateRange,
  type PaymentPeriod,
} from "./payment-date-range";
import { paymentDateFormatter } from "./payment-data";

export function PaymentPeriodFilter({
  today,
  value,
  range,
  onChange,
}: {
  today: Date;
  value: PaymentPeriod;
  range: PaymentDateRange;
  onChange: (value: PaymentPeriod, range: PaymentDateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customRequested, setCustomRequested] = useState(false);
  const [draft, setDraft] = useState<{ from: Date | undefined; to?: Date }>(range);

  function closePicker() {
    setOpen(false);
    setCustomRequested(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        items={paymentPeriodOptions}
        value={customRequested ? "custom" : value}
        onValueChange={(next) => {
          if (!next) return;
          if (next === "custom") {
            setDraft(range);
            setCustomRequested(true);
            window.requestAnimationFrame(() => setOpen(true));
          } else {
            closePicker();
            onChange(next, getPaymentMonthRange(today, next));
          }
        }}
      >
        <SelectTrigger className="w-36 bg-background dark:bg-background" aria-label="Payment period">
          <CalendarIcon aria-hidden="true" />
          <SelectValue className="font-medium" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start" className="min-w-40">
          <SelectGroup>
            {paymentPeriodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="pr-8">
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {value === "custom" || customRequested ? (
        <Popover
          open={open}
          onOpenChange={(next) => {
            if (next) {
              setDraft(range);
              setOpen(true);
            } else closePicker();
          }}
        >
          <PopoverTrigger render={<Button variant="outline" />} aria-label="Choose custom payment dates">
            <CalendarIcon data-icon="inline-start" />
            {paymentDateFormatter.format(range.from)} – {paymentDateFormatter.format(range.to)}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] gap-0 p-0">
            <PopoverTitle className="sr-only">Custom payment date range</PopoverTitle>
            <Calendar
              mode="range"
              numberOfMonths={2}
              defaultMonth={draft.from ?? range.from}
              selected={draft}
              onSelect={(next) => setDraft(next ?? { from: undefined })}
            />
            <div className="flex items-center justify-end gap-2 border-t p-3">
              <Button variant="ghost" onClick={closePicker}>
                Cancel
              </Button>
              <Button
                disabled={!draft.from || !draft.to}
                onClick={() => {
                  if (draft.from && draft.to) {
                    onChange("custom", { from: draft.from, to: draft.to });
                    closePicker();
                  }
                }}
              >
                Apply range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
}

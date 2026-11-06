import { CalendarIcon, Info } from "@keyline-icons/react";
import { useState, type Ref } from "react";

import { Button } from "@tenderlayer/ui/components/button";
import { Calendar } from "@tenderlayer/ui/components/calendar";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@tenderlayer/ui/components/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@tenderlayer/ui/components/tooltip";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@tenderlayer/ui/components/popover";

type ContractDatePickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  triggerRef?: Ref<HTMLButtonElement>;
  name?: string;
  min?: string;
  invalid?: boolean;
  describedBy?: string;
  info?: string;
};

function toCalendarDate(value: string) {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

export function ContractDatePicker({
  id,
  label,
  value,
  onChange,
  onBlur,
  triggerRef,
  name,
  min,
  invalid,
  describedBy,
  info,
}: ContractDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = toCalendarDate(value);
  const earliest = toCalendarDate(min ?? "");

  const trigger = (
    <PopoverTrigger
      ref={triggerRef}
      name={name}
      onBlur={onBlur}
      data-slot={info ? "input-group-control" : "popover-trigger"}
      render={
        <Button
          id={id}
          type="button"
          variant="outline"
          data-has-info={Boolean(info)}
          data-placeholder={!selected}
          className="w-full justify-start font-normal data-[placeholder=true]:text-muted-foreground data-[has-info=true]:min-w-0 data-[has-info=true]:flex-1 data-[has-info=true]:border-0 data-[has-info=true]:focus-visible:ring-0"
        />
      }
      aria-label={label}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    >
      <CalendarIcon data-icon="inline-start" />
      {selected ? dateFormatter.format(selected) : "Pick a date"}
    </PopoverTrigger>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {info ? (
        <InputGroup>
          {trigger}
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger render={<InputGroupButton size="icon-xs" aria-label="About the contract end date" />}>
                <Info data-icon="inline-end" />
              </TooltipTrigger>
              <TooltipContent>{info}</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        trigger
      )}
      <PopoverContent align="start" className="w-auto p-0">
        <PopoverTitle className="sr-only">{label}</PopoverTitle>
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? earliest}
          disabled={earliest ? { before: earliest } : undefined}
          onSelect={(date) => {
            // Preserve the selected calendar day without converting it to a UTC instant.
            onChange(
              date
                ? `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                : "",
            );
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

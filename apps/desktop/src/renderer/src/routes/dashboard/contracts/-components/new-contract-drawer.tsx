import { FilePlusIcon } from "@keyline-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@tenderlayer/ui/components/button";
import { Checkbox } from "@tenderlayer/ui/components/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@tenderlayer/ui/components/drawer";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@tenderlayer/ui/components/field";
import { Input } from "@tenderlayer/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@tenderlayer/ui/components/input-group";
import { Separator } from "@tenderlayer/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { Textarea } from "@tenderlayer/ui/components/textarea";
import { StatePicker, indianStatesAndUTs } from "../../-components/state-picker";
import { departments } from "../../departments/-components/data";
import { ContractDatePicker } from "./contract-date-picker";

const statusOptions = [
  { value: "draft", label: "Draft", description: "Contract details are still being prepared." },
  {
    value: "wo-received",
    label: "WO Received",
    description: "Work order received; commencement arrangements are pending.",
  },
  { value: "scheduled", label: "Scheduled", description: "Start date confirmed; work has yet to begin." },
  { value: "active", label: "Active", description: "Work has started." },
  { value: "on-hold", label: "On Hold", description: "Work is temporarily paused." },
  { value: "completed", label: "Completed", description: "Contract work is finished." },
  { value: "terminated", label: "Terminated", description: "The contract ended early." },
];
const departmentOptions = [
  { value: null, label: "Select department" },
  ...departments.map((department) => ({ value: department.id, label: department.name })),
];

type DurationUnit = "days" | "months" | "years";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

function calculateEndDate(startDate: string, duration: string, unit: DurationUnit) {
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

function parseHeadcount(value: string) {
  if (!value.trim()) return undefined;
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count : undefined;
}

const optionalDate = z.union([z.literal(""), z.iso.date("Choose a valid date.")]);
const optionalNumber = (minimum: number, whole = false) =>
  z.string().refine(
    (value) => {
      if (!value.trim()) return true;
      const number = Number(value);
      return Number.isFinite(number) && number >= minimum && (!whole || Number.isSafeInteger(number));
    },
    whole ? `Enter a whole number of ${minimum} or more.` : "Enter a valid amount of zero or more.",
  );

const contractFormSchema = z
  .object({
    title: z.string().trim().min(1, "Enter a contract title."),
    department: z
      .string()
      .nullable()
      .refine(
        (value) => value === null || departments.some((department) => department.id === value),
        "Select a valid department.",
      ),
    gemReference: z.string().trim(),
    locationState: z
      .string()
      .refine((value) => !value || indianStatesAndUTs.includes(value), "Select a valid state / UT."),
    locationCity: z.string().trim(),
    locationAddress: z.string().trim(),
    status: z.enum(["draft", "wo-received", "scheduled", "active", "on-hold", "completed", "terminated"]),
    value: optionalNumber(0),
    includesGst: z.boolean(),
    workOrderReceivedDate: optionalDate,
    startDate: optionalDate,
    duration: optionalNumber(1, true),
    durationUnit: z.enum(["days", "months", "years"]),
    endDate: optionalDate,
    required: optionalNumber(0, true),
    deployed: optionalNumber(0, true),
    notes: z.string().trim(),
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
    if (values.status !== "draft") {
      for (const [name, message] of [
        ["department", "Select a department."],
        ["gemReference", "Enter the GeM reference number."],
        ["locationState", "Select the contract state / UT."],
        ["locationCity", "Enter the contract city / town."],
        ["value", "Enter the contract value."],
        ["startDate", "Choose the start date."],
        ["duration", "Enter the contract duration."],
        ["required", "Enter the number of employees required."],
      ] as const) {
        if (!values[name]?.trim()) context.addIssue({ code: "custom", path: [name], message });
      }
    }
  });

type ContractFormValues = z.infer<typeof contractFormSchema>;

export function NewContractDrawer({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const navigate = useNavigate();
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      title: "",
      department: null,
      gemReference: "",
      locationState: "",
      locationCity: "",
      locationAddress: "",
      status: "draft",
      value: "",
      includesGst: false,
      workOrderReceivedDate: "",
      startDate: "",
      duration: "",
      durationUnit: "months",
      endDate: "",
      required: "",
      deployed: "0",
      notes: "",
    },
  });
  const [status, startDate, duration, durationUnit, required, deployed, endDate] = useWatch({
    control: form.control,
    name: ["status", "startDate", "duration", "durationUnit", "required", "deployed", "endDate"],
  });
  const scheduledEndDate = calculateEndDate(startDate, duration, durationUnit);
  const requiredCount = parseHeadcount(required);
  const deployedCount = parseHeadcount(deployed);
  const hasStaffingSummary = requiredCount !== undefined && deployedCount !== undefined;

  function handleFieldChange(onChange: (value: unknown) => void) {
    return (value: unknown) => {
      setPreviewTitle(null);
      onChange(value);
    };
  }

  function handleSubmit(values: ContractFormValues) {
    // Keep this screen a preview until contract persistence is implemented.
    setPreviewTitle(values.title);
  }

  return (
    <Drawer
      swipeDirection="right"
      defaultOpen={defaultOpen}
      onOpenChangeComplete={(open) => {
        if (!open && defaultOpen) void navigate({ to: "/dashboard/contracts", replace: true });
      }}
    >
      <DrawerTrigger render={<Button size="sm" />}>
        <FilePlusIcon data-icon="inline-start" />
        New contract
      </DrawerTrigger>
      <DrawerContent className="w-[calc(100%-1rem)] max-w-lg rounded-xl border border-popover shadow-xl dark:border-border [--drawer-inset:0.5rem] [--drawer-bleed-background:transparent]">
        <DrawerHeader className="border-b px-6 py-5">
          <DrawerTitle className="leading-none font-normal">New contract</DrawerTitle>
          <DrawerDescription>Add the contract details, dates, and staffing.</DrawerDescription>
        </DrawerHeader>
        <form
          id="new-contract-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
          noValidate
        >
          <FieldGroup className="gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-normal" htmlFor="contract-title">
                    Contract title
                  </FieldLabel>
                  <Input
                    {...field}
                    onChange={handleFieldChange(field.onChange)}
                    id="contract-title"
                    placeholder="e.g. Railways Maharashtra"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? "contract-title-error" : undefined}
                  />
                  {fieldState.invalid && <FieldError id="contract-title-error" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <Controller
                name="department"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1 @sm/field-group:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-department">
                      Department
                    </FieldLabel>
                    <Select
                      name={field.name}
                      items={departmentOptions}
                      value={field.value}
                      onValueChange={handleFieldChange(field.onChange)}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="contract-department"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "contract-department-error" : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {departmentOptions.map((option) => (
                            <SelectItem key={option.value ?? "placeholder"} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError id="contract-department-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="locationState"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-location-state">
                      State / UT
                    </FieldLabel>
                    <StatePicker
                      id="contract-location-state"
                      name={field.name}
                      value={field.value}
                      onChange={handleFieldChange(field.onChange)}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "contract-location-state-error" : undefined}
                    />
                    {fieldState.invalid && (
                      <FieldError id="contract-location-state-error" errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="locationCity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-location-city">
                      City / town
                    </FieldLabel>
                    <Input
                      {...field}
                      onChange={handleFieldChange(field.onChange)}
                      id="contract-location-city"
                      placeholder="e.g. Mumbai"
                      autoComplete="address-level2"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "contract-location-city-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="contract-location-city-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="locationAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1 @sm/field-group:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-location-address">
                      Site / address <span className="text-muted-foreground">Optional</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      onChange={handleFieldChange(field.onChange)}
                      id="contract-location-address"
                      placeholder="Office, site, or street address"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "contract-location-address-error" : undefined}
                    />
                    {fieldState.invalid && (
                      <FieldError id="contract-location-address-error" errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="gemReference"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-gemReference">
                      GeM reference number
                    </FieldLabel>
                    <Input
                      {...field}
                      onChange={handleFieldChange(field.onChange)}
                      id="contract-gemReference"
                      placeholder="Enter reference number"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "contract-gemReference-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="contract-gemReference-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="status"
                rules={{
                  deps: [
                    "department",
                    "gemReference",
                    "locationState",
                    "locationCity",
                    "value",
                    "startDate",
                    "duration",
                    "required",
                  ],
                }}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-status">
                      Status
                    </FieldLabel>
                    <Select
                      name={field.name}
                      items={statusOptions}
                      value={field.value}
                      onValueChange={handleFieldChange(field.onChange)}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="contract-status"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "contract-status-error" : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value ?? "placeholder"} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError id="contract-status-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="value"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-value">
                      Contract value
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>₹</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        onChange={handleFieldChange(field.onChange)}
                        id="contract-value"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "contract-value-error" : undefined}
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError id="contract-value-error" errors={[fieldState.error]} />}
                    <Controller
                      name="includesGst"
                      control={form.control}
                      render={({ field: gstField }) => (
                        <Field orientation="horizontal">
                          <Checkbox
                            ref={gstField.ref}
                            name={gstField.name}
                            id="contract-includes-gst"
                            checked={gstField.value}
                            onCheckedChange={handleFieldChange(gstField.onChange)}
                            onBlur={gstField.onBlur}
                          />
                          <FieldLabel htmlFor="contract-includes-gst" className="font-normal text-muted-foreground">
                            Includes GST
                          </FieldLabel>
                        </Field>
                      )}
                    />
                  </Field>
                )}
              />
              <Controller
                name="workOrderReceivedDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-workOrderReceivedDate">
                      WO received date
                    </FieldLabel>
                    <ContractDatePicker
                      id="contract-workOrderReceivedDate"
                      label="WO received date"
                      name={field.name}
                      value={field.value}
                      onChange={handleFieldChange(field.onChange)}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "contract-workOrderReceivedDate-error" : undefined}
                    />
                    {fieldState.invalid && (
                      <FieldError id="contract-workOrderReceivedDate-error" errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Separator />
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <Controller
                name="startDate"
                rules={{ deps: ["endDate", "duration"] }}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-startDate">
                      Start date
                    </FieldLabel>
                    <ContractDatePicker
                      id="contract-startDate"
                      label="Start date"
                      name={field.name}
                      value={field.value}
                      onChange={handleFieldChange(field.onChange)}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "contract-startDate-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="contract-startDate-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="duration"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-duration">
                      Duration
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        onChange={handleFieldChange(field.onChange)}
                        id="contract-duration"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 12"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "contract-duration-error" : undefined}
                      />
                      <InputGroupAddon align="inline-end" className="py-0 pr-0 has-[>button]:mr-0">
                        <Controller
                          name="durationUnit"
                          rules={{ deps: ["duration"] }}
                          control={form.control}
                          render={({ field: unitField }) => (
                            <Select
                              name={unitField.name}
                              value={unitField.value}
                              onValueChange={handleFieldChange(unitField.onChange)}
                              items={[
                                { value: "days", label: "Days" },
                                { value: "months", label: "Months" },
                                { value: "years", label: "Years" },
                              ]}
                            >
                              <SelectTrigger
                                ref={unitField.ref}
                                onBlur={unitField.onBlur}
                                className="rounded-l-none border-0 border-l"
                                aria-label="Duration unit"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="months">Months</SelectItem>
                                  <SelectItem value="years">Years</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError id="contract-duration-error" errors={[fieldState.error]} />}
                    {scheduledEndDate && (
                      <FieldDescription aria-live="polite">
                        Scheduled to end on {dateFormatter.format(new Date(`${scheduledEndDate}T00:00:00Z`))},
                        inclusive.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="endDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1 @sm/field-group:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-endDate">
                      End date
                    </FieldLabel>
                    <ContractDatePicker
                      id="contract-endDate"
                      label="End date"
                      name={field.name}
                      value={field.value}
                      onChange={handleFieldChange(field.onChange)}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "contract-endDate-error" : undefined}
                      min={startDate}
                      info="Enter the actual date the contract ended, including any extension. Contracts may continue for another 1–2 months until a new tender is awarded. Leave this blank when creating the contract."
                    />
                    {fieldState.invalid && <FieldError id="contract-endDate-error" errors={[fieldState.error]} />}
                    {endDate && !fieldState.invalid && (
                      <FieldDescription aria-live="polite">
                        Contract ended on {dateFormatter.format(new Date(`${endDate}T00:00:00Z`))}.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Separator />
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <Controller
                name="required"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-required">
                      Employees required
                    </FieldLabel>
                    <Input
                      {...field}
                      onChange={handleFieldChange(field.onChange)}
                      id="contract-required"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 20"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid
                          ? "contract-required-error"
                          : hasStaffingSummary
                            ? "contract-staffing-summary"
                            : undefined
                      }
                    />
                    {fieldState.invalid && <FieldError id="contract-required-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="deployed"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="contract-deployed">
                      Employees deployed
                    </FieldLabel>
                    <Input
                      {...field}
                      onChange={handleFieldChange(field.onChange)}
                      id="contract-deployed"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 20"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid
                          ? "contract-deployed-error"
                          : hasStaffingSummary
                            ? "contract-staffing-summary"
                            : undefined
                      }
                    />
                    {fieldState.invalid && <FieldError id="contract-deployed-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {requiredCount !== undefined && deployedCount !== undefined && (
                <FieldDescription
                  id="contract-staffing-summary"
                  className="-mt-3 @sm/field-group:col-span-2"
                  aria-live="polite"
                >
                  {`${deployedCount} of ${requiredCount} deployed · ${deployedCount > requiredCount ? `${deployedCount - requiredCount} above requirement` : `${requiredCount - deployedCount} remaining`}`}
                </FieldDescription>
              )}
            </FieldGroup>
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-normal" htmlFor="contract-notes">
                    Notes <span className="font-normal text-muted-foreground">Optional</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    onChange={handleFieldChange(field.onChange)}
                    id="contract-notes"
                    className="min-h-20"
                    placeholder="Add any additional details…"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? "contract-notes-error" : undefined}
                  />
                  {fieldState.invalid && <FieldError id="contract-notes-error" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {previewTitle && (
              <FieldDescription role="status">
                “{previewTitle}” validated. This preview does not save contracts yet.
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
        <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
          <DrawerClose render={<Button type="button" variant="outline" />}>Cancel</DrawerClose>
          <Button type="submit" form="new-contract-form" disabled={form.formState.isSubmitting}>
            {status === "draft" ? "Save draft" : "Create contract"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

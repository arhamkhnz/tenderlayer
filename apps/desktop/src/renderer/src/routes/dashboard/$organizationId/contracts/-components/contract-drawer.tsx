import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

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
} from "@tenderlayer/ui/components/drawer";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@tenderlayer/ui/components/field";
import { Input } from "@tenderlayer/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@tenderlayer/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { Separator } from "@tenderlayer/ui/components/separator";
import { Textarea } from "@tenderlayer/ui/components/textarea";

import type { ContractRecord, ContractSaveResult } from "@shared/contracts/contracts";
import type { DepartmentRecord } from "@shared/contracts/departments";
import {
  calculateEndDate,
  contractFormSchema,
  getCurrencyFractionDigits,
  type ContractFormValues,
} from "@shared/schemas/contracts";

import { StatePicker } from "../../-components/state-picker";
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
const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

function getFormValues(contract: ContractRecord | undefined): ContractFormValues {
  const currency = contract?.currency ?? "INR";
  const digits = getCurrencyFractionDigits(currency);
  let value = "";
  if (contract?.amount != null) {
    const minorUnits = String(contract.amount).padStart(digits + 1, "0");
    value = digits ? `${minorUnits.slice(0, -digits)}.${minorUnits.slice(-digits)}` : minorUnits;
  }

  return {
    title: contract?.title ?? "",
    department: contract?.departmentId ?? null,
    gemReference: contract?.gemReference ?? "",
    locationState: contract?.locationState ?? "",
    locationCity: contract?.locationCity ?? "",
    locationAddress: contract?.locationAddress ?? "",
    status: contract?.status ?? "draft",
    value,
    currency,
    includesTax: contract?.includesTax ?? false,
    workOrderReceivedDate: contract?.workOrderReceivedDate ?? "",
    startDate: contract?.startDate ?? "",
    duration: contract?.duration?.toString() ?? "",
    durationUnit: contract?.durationUnit ?? "months",
    endDate: contract?.endDate ?? "",
    required: contract?.requiredHeadcount?.toString() ?? "",
    deployed: contract?.deployedHeadcount.toString() ?? "0",
    notes: contract?.notes ?? "",
  };
}

interface ContractDrawerProps {
  open: boolean;
  contract: ContractRecord | undefined;
  departments: DepartmentRecord[];
  onClose: () => void;
  onSave: (values: ContractFormValues) => Promise<ContractSaveResult>;
}

export function ContractDrawer({ open, contract, departments, onClose, onSave }: ContractDrawerProps) {
  const initialValues = getFormValues(contract);
  const departmentOptions = [
    { value: null, label: "Select department" },
    ...departments.map((department) => ({ value: department.id, label: department.name })),
  ];
  if (contract?.departmentId && !departments.some(({ id }) => id === contract.departmentId)) {
    departmentOptions.push({
      value: contract.departmentId,
      label: `${contract.departmentName ?? "Department"} (archived)`,
    });
  }

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    values: initialValues,
  });
  const { errors, isSubmitting } = form.formState;
  const fractionDigits = getCurrencyFractionDigits(initialValues.currency);
  const [status, startDate, duration, durationUnit, endDate] = useWatch({
    control: form.control,
    name: ["status", "startDate", "duration", "durationUnit", "endDate"],
  });
  const drawerLabels = contract
    ? {
        title: "Edit contract",
        description: "Update the contract details, dates, and staffing.",
        submit: "Save changes",
      }
    : {
        title: "New contract",
        description: "Add the contract details, dates, and staffing.",
        submit: status === "draft" ? "Save draft" : "Create contract",
      };
  const scheduledEndDate = calculateEndDate(startDate, duration, durationUnit);

  async function handleSubmit(values: ContractFormValues) {
    try {
      const result = await onSave(values);
      if (result.ok) return;

      for (const [index, { field, message }] of result.fieldErrors.entries()) {
        form.setError(field, { type: "server", message }, { shouldFocus: index === 0 });
      }
      if (result.formError) form.setError("root.server", { type: "server", message: result.formError });
    } catch {
      form.setError("root.server", { message: "Couldn’t save the contract. Please try again." });
    }
  }

  return (
    <Drawer
      swipeDirection="right"
      open={open}
      onOpenChange={(isOpen, eventDetails) => {
        if (isOpen) return;
        if (isSubmitting) eventDetails.cancel();
        else onClose();
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) form.reset(initialValues);
      }}
    >
      <DrawerContent className="w-[calc(100%-1rem)] max-w-lg rounded-xl border border-popover shadow-xl dark:border-border [--drawer-inset:0.5rem] [--drawer-bleed-background:transparent]">
        <DrawerHeader className="border-b px-6 py-5">
          <DrawerTitle className="leading-none font-normal">{drawerLabels.title}</DrawerTitle>
          <DrawerDescription>{drawerLabels.description}</DrawerDescription>
        </DrawerHeader>
        <form
          id="contract-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={() => form.clearErrors("root.server")}
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
                    readOnly={isSubmitting}
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
                      onValueChange={field.onChange}
                      readOnly={isSubmitting}
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
                      onChange={(value) => {
                        if (!isSubmitting) field.onChange(value);
                      }}
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
                      readOnly={isSubmitting}
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
                      readOnly={isSubmitting}
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
                      readOnly={isSubmitting}
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
                      onValueChange={field.onChange}
                      readOnly={isSubmitting}
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
                        <InputGroupText>
                          {initialValues.currency === "INR" ? "₹" : initialValues.currency}
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        readOnly={isSubmitting}
                        id="contract-value"
                        type="number"
                        min="0"
                        step={10 ** -fractionDigits}
                        placeholder={(0).toFixed(fractionDigits)}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "contract-value-error" : undefined}
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError id="contract-value-error" errors={[fieldState.error]} />}
                    <Controller
                      name="includesTax"
                      control={form.control}
                      render={({ field: gstField, fieldState: taxState }) => (
                        <Field orientation="horizontal">
                          <Checkbox
                            ref={gstField.ref}
                            name={gstField.name}
                            id="contract-includes-gst"
                            checked={gstField.value}
                            onCheckedChange={gstField.onChange}
                            onBlur={gstField.onBlur}
                            readOnly={isSubmitting}
                            aria-invalid={taxState.invalid}
                            aria-describedby={taxState.invalid ? "contract-includes-gst-error" : undefined}
                          />
                          <FieldLabel htmlFor="contract-includes-gst" className="font-normal text-muted-foreground">
                            Includes GST
                          </FieldLabel>
                        </Field>
                      )}
                    />
                    {errors.includesTax && (
                      <FieldError id="contract-includes-gst-error" errors={[errors.includesTax]} />
                    )}
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
                      disabled={isSubmitting}
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
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
                      disabled={isSubmitting}
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
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
                        readOnly={isSubmitting}
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
                              onValueChange={unitField.onChange}
                              readOnly={isSubmitting}
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
                                aria-invalid={Boolean(errors.durationUnit)}
                                aria-describedby={errors.durationUnit ? "contract-duration-unit-error" : undefined}
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
                    {errors.durationUnit && (
                      <FieldError id="contract-duration-unit-error" errors={[errors.durationUnit]} />
                    )}
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
                      disabled={isSubmitting}
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={
                        fieldState.invalid ? "contract-endDate-error contract-endDate-help" : "contract-endDate-help"
                      }
                      min={startDate}
                    />
                    {fieldState.invalid && <FieldError id="contract-endDate-error" errors={[fieldState.error]} />}
                    <FieldDescription id="contract-endDate-help">
                      Leave blank until the contract ends. Include any extensions in the end date.
                    </FieldDescription>
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
                      readOnly={isSubmitting}
                      id="contract-required"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 20"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "contract-required-error" : undefined}
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
                      readOnly={isSubmitting}
                      id="contract-deployed"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 20"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "contract-deployed-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="contract-deployed-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
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
                    readOnly={isSubmitting}
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
            {errors.root?.server && <FieldError>{errors.root.server.message}</FieldError>}
          </FieldGroup>
        </form>
        <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
          <DrawerClose render={<Button type="button" variant="outline" />} disabled={isSubmitting}>
            Cancel
          </DrawerClose>
          <Button type="submit" form="contract-form" disabled={isSubmitting}>
            {drawerLabels.submit}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { useEffect, useRef, useState, type ChangeEvent, type ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";

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
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@tenderlayer/ui/components/field";
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

import type { ContractRecord } from "@shared/contracts/contracts";
import type { EmployeeEditorRecord, EmployeeSaveResult } from "@shared/contracts/employees";
import {
  employeeBankFields,
  employeeEmploymentTypes,
  employeeFormSchema,
  employeeStatuses,
  type EmployeeFormValues,
} from "@shared/schemas/employees";

import { StatePicker } from "../../-components/state-picker";
import { ContractDatePicker } from "../../contracts/-components/contract-date-picker";
import { employeeStatusDisplay, employmentTypeLabels } from "./employee-display";

const employmentTypes = employeeEmploymentTypes.map((value) => ({ value, label: employmentTypeLabels[value] }));
const statuses = employeeStatuses.map((value) => ({ value, label: employeeStatusDisplay[value].label }));

type TextFieldName = Exclude<
  keyof EmployeeFormValues,
  | "contractId"
  | "employmentType"
  | "joiningDate"
  | "status"
  | "monthlyPay"
  | "currency"
  | "useContractLocation"
  | "workState"
  | "workCity"
>;

function EmployeeTextField({
  control,
  name,
  label,
  placeholder,
  type,
  inputMode,
  autoComplete,
  fullWidth = false,
  uppercase = false,
  multiline = false,
  required = false,
}: {
  control: Control<EmployeeFormValues>;
  name: TextFieldName;
  label: string;
  placeholder?: string;
  type?: ComponentProps<typeof Input>["type"];
  inputMode?: ComponentProps<typeof Input>["inputMode"];
  autoComplete?: string;
  fullWidth?: boolean;
  uppercase?: boolean;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        deps: employeeBankFields.includes(name as (typeof employeeBankFields)[number])
          ? employeeBankFields.filter((item) => item !== name)
          : undefined,
      }}
      render={({ field, fieldState }) => {
        const props = {
          ...field,
          id: `employee-${name}`,
          placeholder,
          autoComplete,
          required,
          "aria-invalid": fieldState.invalid,
          "aria-describedby": fieldState.invalid ? `employee-${name}-error` : undefined,
          onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            field.onChange(uppercase ? event.target.value.toUpperCase() : event);
          },
        };
        return (
          <Field className={cn("gap-1", fullWidth && "@sm/field-group:col-span-2")} data-invalid={fieldState.invalid}>
            <FieldLabel className="font-normal" htmlFor={props.id}>
              {label}
            </FieldLabel>
            {multiline ? (
              <Textarea {...props} className="min-h-20" />
            ) : (
              <Input {...props} type={type} inputMode={inputMode} />
            )}
            {fieldState.invalid && <FieldError id={`employee-${name}-error`} errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

const newEmployeeValues: EmployeeFormValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  contractId: "",
  jobTitle: "",
  employmentType: "full-time",
  joiningDate: "",
  workState: "",
  workCity: "",
  siteLocation: "",
  useContractLocation: true,
  status: "active",
  monthlyPay: "",
  currency: "INR",
  pan: "",
  uan: "",
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  notes: "",
};

export function EmployeeDrawer({
  open,
  employee,
  contracts,
  onClose,
  onSave,
}: {
  open: boolean;
  employee?: EmployeeEditorRecord;
  contracts: ContractRecord[];
  onClose: () => void;
  onSave: (values: EmployeeFormValues) => Promise<EmployeeSaveResult>;
}) {
  const initialValues = employee?.values ?? newEmployeeValues;
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    values: initialValues,
  });
  const { errors, isSubmitting } = form.formState;
  const { setFocus } = form;
  const [isSaving, setIsSaving] = useState(false);
  const fieldToFocus = useRef<keyof EmployeeFormValues>(undefined);
  const [contractId, inheritLocation] = useWatch({
    control: form.control,
    name: ["contractId", "useContractLocation"],
  });
  const useContractLocation = Boolean(contractId && inheritLocation);
  const selectedContract = contracts.find((contract) => contract.id === contractId);
  const contractOptions = [
    { value: "", title: "No contract", location: null },
    ...contracts.map(({ id, title, locationCity, locationState, locationAddress }) => ({
      value: id,
      title,
      location: [locationCity, locationState].filter(Boolean).join(", ") || locationAddress,
    })),
  ];
  const savedContractId = employee?.values.contractId;
  if (savedContractId && !contracts.some(({ id }) => id === savedContractId)) {
    contractOptions.push({ value: savedContractId, title: "Unavailable contract", location: null });
  }
  const contractItems = contractOptions.map(({ value, title, location }) => ({
    value,
    label: location ? `${title} · ${location}` : title,
  }));

  useEffect(() => {
    if (isSaving || !fieldToFocus.current) return;
    setFocus(fieldToFocus.current);
    fieldToFocus.current = undefined;
  }, [isSaving, setFocus]);

  async function handleSubmit(values: EmployeeFormValues) {
    setIsSaving(true);
    try {
      const result = await onSave(values);
      if (result.ok) return;

      fieldToFocus.current = result.fieldErrors[0]?.field;
      for (const { field, message } of result.fieldErrors) {
        form.setError(field, { type: "server", message });
      }
      if (result.formError) form.setError("root.server", { message: result.formError });
    } catch {
      form.setError("root.server", { message: "Couldn’t save the employee. Please try again." });
    } finally {
      setIsSaving(false);
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
          <DrawerTitle className="leading-none font-normal">{employee ? "Edit employee" : "New employee"}</DrawerTitle>
          <DrawerDescription>
            {employee ? `Update employee ${employee.code}.` : "Add personal, assignment, and payroll details."}
          </DrawerDescription>
        </DrawerHeader>
        <form
          id="employee-form"
          className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={() => form.clearErrors("root.server")}
        >
          <FieldSet disabled={isSaving} className="@container/field-group min-w-0">
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <EmployeeTextField
                control={form.control}
                name="name"
                label="Full name"
                placeholder="e.g. Ananya Sharma"
                autoComplete="name"
                fullWidth
                required
              />
              <EmployeeTextField
                control={form.control}
                name="phone"
                label="Contact number"
                placeholder="e.g. +91 98765 43210"
                type="tel"
                autoComplete="tel"
                required
              />
              <EmployeeTextField
                control={form.control}
                name="email"
                label="Email"
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
                fullWidth
              />
              <EmployeeTextField
                control={form.control}
                name="address"
                label="Residential address"
                placeholder="House, street, city, state, and PIN code"
                autoComplete="street-address"
                multiline
                fullWidth
              />
            </FieldGroup>
            <Separator />
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <Controller
                name="contractId"
                control={form.control}
                rules={{ deps: ["workState", "workCity", "siteLocation"] }}
                render={({ field, fieldState }) => (
                  <Field className="gap-1 @sm/field-group:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-contract">
                      Contract <span className="text-muted-foreground">Optional</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      items={contractItems}
                      disabled={isSaving}
                      onValueChange={(value) => field.onChange(value ?? "")}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="employee-contract"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "employee-contract-error" : undefined}
                      >
                        <SelectValue className="min-w-0">
                          <span className="truncate">
                            {contractItems.find(({ value }) => value === field.value)?.label}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {contractOptions.map(({ value, title, location }) => (
                            <SelectItem
                              key={value}
                              value={value}
                              label={title}
                              className="[&>span:first-child]:min-w-0"
                            >
                              <span className="flex min-w-0 flex-col gap-0.5">
                                <span className="truncate">{title}</span>
                                {location && <span className="truncate text-xs text-muted-foreground">{location}</span>}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError id="employee-contract-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 @sm/field-group:col-span-2">
                <h3 className="text-sm font-medium">Work location</h3>
                {contractId && (
                  <Controller
                    name="useContractLocation"
                    control={form.control}
                    rules={{ deps: ["workState", "workCity", "siteLocation"] }}
                    render={({ field }) => (
                      <Field orientation="horizontal" className="w-auto">
                        <Checkbox
                          id="employee-use-contract-location"
                          name={field.name}
                          ref={field.ref}
                          checked={field.value}
                          disabled={isSaving}
                          onCheckedChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                        <FieldLabel className="font-normal" htmlFor="employee-use-contract-location">
                          Use contract location
                        </FieldLabel>
                      </Field>
                    )}
                  />
                )}
              </div>
              <Controller
                name="workState"
                control={form.control}
                rules={{ deps: ["workCity"] }}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-work-state">
                      Work state / UT
                    </FieldLabel>
                    <StatePicker
                      id="employee-work-state"
                      name={field.name}
                      value={useContractLocation ? (selectedContract?.locationState ?? "") : field.value}
                      readOnly={useContractLocation}
                      onChange={(value) => {
                        if (!isSaving) field.onChange(value);
                      }}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "employee-work-state-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="employee-work-state-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="workCity"
                control={form.control}
                rules={{ deps: ["workState"] }}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-work-city">
                      Work city / town
                    </FieldLabel>
                    <Input
                      {...field}
                      id="employee-work-city"
                      value={useContractLocation ? (selectedContract?.locationCity ?? "") : field.value}
                      readOnly={useContractLocation}
                      onChange={field.onChange}
                      placeholder={useContractLocation ? "From contract" : "e.g. Pune"}
                      autoComplete="address-level2"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "employee-work-city-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="employee-work-city-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="siteLocation"
                control={form.control}
                rules={{ deps: ["workState", "workCity"] }}
                render={({ field, fieldState }) => (
                  <Field className="gap-1 @sm/field-group:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-site-location">
                      Work site / address <span className="text-muted-foreground">Optional</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="employee-site-location"
                      value={useContractLocation ? (selectedContract?.locationAddress ?? "") : field.value}
                      readOnly={useContractLocation}
                      onChange={field.onChange}
                      placeholder={useContractLocation ? "Contract site / address" : "Office, site, or street address"}
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? "employee-site-location-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="employee-site-location-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <EmployeeTextField
                control={form.control}
                name="jobTitle"
                label="Job title"
                placeholder="e.g. Site supervisor"
                autoComplete="organization-title"
                required
              />
              <Controller
                name="employmentType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-employment-type">
                      Employment type
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      items={employmentTypes}
                      disabled={isSaving}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="employee-employment-type"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {employmentTypes.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="joiningDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-joining">
                      Company joining date
                    </FieldLabel>
                    <ContractDatePicker
                      id="employee-joining"
                      label="Company joining date"
                      name={field.name}
                      value={field.value}
                      onChange={(value) => {
                        if (!isSaving) field.onChange(value);
                      }}
                      disabled={isSaving}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "employee-joining-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="employee-joining-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-status">
                      Status
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      items={statuses}
                      disabled={isSaving}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="employee-status"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {statuses.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="monthlyPay"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-monthly-pay">
                      Monthly wage
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>
                          {initialValues.currency === "INR" ? "₹" : initialValues.currency}
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        onChange={field.onChange}
                        id="employee-monthly-pay"
                        inputMode="decimal"
                        placeholder="0.00"
                        required
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "employee-monthly-pay-error" : undefined}
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError id="employee-monthly-pay-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Separator />
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <EmployeeTextField
                control={form.control}
                name="pan"
                label="PAN"
                placeholder="ABCDE1234F"
                autoComplete="off"
                uppercase
              />
              <EmployeeTextField
                control={form.control}
                name="uan"
                label="UAN"
                placeholder="12-digit UAN"
                inputMode="numeric"
                autoComplete="off"
              />
            </FieldGroup>
            <Separator />
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <EmployeeTextField
                control={form.control}
                name="accountHolder"
                label="Account holder name"
                placeholder="Name as per bank records"
                fullWidth
              />
              <EmployeeTextField
                control={form.control}
                name="bankName"
                label="Bank name"
                placeholder="e.g. State Bank of India"
              />
              <EmployeeTextField
                control={form.control}
                name="ifsc"
                label="IFSC"
                placeholder="e.g. SBIN0001234"
                autoComplete="off"
                uppercase
              />
              <EmployeeTextField
                control={form.control}
                name="accountNumber"
                label="Account number"
                placeholder="Bank account number"
                inputMode="numeric"
                autoComplete="off"
                fullWidth
              />
            </FieldGroup>
            <EmployeeTextField
              control={form.control}
              name="notes"
              label="Notes"
              placeholder="Additional employee details…"
              multiline
            />
            {errors.root?.server && <FieldError>{errors.root.server.message}</FieldError>}
          </FieldSet>
        </form>
        <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
          <DrawerClose render={<Button type="button" variant="outline" />} disabled={isSubmitting}>
            Cancel
          </DrawerClose>
          <Button type="submit" form="employee-form" disabled={isSubmitting}>
            {employee ? "Save changes" : "Create employee"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

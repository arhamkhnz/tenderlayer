import { PlusIcon } from "@keyline-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "cn";
import { useState, type ComponentProps, type ChangeEvent } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { z } from "zod";

import { Button } from "@tenderlayer/ui/components/button";
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

import { contracts } from "../../contracts/-components/data";
import { ContractDatePicker } from "../../contracts/-components/contract-date-picker";
import { departments } from "../../departments/-components/data";
import { employees } from "./data";

const departmentOptions = [
  { value: "", label: "Select department" },
  ...departments.map((department) => ({ value: department.id, label: department.name })),
];
const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "contractual", label: "Contractual" },
  { value: "temporary", label: "Temporary" },
  { value: "part-time", label: "Part-time" },
];
const statuses = [
  { value: "active", label: "Active" },
  { value: "on-leave", label: "On leave" },
  { value: "inactive", label: "Inactive" },
];
const bankFields = ["accountHolder", "bankName", "accountNumber", "ifsc"] as const;

const nextSequence =
  Math.max(0, ...employees.map((employee) => Number(/^EMP-(\d+)$/.exec(employee.code)?.[1] ?? 0))) + 1;
// The backend must reserve the final sequence atomically when persistence is added.
const nextEmployeeCode = `EMP-${String(nextSequence).padStart(3, "0")}`;
const optionalPattern = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => !value || pattern.test(value), message);
const phonePattern = /^\+?\d{10,15}$/;
const phoneNumber = z
  .string()
  .trim()
  .refine(
    (value) => phonePattern.test(value.replace(/[\s()-]/g, "")),
    "Enter a valid contact number, including the country code if needed.",
  );

const employeeFormSchema = z
  .object({
    name: z.string().trim().min(1, "Enter the employee's name."),
    code: z.string().regex(/^EMP-\d+$/, "Enter a valid employee code."),
    phone: phoneNumber,
    email: z
      .string()
      .trim()
      .pipe(z.union([z.literal(""), z.email("Enter a valid email address.")])),
    address: z.string().trim(),
    departmentId: z
      .string()
      .refine(
        (value) => !value || departments.some((department) => department.id === value),
        "Select a valid department.",
      ),
    contractId: z.string(),
    jobTitle: z.string().trim().min(1, "Enter a job title."),
    employmentType: z.enum(["full-time", "contractual", "temporary", "part-time"]),
    joiningDate: z.iso.date("Choose the company joining date."),
    monthlyPay: z
      .string()
      .trim()
      .min(1, "Enter the monthly wage.")
      .refine(
        (value) => /^\d+(\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) && Number(value) > 0,
        "Enter a monthly wage greater than zero, with up to two decimal places.",
      ),
    siteLocation: z.string().trim(),
    status: z.enum(["active", "on-leave", "inactive"]),
    pan: optionalPattern(/^[A-Z]{5}\d{4}[A-Z]$/, "Enter a PAN in the format ABCDE1234F."),
    uan: optionalPattern(/^\d{12}$/, "UAN must contain 12 digits."),
    accountHolder: z.string().trim(),
    bankName: z.string().trim(),
    accountNumber: optionalPattern(/^\d+$/, "Use digits only for the account number."),
    ifsc: optionalPattern(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter an IFSC in the format SBIN0001234."),
    notes: z.string().trim(),
  })
  .superRefine((values, context) => {
    if (values.contractId) {
      const contract = contracts.find((item) => item.id === values.contractId);
      if (!contract || contract.departmentId !== values.departmentId) {
        context.addIssue({
          code: "custom",
          path: ["contractId"],
          message: "Choose a contract under the selected department.",
        });
      }
      if (!values.siteLocation) {
        context.addIssue({ code: "custom", path: ["siteLocation"], message: "Enter the employee's assigned site." });
      }
    }
    if (bankFields.some((name) => Boolean(values[name]))) {
      for (const [name, message] of [
        ["accountHolder", "Enter the account holder's name."],
        ["accountNumber", "Enter the bank account number."],
        ["ifsc", "Enter the bank's IFSC."],
      ] as const) {
        if (!values[name]) context.addIssue({ code: "custom", path: [name], message });
      }
    }
  });

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
type TextFieldName = Exclude<
  keyof EmployeeFormValues,
  "departmentId" | "contractId" | "employmentType" | "joiningDate" | "status" | "monthlyPay"
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
  readOnly = false,
  uppercase = false,
  multiline = false,
  required = false,
  onEdited,
}: {
  control: Control<EmployeeFormValues>;
  name: TextFieldName;
  label: string;
  placeholder?: string;
  type?: ComponentProps<typeof Input>["type"];
  inputMode?: ComponentProps<typeof Input>["inputMode"];
  autoComplete?: string;
  fullWidth?: boolean;
  readOnly?: boolean;
  uppercase?: boolean;
  multiline?: boolean;
  required?: boolean;
  onEdited: () => void;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        deps: bankFields.includes(name as (typeof bankFields)[number])
          ? bankFields.filter((item) => item !== name)
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
            onEdited();
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
              <Input
                {...props}
                type={type}
                inputMode={inputMode}
                readOnly={readOnly}
                className={cn(readOnly && "font-mono")}
              />
            )}
            {fieldState.invalid && <FieldError id={`employee-${name}-error`} errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

export function NewEmployeeDrawer({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const navigate = useNavigate();
  const [previewName, setPreviewName] = useState<string | null>(null);
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      code: nextEmployeeCode,
      phone: "",
      email: "",
      address: "",
      departmentId: "",
      contractId: "",
      jobTitle: "",
      employmentType: "full-time",
      joiningDate: "",
      siteLocation: "",
      status: "active",
      monthlyPay: "",
      pan: "",
      uan: "",
      accountHolder: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
      notes: "",
    },
  });
  const departmentId = useWatch({ control: form.control, name: "departmentId" });
  const contractOptions = [
    { value: "", label: departmentId ? "Select contract" : "Select a department first" },
    ...contracts
      .filter((contract) => contract.departmentId === departmentId)
      .map((contract) => ({ value: contract.id, label: contract.name })),
  ];
  const textProps = { control: form.control, onEdited: () => setPreviewName(null) };

  function changeValue(onChange: (value: unknown) => void) {
    return (value: unknown) => {
      setPreviewName(null);
      onChange(value);
    };
  }

  return (
    <Drawer
      swipeDirection="right"
      defaultOpen={defaultOpen}
      onOpenChangeComplete={(open) => {
        if (!open && defaultOpen) void navigate({ to: "/dashboard/employees", replace: true });
      }}
    >
      <DrawerTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Add employee
      </DrawerTrigger>
      <DrawerContent className="w-[calc(100%-1rem)] max-w-lg rounded-xl border border-popover shadow-xl dark:border-border [--drawer-inset:0.5rem] [--drawer-bleed-background:transparent]">
        <DrawerHeader className="border-b px-6 py-5">
          <DrawerTitle className="leading-none font-normal">New employee</DrawerTitle>
          <DrawerDescription>Add personal, assignment, and payroll details.</DrawerDescription>
        </DrawerHeader>
        <form
          id="new-employee-form"
          className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
          noValidate
          onSubmit={form.handleSubmit((values) => setPreviewName(values.name))}
        >
          <FieldGroup className="gap-4">
            <FieldGroup className="grid grid-cols-1 gap-4 @sm/field-group:grid-cols-2">
              <EmployeeTextField
                {...textProps}
                name="name"
                label="Full name"
                placeholder="e.g. Ananya Sharma"
                autoComplete="name"
                fullWidth
                required
              />
              <EmployeeTextField
                {...textProps}
                name="phone"
                label="Contact number"
                placeholder="e.g. +91 98765 43210"
                type="tel"
                autoComplete="tel"
                required
              />
              <EmployeeTextField {...textProps} name="code" label="Employee code" readOnly />
              <EmployeeTextField
                {...textProps}
                name="email"
                label="Email"
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
                fullWidth
              />
              <EmployeeTextField
                {...textProps}
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
                name="departmentId"
                control={form.control}
                rules={{ deps: ["contractId"] }}
                render={({ field, fieldState }) => (
                  <Field className="gap-1 @sm/field-group:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="employee-department">
                      Department
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      items={departmentOptions}
                      onValueChange={(value) => {
                        setPreviewName(null);
                        field.onChange(value ?? "");
                        form.setValue("contractId", "", {
                          shouldDirty: true,
                          shouldValidate: form.formState.isSubmitted,
                        });
                      }}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="employee-department"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "employee-department-error" : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {departmentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError id="employee-department-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="contractId"
                control={form.control}
                rules={{ deps: ["siteLocation"] }}
                render={({ field, fieldState }) => (
                  <Field
                    className="gap-1 @sm/field-group:col-span-2"
                    data-invalid={fieldState.invalid}
                    data-disabled={!departmentId}
                  >
                    <FieldLabel className="font-normal" htmlFor="employee-contract">
                      Contract
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      items={contractOptions}
                      disabled={!departmentId}
                      onValueChange={changeValue(field.onChange)}
                    >
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        id="employee-contract"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? "employee-contract-error" : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {contractOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError id="employee-contract-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <EmployeeTextField
                {...textProps}
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
                      onValueChange={changeValue(field.onChange)}
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
                      onChange={changeValue(field.onChange)}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "employee-joining-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="employee-joining-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <EmployeeTextField
                {...textProps}
                name="siteLocation"
                label="Site location"
                placeholder="e.g. Goa — Naval base"
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
                      onValueChange={changeValue(field.onChange)}
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
                        <InputGroupText>₹</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        onChange={changeValue(field.onChange)}
                        id="employee-monthly-pay"
                        type="number"
                        min="0.01"
                        step="0.01"
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
                {...textProps}
                name="pan"
                label="PAN"
                placeholder="ABCDE1234F"
                autoComplete="off"
                uppercase
              />
              <EmployeeTextField
                {...textProps}
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
                {...textProps}
                name="accountHolder"
                label="Account holder name"
                placeholder="Name as per bank records"
                fullWidth
              />
              <EmployeeTextField
                {...textProps}
                name="bankName"
                label="Bank name"
                placeholder="e.g. State Bank of India"
              />
              <EmployeeTextField
                {...textProps}
                name="ifsc"
                label="IFSC"
                placeholder="e.g. SBIN0001234"
                autoComplete="off"
                uppercase
              />
              <EmployeeTextField
                {...textProps}
                name="accountNumber"
                label="Account number"
                placeholder="Bank account number"
                inputMode="numeric"
                autoComplete="off"
                fullWidth
              />
            </FieldGroup>
            <EmployeeTextField
              {...textProps}
              name="notes"
              label="Notes"
              placeholder="Additional employee details…"
              multiline
            />
            {previewName && (
              <FieldDescription role="status">
                “{previewName}” validated. This preview does not save employees yet.
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
        <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
          <DrawerClose render={<Button type="button" variant="outline" />}>Cancel</DrawerClose>
          <Button type="submit" form="new-employee-form" disabled={form.formState.isSubmitting}>
            Create employee
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

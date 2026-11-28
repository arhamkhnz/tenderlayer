import { useState, type ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@keyline-icons/react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Textarea } from "@tenderlayer/ui/components/textarea";

import { DatePicker } from "../../-components/shared/forms/date-picker";
import { contracts } from "../../contracts/-components/data";
import { departments } from "../../departments/-components/data";
import { formatAmount, paymentStatuses, purchaseCategories } from "./data";

const amount = z
  .string()
  .refine(
    (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a valid, non-negative amount.",
  );
const schema = z.object({
  vendor: z.string().trim().min(1, "Enter the vendor name."),
  gstin: z
    .string()
    .trim()
    .refine((value) => !value || /^[0-9]{2}[A-Z0-9]{13}$/.test(value), "Enter a 15-character GSTIN."),
  invoice: z.string().trim().min(1, "Enter the invoice number."),
  date: z.string().min(1, "Choose the invoice date."),
  description: z.string().trim().min(1, "Describe the items purchased."),
  category: z.string().min(1, "Select a category."),
  department: z.string(),
  contract: z.string(),
  amount: amount.refine((value) => value.trim() !== "" && Number(value) > 0, "Enter the amount before GST."),
  cgst: amount,
  sgst: amount,
  igst: amount,
  status: z.string().min(1, "Select a payment status."),
  notes: z.string().trim(),
});
type PurchaseValues = z.infer<typeof schema>;

export function NewPurchaseDrawer() {
  const form = useForm<PurchaseValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vendor: "",
      gstin: "",
      invoice: "",
      date: "",
      description: "",
      category: "",
      department: "",
      contract: "",
      amount: "",
      cgst: "",
      sgst: "",
      igst: "",
      status: "Unpaid",
      notes: "",
    },
  });
  const values = useWatch({ control: form.control });
  const [validated, setValidated] = useState<string | null>(null);
  const total = [values.amount, values.cgst, values.sgst, values.igst].reduce(
    (sum: number, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0),
    0,
  );
  const availableContracts = contracts.filter(
    (contract) => !values.department || contract.departmentId === values.department,
  );

  function input(name: keyof PurchaseValues, label: string, props: ComponentProps<typeof Input> = {}, money = false) {
    return (
      <Controller
        key={name}
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel className="font-normal" htmlFor={`purchase-${name}`}>
              {label}
            </FieldLabel>
            {money ? (
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  {...props}
                  id={`purchase-${name}`}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `purchase-${name}-error` : undefined}
                />
              </InputGroup>
            ) : (
              <Input
                {...field}
                {...props}
                id={`purchase-${name}`}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `purchase-${name}-error` : undefined}
              />
            )}
            {fieldState.invalid && <FieldError id={`purchase-${name}-error`} errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }

  function select(
    name: keyof PurchaseValues,
    label: string,
    options: { value: string; label: string }[],
    optional = false,
  ) {
    const items = [{ value: "", label: optional ? "Not assigned" : `Select ${label.toLowerCase()}` }, ...options];
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel className="font-normal" htmlFor={`purchase-${name}`}>
              {label}
            </FieldLabel>
            <Select
              items={items}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value ?? "");
                if (name === "department") form.setValue("contract", "", { shouldDirty: true });
                if (name === "contract" && value) {
                  const contract = contracts.find((item) => item.id === value);
                  if (contract) form.setValue("department", contract.departmentId, { shouldDirty: true });
                }
              }}
            >
              <SelectTrigger
                ref={field.ref}
                onBlur={field.onBlur}
                id={`purchase-${name}`}
                className="w-full"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `purchase-${name}-error` : undefined}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError id={`purchase-${name}-error`} errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        New purchase
      </DrawerTrigger>
      <DrawerContent className="w-[calc(100%-1rem)] max-w-xl rounded-xl border border-popover shadow-xl dark:border-border [--drawer-inset:0.5rem] [--drawer-bleed-background:transparent]">
        <DrawerHeader className="border-b px-6 py-5">
          <DrawerTitle className="leading-none font-normal">New purchase</DrawerTitle>
          <DrawerDescription>Record a vendor bill, its taxes, and payment status.</DrawerDescription>
        </DrawerHeader>
        <form
          id="new-purchase-form"
          onSubmit={form.handleSubmit(() => setValidated(JSON.stringify(form.getValues())))}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
          noValidate
        >
          <FieldGroup className="gap-4">
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {input("vendor", "Vendor name", { placeholder: "Enter vendor name", required: true })}
              {input("gstin", "Vendor GSTIN", {
                placeholder: "Optional",
                maxLength: 15,
                autoCapitalize: "characters",
                spellCheck: false,
                onChange: (event) =>
                  form.setValue("gstin", event.target.value.toUpperCase(), {
                    shouldDirty: true,
                    shouldValidate: form.formState.isSubmitted,
                  }),
              })}
              {input("invoice", "Invoice number", { placeholder: "Enter invoice number", required: true })}
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-normal" htmlFor="purchase-date">
                      Invoice date
                    </FieldLabel>
                    <DatePicker
                      id="purchase-date"
                      label="Invoice date"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      triggerRef={field.ref}
                      name={field.name}
                      invalid={fieldState.invalid}
                      describedBy={fieldState.invalid ? "purchase-date-error" : undefined}
                    />
                    {fieldState.invalid && <FieldError id="purchase-date-error" errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            {input("description", "Items / description", {
              placeholder: "e.g. Floor cleaner and housekeeping materials",
              required: true,
            })}
            {select(
              "category",
              "Category",
              purchaseCategories.map((value) => ({ value, label: value })),
            )}
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {select(
                "department",
                "Department",
                departments.map(({ id, name }) => ({ value: id, label: name })),
                true,
              )}
              {select(
                "contract",
                "Contract",
                availableContracts.map(({ id, name }) => ({ value: id, label: name })),
                true,
              )}
            </FieldGroup>
            {input(
              "amount",
              "Amount before GST",
              { type: "number", min: 0, step: "0.01", placeholder: "0.00", required: true },
              true,
            )}
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {input("cgst", "CGST", { type: "number", min: 0, step: "0.01", placeholder: "0.00" }, true)}
              {input("sgst", "SGST", { type: "number", min: 0, step: "0.01", placeholder: "0.00" }, true)}
              {input("igst", "IGST", { type: "number", min: 0, step: "0.01", placeholder: "0.00" }, true)}
            </FieldGroup>
            <div className="flex items-center justify-between gap-4 text-sm" aria-live="polite">
              <span>Total including GST</span>
              <span className="font-mono tabular-nums">{formatAmount(total)}</span>
            </div>
            {select(
              "status",
              "Payment status",
              paymentStatuses.map((value) => ({ value, label: value })),
            )}
            <Field className="gap-1">
              <FieldLabel className="font-normal" htmlFor="purchase-attachment">
                Invoice attachment <span className="text-muted-foreground">Optional</span>
              </FieldLabel>
              <Input
                id="purchase-attachment"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={() => setValidated(null)}
              />
            </Field>
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="purchase-notes">
                    Notes <span className="text-muted-foreground">Optional</span>
                  </FieldLabel>
                  <Textarea {...field} id="purchase-notes" placeholder="Add any additional details…" rows={3} />
                </Field>
              )}
            />
            {validated === JSON.stringify(values) && (
              <FieldDescription role="status">
                Purchase details validated. This preview does not save purchases yet.
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
        <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
          <DrawerClose render={<Button type="button" variant="outline" />}>Cancel</DrawerClose>
          <Button type="submit" form="new-purchase-form" disabled={form.formState.isSubmitting}>
            Create purchase
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

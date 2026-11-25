import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@tenderlayer/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@tenderlayer/ui/components/drawer";
import { Field, FieldError, FieldGroup, FieldLabel } from "@tenderlayer/ui/components/field";
import { Input } from "@tenderlayer/ui/components/input";

import type { DepartmentRecord, DepartmentSaveResult } from "@shared/contracts/departments";
import { createDepartmentSchema } from "@shared/schemas/departments";

const departmentFormSchema = createDepartmentSchema.pick({ name: true, code: true });

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentDrawerProps {
  organizationId: string;
  open: boolean;
  department: DepartmentRecord | undefined;
  onClose: () => void;
  onSaved: () => void;
}

export function DepartmentDrawer({ organizationId, open, department, onClose, onSaved }: DepartmentDrawerProps) {
  const isSaving = useRef(false);

  async function saveDepartment(values: DepartmentFormValues) {
    const input = { ...values, organizationId };
    let result: DepartmentSaveResult;
    isSaving.current = true;
    try {
      result = department
        ? await window.electronAPI.departments.update({ ...input, departmentId: department.id })
        : await window.electronAPI.departments.create(input);
    } finally {
      isSaving.current = false;
    }
    if (result.ok) onSaved();
    return result;
  }

  return (
    <Drawer
      swipeDirection="right"
      open={open}
      onOpenChange={(isOpen, eventDetails) => {
        if (isOpen) return;
        if (isSaving.current) eventDetails.cancel();
        else onClose();
      }}
    >
      <DrawerContent className="w-[calc(100%-1rem)] max-w-lg rounded-xl border border-popover shadow-xl dark:border-border [--drawer-inset:0.5rem] [--drawer-bleed-background:transparent]">
        <DepartmentForm key={department?.id ?? "create"} department={department} onSave={saveDepartment} />
      </DrawerContent>
    </Drawer>
  );
}

function DepartmentForm({
  department,
  onSave,
}: {
  department: DepartmentRecord | undefined;
  onSave: (values: DepartmentFormValues) => Promise<DepartmentSaveResult>;
}) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: department?.name ?? "", code: department?.code ?? "" },
  });
  const { errors, isSubmitting } = form.formState;

  function handleFieldChange(fieldName: keyof DepartmentFormValues, onChange: (value: unknown) => void) {
    return (value: unknown) => {
      form.clearErrors("root.server");
      if (form.getFieldState(fieldName).error?.type === "server") form.clearErrors(fieldName);
      onChange(value);
    };
  }

  async function handleSubmit(values: DepartmentFormValues) {
    try {
      const result = await onSave(values);
      if (result.ok) return;

      for (const [index, { field, message }] of result.fieldErrors.entries()) {
        form.setError(field, { type: "server", message }, { shouldFocus: index === 0 });
      }
      if (result.formError) {
        form.setError("root.server", { type: "server", message: result.formError });
      }
    } catch {
      form.setError("root.server", { message: "Couldn’t save the department. Please try again." });
    }
  }

  return (
    <>
      <DrawerHeader className="border-b px-6 py-5">
        <DrawerTitle className="leading-none font-normal">
          {department ? "Edit department" : "New department"}
        </DrawerTitle>
        <DrawerDescription>
          {department ? "Update the department name or code." : "Add a department to your organization."}
        </DrawerDescription>
      </DrawerHeader>
      <form
        id="department-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
        noValidate
      >
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="font-normal" htmlFor="department-name">
                  Department name
                </FieldLabel>
                <Input
                  {...field}
                  onChange={handleFieldChange("name", field.onChange)}
                  id="department-name"
                  placeholder="e.g. Indian Railways"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "department-name-error" : undefined}
                  readOnly={isSubmitting}
                  required
                />
                {fieldState.invalid && <FieldError id="department-name-error" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="font-normal" htmlFor="department-code">
                  Code <span className="text-muted-foreground">Optional</span>
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={handleFieldChange("code", field.onChange)}
                  id="department-code"
                  placeholder="e.g. IR"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "department-code-error" : undefined}
                  readOnly={isSubmitting}
                />
                {fieldState.invalid && <FieldError id="department-code-error" errors={[fieldState.error]} />}
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
        <Button type="submit" form="department-form" disabled={isSubmitting}>
          {department ? "Save changes" : "Create department"}
        </Button>
      </DrawerFooter>
    </>
  );
}

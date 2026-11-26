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

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentDrawerProps {
  open: boolean;
  department: DepartmentRecord | undefined;
  onClose: () => void;
  onSave: (values: DepartmentFormValues) => Promise<DepartmentSaveResult>;
}

export function DepartmentDrawer({ open, department, onClose, onSave }: DepartmentDrawerProps) {
  const drawerLabels = department
    ? {
        title: "Edit department",
        description: "Update the department name or code.",
        submit: "Save changes",
      }
    : {
        title: "New department",
        description: "Add a department to your organization.",
        submit: "Create department",
      };

  const initialValues = { name: department?.name ?? "", code: department?.code ?? "" };
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    values: initialValues,
  });

  const { errors, isSubmitting } = form.formState;

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
          id="department-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={() => form.clearErrors("root.server")}
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
            {drawerLabels.submit}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

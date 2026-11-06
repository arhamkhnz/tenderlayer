import { PlusIcon } from "@keyline-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

const departmentFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a department name."),
  code: z.string().trim(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export function NewDepartmentDrawer() {
  const [previewName, setPreviewName] = useState<string | null>(null);
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: "", code: "" },
  });

  function handleFieldChange(onChange: (value: unknown) => void) {
    return (value: unknown) => {
      setPreviewName(null);
      onChange(value);
    };
  }

  function handleSubmit(values: DepartmentFormValues) {
    // Match the contract form's preview behavior until persistence is implemented.
    setPreviewName(values.name);
  }

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Add department
      </DrawerTrigger>
      <DrawerContent className="w-[calc(100%-1rem)] max-w-lg rounded-xl border border-popover shadow-xl dark:border-border [--drawer-inset:0.5rem] [--drawer-bleed-background:transparent]">
        <DrawerHeader className="border-b px-6 py-5">
          <DrawerTitle className="leading-none font-normal">New department</DrawerTitle>
          <DrawerDescription>Add a department to your organization.</DrawerDescription>
        </DrawerHeader>
        <form
          id="new-department-form"
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
                    onChange={handleFieldChange(field.onChange)}
                    id="department-name"
                    placeholder="e.g. Indian Railways"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? "department-name-error" : undefined}
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
                    onChange={handleFieldChange(field.onChange)}
                    id="department-code"
                    placeholder="e.g. IR"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? "department-code-error" : undefined}
                  />
                  {fieldState.invalid && <FieldError id="department-code-error" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {previewName && (
              <FieldDescription role="status">
                “{previewName}” validated. This preview does not save departments yet.
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
        <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
          <DrawerClose render={<Button type="button" variant="outline" />}>Cancel</DrawerClose>
          <Button type="submit" form="new-department-form" disabled={form.formState.isSubmitting}>
            Create department
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createOrganizationSchema } from "../../../shared/schemas/organizations";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

const organizationFormSchema = createOrganizationSchema.pick({ name: true });

type OrganizationFormInput = z.input<typeof organizationFormSchema>;
type OrganizationFormValues = z.output<typeof organizationFormSchema>;

function WelcomePage() {
  const navigate = useNavigate();
  const form = useForm<OrganizationFormInput, unknown, OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleSubmit(values: OrganizationFormValues) {
    const result = createOrganizationSchema.safeParse(values);

    if (!result.success) {
      form.setError("name", {
        message: result.error.issues[0]?.message ?? "Enter a valid organization name",
      });
      return;
    }

    try {
      await window.electronAPI.organizations.create(result.data);
      await navigate({ to: "/dashboard" });
    } catch (creationError) {
      const message = creationError instanceof Error ? creationError.message : "";
      form.setError(
        "name",
        {
          type: "server",
          message: message.includes("UNIQUE constraint failed")
            ? "An organization with this name already exists"
            : "Unable to create the organization. Please try again.",
        },
        { shouldFocus: true },
      );
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-4">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-50 [app-region:drag] [-webkit-app-region:drag]"
        style={{ height: "env(titlebar-area-height, 3rem)" }}
      />
      <section aria-labelledby="welcome-title" className="relative flex w-full max-w-md flex-col gap-8 text-foreground">
        <header className="flex flex-col gap-6">
          <h1 id="welcome-title" className="flex flex-col items-start gap-1">
            <span className="leading-5 text-sm text-muted-foreground">Welcome to</span>
            <span className="font-serif text-5xl leading-none font-normal tracking-tight">TenderLayer</span>
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
            Create your organization to manage active tenders, contracts, and day-to-day operations from one local
            workspace.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} data-disabled={form.formState.isSubmitting}>
                    <FieldLabel htmlFor="organization-name">Organization name</FieldLabel>
                    <Input
                      {...field}
                      id="organization-name"
                      placeholder="Acme Services"
                      autoComplete="organization"
                      autoFocus
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid ? "organization-name-error" : "organization-name-description"
                      }
                      disabled={form.formState.isSubmitting}
                      required
                    />
                    {fieldState.invalid ? (
                      <FieldError id="organization-name-error" errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription id="organization-name-description">
                        Use the name shown on your contracts and invoices. You can change it later.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
                {form.formState.isSubmitting ? "Creating..." : "Create organization"}
              </Button>
            </FieldGroup>
          </form>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            Your data is stored locally on this device.
          </p>
        </div>
      </section>
    </main>
  );
}

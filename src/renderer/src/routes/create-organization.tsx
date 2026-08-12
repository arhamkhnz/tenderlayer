import type { FormEvent } from "react";
import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  createOrganizationSchema,
  organizationNameLimits,
  organizationSlugMaxLength,
} from "../../../shared/schemas/organizations";

export const Route = createFileRoute("/create-organization")({
  component: CreateOrganizationPage,
});

function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("organizationName") ?? "");
    const slug = createSlug(name);
    const result = createOrganizationSchema.safeParse({ name, slug });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid organization name");
      return;
    }

    setError(undefined);
    setIsCreating(true);

    try {
      await window.electronAPI.organizations.create(result.data);
      await navigate({ to: "/dashboard" });
    } catch (creationError) {
      const message = creationError instanceof Error ? creationError.message : "";
      setError(
        message.includes("UNIQUE constraint failed")
          ? "An organization with this name already exists"
          : "Unable to create the organization. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section aria-labelledby="organization-title" className="w-full max-w-md text-foreground">
        <header>
          <h1
            id="organization-title"
            className="text-3xl leading-tight font-medium tracking-tight"
          >
            Create organization
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-6 text-muted-foreground">
            Give your workspace a name. You can update it later in organization settings.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-8">
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="organization-name">Organization name</FieldLabel>
              <Input
                id="organization-name"
                name="organizationName"
                placeholder="Acme Services"
                autoComplete="organization"
                autoFocus
                minLength={organizationNameLimits.min}
                maxLength={organizationNameLimits.max}
                aria-invalid={Boolean(error)}
                aria-describedby="organization-name-description organization-name-error"
                disabled={isCreating}
                onChange={() => setError(undefined)}
                required
              />
              <FieldDescription id="organization-name-description">
                This name will appear across contracts, invoices, and reports.
              </FieldDescription>
              <FieldError id="organization-name-error">{error}</FieldError>
            </Field>

            <div className="flex items-center justify-between gap-3">
              <Link to="/welcome" className={buttonVariants({ variant: "outline" })}>
                Back
              </Link>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Spinner data-icon="inline-start" />}
                {isCreating ? "Creating..." : "Create organization"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </section>
    </main>
  );
}

function createSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, organizationSlugMaxLength)
    .replace(/-+$/g, "");

  return slug || "organization";
}

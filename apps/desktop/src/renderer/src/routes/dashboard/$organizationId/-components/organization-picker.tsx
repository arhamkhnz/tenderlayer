import { Link, useLoaderData } from "@tanstack/react-router";

import { buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";

export function OrganizationPicker() {
  const { availableOrganizations } = useLoaderData({ from: "/dashboard" });

  return (
    <main className="grid min-h-svh place-items-center bg-background px-6 py-[max(1.5rem,env(titlebar-area-height,46px))]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle role="heading" aria-level={1}>
            Organization not found
          </CardTitle>
          <CardDescription>Choose an available organization to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {availableOrganizations.map((organization) => (
            <Link
              key={organization.id}
              to="/dashboard/$organizationId"
              params={{ organizationId: organization.id }}
              className={buttonVariants({ variant: "outline" })}
            >
              {organization.name}
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

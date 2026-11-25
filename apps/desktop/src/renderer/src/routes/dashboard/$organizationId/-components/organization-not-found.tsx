import { Link, useLoaderData } from "@tanstack/react-router";

import { buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";

export function OrganizationNotFound() {
  const { availableOrganizations } = useLoaderData({ from: "/dashboard" });

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Organization not found</CardTitle>
          <CardDescription>Choose an available organization to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
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
    </div>
  );
}

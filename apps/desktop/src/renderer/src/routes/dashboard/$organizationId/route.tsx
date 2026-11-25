import { createFileRoute, Link, notFound, useLoaderData } from "@tanstack/react-router";
import { useEffect } from "react";

import { buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { usePreferences } from "@/app/preferences";
import { DashboardLayout } from "./-components/layout";

export const Route = createFileRoute("/dashboard/$organizationId")({
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ parentMatchPromise, params }) => {
      const parentMatch = await parentMatchPromise;
      if (parentMatch.status === "error") throw parentMatch.error;
      if (!parentMatch.loaderData) throw new Error("Organization list is unavailable");

      const { organizations } = parentMatch.loaderData;
      const organization = organizations.find((item) => item.id === params.organizationId);
      if (!organization) throw notFound();
      return { organization, organizations };
    },
  },
  component: OrganizationDashboard,
  notFoundComponent: OrganizationNotFound,
});

function OrganizationDashboard() {
  const { organizationId } = Route.useParams();
  const { lastOpenedOrganizationId, setLastOpenedOrganizationId } = usePreferences();

  useEffect(() => {
    if (organizationId !== lastOpenedOrganizationId) void setLastOpenedOrganizationId(organizationId);
  }, [lastOpenedOrganizationId, organizationId, setLastOpenedOrganizationId]);

  return <DashboardLayout key={organizationId} />;
}

function OrganizationNotFound() {
  const { organizations } = useLoaderData({ from: "/dashboard" });

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Organization not found</CardTitle>
          <CardDescription>Choose an available organization to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {organizations.map((organization) => (
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

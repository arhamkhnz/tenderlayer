import { createFileRoute, Link, notFound, useRouteContext } from "@tanstack/react-router";

import { buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { DashboardLayout } from "./-components/layout";

export const Route = createFileRoute("/dashboard/$organizationId")({
  loader: ({ context, params }) => {
    const organization = context.organizations.find((item) => item.id === params.organizationId);
    if (!organization) throw notFound();
    return { organization, organizations: context.organizations };
  },
  component: OrganizationDashboard,
  notFoundComponent: OrganizationNotFound,
});

function OrganizationDashboard() {
  const { organizationId } = Route.useParams();
  return <DashboardLayout key={organizationId} />;
}

function OrganizationNotFound() {
  const { organizations } = useRouteContext({ from: "/dashboard" });

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

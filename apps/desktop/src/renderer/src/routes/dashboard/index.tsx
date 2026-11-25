import { createFileRoute, Navigate, useLoaderData } from "@tanstack/react-router";

import { usePreferences } from "@/app/preferences";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { availableOrganizations, firstOrganization } = useLoaderData({ from: "/dashboard" });
  const { lastOpenedOrganizationId } = usePreferences();
  const organization = availableOrganizations.find(({ id }) => id === lastOpenedOrganizationId) ?? firstOrganization;

  return <Navigate to="/dashboard/$organizationId" params={{ organizationId: organization.id }} replace />;
}

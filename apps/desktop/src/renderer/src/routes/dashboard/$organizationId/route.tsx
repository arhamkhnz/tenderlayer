import { useEffect } from "react";

import { createFileRoute, notFound } from "@tanstack/react-router";

import { usePreferences } from "@/app/preferences";

import { DashboardLayout } from "./-components/layout";
import { OrganizationPicker } from "./-components/organization-picker";

export const Route = createFileRoute("/dashboard/$organizationId")({
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ parentMatchPromise, params }) => {
      const parentMatch = await parentMatchPromise;
      if (parentMatch.status === "error" || !parentMatch.loaderData) {
        throw parentMatch.error ?? new Error("Organization list is unavailable");
      }

      const { availableOrganizations } = parentMatch.loaderData;
      const activeOrganization = availableOrganizations.find((item) => item.id === params.organizationId);
      if (!activeOrganization) throw notFound();
      return { activeOrganization };
    },
  },
  component: OrganizationDashboard,
  notFoundComponent: OrganizationPicker,
});

function OrganizationDashboard() {
  const { organizationId } = Route.useParams();
  const { lastOpenedOrganizationId, setLastOpenedOrganizationId } = usePreferences();

  useEffect(() => {
    if (organizationId !== lastOpenedOrganizationId) void setLastOpenedOrganizationId(organizationId);
  }, [lastOpenedOrganizationId, organizationId, setLastOpenedOrganizationId]);

  return <DashboardLayout key={organizationId} />;
}

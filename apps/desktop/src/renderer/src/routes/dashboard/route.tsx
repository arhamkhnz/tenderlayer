import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { OrganizationLoadFailure } from "./-components/organization-load-failure";

export const Route = createFileRoute("/dashboard")({
  shouldReload: ({ cause }) => cause === "enter",
  loader: {
    staleReloadMode: "blocking",
    handler: async () => {
      const availableOrganizations = await window.electronAPI.organizations.list();
      const firstOrganization = availableOrganizations[0];
      if (!firstOrganization) throw redirect({ to: "/welcome", replace: true });
      return { availableOrganizations, firstOrganization };
    },
  },
  component: Outlet,
  errorComponent: OrganizationLoadFailure,
});

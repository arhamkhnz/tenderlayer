import { createFileRoute, Navigate, Outlet, redirect, useLocation } from "@tanstack/react-router";

import { usePreferences } from "@/app/preferences";

import { DashboardLoadFailure } from "./-components/dashboard-load-failure";

export const Route = createFileRoute("/dashboard")({
  shouldReload: ({ cause }) => cause === "enter",
  loader: {
    staleReloadMode: "blocking",
    handler: async () => {
      const organizations = await window.electronAPI.organizations.list();
      const firstOrganization = organizations[0];
      if (!firstOrganization) throw redirect({ to: "/welcome", replace: true });
      return { organizations, firstOrganization };
    },
  },
  component: DashboardRoute,
  errorComponent: DashboardLoadFailure,
});

function DashboardRoute() {
  const { organizations, firstOrganization } = Route.useLoaderData();
  const { lastOpenedOrganizationId } = usePreferences();
  const pathname = useLocation({ select: (location) => location.pathname });

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    const organization = organizations.find(({ id }) => id === lastOpenedOrganizationId) ?? firstOrganization;
    return <Navigate to="/dashboard/$organizationId" params={{ organizationId: organization.id }} replace />;
  }

  return <Outlet />;
}

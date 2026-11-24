import { createFileRoute, Navigate, Outlet, redirect, useLocation } from "@tanstack/react-router";
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
  const { firstOrganization } = Route.useLoaderData();
  const pathname = useLocation({ select: (location) => location.pathname });

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return <Navigate to="/dashboard/$organizationId" params={{ organizationId: firstOrganization.id }} replace />;
  }

  return <Outlet />;
}

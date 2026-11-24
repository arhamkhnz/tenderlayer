import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const organizations = await window.electronAPI.organizations.list();
    const firstOrganization = organizations[0];

    if (!firstOrganization) throw redirect({ to: "/welcome", replace: true });

    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      throw redirect({
        to: "/dashboard/$organizationId",
        params: { organizationId: firstOrganization.id },
        replace: true,
      });
    }

    return { organizations };
  },
  component: Outlet,
});

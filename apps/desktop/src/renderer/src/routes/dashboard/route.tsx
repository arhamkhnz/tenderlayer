import { createFileRoute } from "@tanstack/react-router";

import { DashboardLayout } from "./-components/layout";

export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const organizations = await window.electronAPI.organizations.list();
    return { organization: organizations[0] ?? null };
  },
  component: DashboardLayout,
});

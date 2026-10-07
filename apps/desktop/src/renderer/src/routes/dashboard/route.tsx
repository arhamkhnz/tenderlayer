import { createFileRoute } from "@tanstack/react-router";

import { DashboardLayout } from "./-components/layout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

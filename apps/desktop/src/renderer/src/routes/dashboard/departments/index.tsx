import { createFileRoute } from "@tanstack/react-router";

import { DepartmentsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/departments/")({
  component: DepartmentsScreen,
});

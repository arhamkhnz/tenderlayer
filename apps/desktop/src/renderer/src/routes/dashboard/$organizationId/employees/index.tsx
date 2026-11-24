import { createFileRoute } from "@tanstack/react-router";

import { EmployeesScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/employees/")({
  component: EmployeesScreen,
});

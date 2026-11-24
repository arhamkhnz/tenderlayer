import { createFileRoute } from "@tanstack/react-router";

import { EmployeeDetailsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/employees/$employeeId")({
  component: EmployeeDetailsScreen,
});

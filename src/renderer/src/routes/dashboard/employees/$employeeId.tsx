import { createFileRoute } from "@tanstack/react-router";

import { EmployeeDetailsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/employees/$employeeId")({
  component: EmployeeDetailsScreen,
});

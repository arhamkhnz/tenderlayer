import { createFileRoute } from "@tanstack/react-router";

import { EmployeesScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/employees/")({
  component: EmployeesPage,
});

function EmployeesPage() {
  return <EmployeesScreen />;
}

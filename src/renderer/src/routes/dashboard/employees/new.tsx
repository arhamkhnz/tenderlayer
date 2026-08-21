import { createFileRoute } from "@tanstack/react-router";

import { NewEmployeeScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/employees/new")({
  component: NewEmployeePage,
});

function NewEmployeePage() {
  return <NewEmployeeScreen />;
}

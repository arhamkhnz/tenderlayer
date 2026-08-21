import { createFileRoute } from "@tanstack/react-router";

import { EmployeeDetailsScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/employees/$employeeId")({
  component: EmployeePage,
});

function EmployeePage() {
  const { employeeId } = Route.useParams();
  return <EmployeeDetailsScreen employeeId={employeeId} />;
}

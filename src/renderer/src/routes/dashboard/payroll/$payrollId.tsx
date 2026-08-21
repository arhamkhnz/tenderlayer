import { createFileRoute } from "@tanstack/react-router";

import { PayrollDetailsScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/payroll/$payrollId")({
  component: PayrollDetailsPage,
});

function PayrollDetailsPage() {
  const { payrollId } = Route.useParams();
  return <PayrollDetailsScreen payrollId={payrollId} />;
}

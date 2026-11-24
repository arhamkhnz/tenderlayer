import { createFileRoute } from "@tanstack/react-router";

import { PayrollDetailsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/payroll/$payrollId")({
  component: PayrollDetailsScreen,
});

import { createFileRoute } from "@tanstack/react-router";

import { PayrollDetailsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/payroll/$payrollId")({
  component: PayrollDetailsScreen,
});

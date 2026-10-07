import { createFileRoute } from "@tanstack/react-router";

import { PayrollScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/payroll/")({
  component: PayrollScreen,
});

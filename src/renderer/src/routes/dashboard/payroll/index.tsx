import { createFileRoute } from "@tanstack/react-router";

import { PayrollScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/payroll/")({
  component: PayrollPage,
});

function PayrollPage() {
  return <PayrollScreen />;
}

import { createFileRoute } from "@tanstack/react-router";

import { NewPayrollScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/payroll/new")({
  component: NewPayrollPage,
});

function NewPayrollPage() {
  return <NewPayrollScreen />;
}

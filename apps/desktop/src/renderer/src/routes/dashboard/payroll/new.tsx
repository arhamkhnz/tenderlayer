import { createFileRoute } from "@tanstack/react-router";

import { NewPayrollScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/payroll/new")({
  component: NewPayrollScreen,
});

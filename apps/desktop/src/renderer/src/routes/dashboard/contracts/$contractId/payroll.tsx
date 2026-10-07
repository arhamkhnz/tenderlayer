import { createFileRoute } from "@tanstack/react-router";

import { ContractPayrollScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/payroll")({
  component: ContractPayrollScreen,
});

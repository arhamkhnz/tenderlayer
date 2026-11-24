import { createFileRoute } from "@tanstack/react-router";

import { ContractPayrollScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/contracts/$contractId/payroll")({
  component: ContractPayrollScreen,
});

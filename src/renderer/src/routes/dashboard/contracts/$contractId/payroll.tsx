import { createFileRoute } from "@tanstack/react-router";

import { ContractPayrollScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/payroll")({
  component: ContractPayrollPage,
});

function ContractPayrollPage() {
  const { contractId } = Route.useParams();
  return <ContractPayrollScreen contractId={contractId} />;
}

import { createFileRoute } from "@tanstack/react-router";

import { ContractEmployeesScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/employees")({
  component: ContractEmployeesPage,
});

function ContractEmployeesPage() {
  const { contractId } = Route.useParams();
  return <ContractEmployeesScreen contractId={contractId} />;
}

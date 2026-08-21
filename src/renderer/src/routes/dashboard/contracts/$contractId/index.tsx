import { createFileRoute } from "@tanstack/react-router";

import { ContractOverviewScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/")({
  component: ContractPage,
});

function ContractPage() {
  const { contractId } = Route.useParams();
  return <ContractOverviewScreen contractId={contractId} />;
}

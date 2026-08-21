import { createFileRoute } from "@tanstack/react-router";

import { ContractActivityScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/activity")({
  component: ContractActivityPage,
});

function ContractActivityPage() {
  const { contractId } = Route.useParams();
  return <ContractActivityScreen contractId={contractId} />;
}

import { createFileRoute } from "@tanstack/react-router";

import { ContractDeadlinesScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/deadlines")({
  component: ContractDeadlinesPage,
});

function ContractDeadlinesPage() {
  const { contractId } = Route.useParams();
  return <ContractDeadlinesScreen contractId={contractId} />;
}

import { createFileRoute } from "@tanstack/react-router";

import { ContractDocumentsScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/documents")({
  component: ContractDocumentsPage,
});

function ContractDocumentsPage() {
  const { contractId } = Route.useParams();
  return <ContractDocumentsScreen contractId={contractId} />;
}

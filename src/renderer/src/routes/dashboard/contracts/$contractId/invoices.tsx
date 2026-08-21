import { createFileRoute } from "@tanstack/react-router";

import { ContractInvoicesScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/invoices")({
  component: ContractInvoicesPage,
});

function ContractInvoicesPage() {
  const { contractId } = Route.useParams();
  return <ContractInvoicesScreen contractId={contractId} />;
}

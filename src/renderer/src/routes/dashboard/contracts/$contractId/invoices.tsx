import { createFileRoute } from "@tanstack/react-router";

import { ContractInvoicesScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/invoices")({
  component: ContractInvoicesScreen,
});

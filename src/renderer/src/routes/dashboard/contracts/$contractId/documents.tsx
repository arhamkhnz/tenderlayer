import { createFileRoute } from "@tanstack/react-router";

import { ContractDocumentsScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/documents")({
  component: ContractDocumentsScreen,
});

import { createFileRoute } from "@tanstack/react-router";

import { ContractOverviewScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/")({
  component: ContractOverviewScreen,
});

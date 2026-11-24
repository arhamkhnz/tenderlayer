import { createFileRoute } from "@tanstack/react-router";

import { ContractOverviewScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/contracts/$contractId/")({
  component: ContractOverviewScreen,
});

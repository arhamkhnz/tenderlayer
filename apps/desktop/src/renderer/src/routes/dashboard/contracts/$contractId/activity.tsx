import { createFileRoute } from "@tanstack/react-router";

import { ContractActivityScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/activity")({
  component: ContractActivityScreen,
});

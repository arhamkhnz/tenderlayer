import { createFileRoute } from "@tanstack/react-router";

import { ContractDeadlinesScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/contracts/$contractId/deadlines")({
  component: ContractDeadlinesScreen,
});

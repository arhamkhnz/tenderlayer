import { createFileRoute } from "@tanstack/react-router";

import { ContractDeadlinesScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/deadlines")({
  component: ContractDeadlinesScreen,
});

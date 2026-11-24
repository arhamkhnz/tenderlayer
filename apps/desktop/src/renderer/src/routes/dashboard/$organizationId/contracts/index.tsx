import { createFileRoute } from "@tanstack/react-router";

import { ContractsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/contracts/")({
  component: ContractsScreen,
});

import { createFileRoute } from "@tanstack/react-router";

import { ContractsScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/contracts/")({
  component: ContractsPage,
});

function ContractsPage() {
  return <ContractsScreen />;
}

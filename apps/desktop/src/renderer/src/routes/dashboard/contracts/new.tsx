import { createFileRoute } from "@tanstack/react-router";

import { ContractsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/contracts/new")({
  component: NewContractRoute,
});

function NewContractRoute() {
  return <ContractsScreen openNewContract />;
}

import { createFileRoute } from "@tanstack/react-router";

import { NewContractScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/contracts/new")({
  component: NewContractPage,
});

function NewContractPage() {
  return <NewContractScreen />;
}

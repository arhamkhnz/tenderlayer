import { createFileRoute } from "@tanstack/react-router";

import { NewContractScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/contracts/new")({
  component: NewContractScreen,
});

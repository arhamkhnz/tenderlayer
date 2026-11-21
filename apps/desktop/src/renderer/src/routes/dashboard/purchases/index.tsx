import { createFileRoute } from "@tanstack/react-router";

import { PurchasesScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/purchases/")({
  component: PurchasesScreen,
});

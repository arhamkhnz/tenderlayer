import { createFileRoute } from "@tanstack/react-router";

import { InvoicesScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/invoices/")({
  component: InvoicesScreen,
});

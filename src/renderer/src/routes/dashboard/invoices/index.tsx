import { createFileRoute } from "@tanstack/react-router";

import { InvoicesScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/invoices/")({
  component: InvoicesPage,
});

function InvoicesPage() {
  return <InvoicesScreen />;
}

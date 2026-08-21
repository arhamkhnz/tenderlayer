import { createFileRoute } from "@tanstack/react-router";

import { NewInvoiceScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/invoices/new")({
  component: NewInvoicePage,
});

function NewInvoicePage() {
  return <NewInvoiceScreen />;
}

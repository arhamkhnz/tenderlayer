import { createFileRoute } from "@tanstack/react-router";

import { InvoiceDetailsScreen } from "./-screens";

export const Route = createFileRoute("/dashboard/invoices/$invoiceId")({
  component: InvoicePage,
});

function InvoicePage() {
  const { invoiceId } = Route.useParams();
  return <InvoiceDetailsScreen invoiceId={invoiceId} />;
}

import { createFileRoute } from "@tanstack/react-router";

import { InvoiceDetailsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/invoices/$invoiceId")({
  component: InvoiceDetailsScreen,
});

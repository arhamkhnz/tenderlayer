import { createFileRoute } from "@tanstack/react-router";

import { InvoiceDetailsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/invoices/$invoiceId")({
  component: InvoiceDetailsScreen,
});

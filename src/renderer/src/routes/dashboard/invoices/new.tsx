import { createFileRoute } from "@tanstack/react-router";

import { NewInvoiceScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/invoices/new")({
  component: NewInvoiceScreen,
});

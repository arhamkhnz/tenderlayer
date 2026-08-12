import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/invoices")({
  component: InvoicesLayout,
});

function InvoicesLayout() {
  return <Outlet />;
}

import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/invoices/")({
  component: InvoicesPage,
});

function InvoicesPage() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <div className="flex gap-2">
          <Link to="/dashboard/invoices/new" className={buttonVariants()}>
            New invoice
          </Link>
          <Link
            to="/dashboard/invoices/$invoiceId"
            params={{ invoiceId: "example-invoice" }}
            className={buttonVariants({ variant: "outline" })}
          >
            Invoice details
          </Link>
        </div>
        <Link to="/dashboard" className={buttonVariants({ variant: "ghost" })}>
          Back
        </Link>
      </div>
    </div>
  );
}

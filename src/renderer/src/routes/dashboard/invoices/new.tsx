import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/invoices/new")({
  component: NewInvoicePage,
});

function NewInvoicePage() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">New invoice</h1>
        <Link to="/dashboard/invoices" className={buttonVariants({ variant: "outline" })}>
          Back
        </Link>
      </div>
    </div>
  );
}

import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/contracts/")({
  component: ContractsPage,
});

function ContractsPage() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <div className="flex gap-2">
          <Link to="/dashboard/contracts/new" className={buttonVariants()}>
            New contract
          </Link>
          <Link
            to="/dashboard/contracts/$contractId"
            params={{ contractId: "example-contract" }}
            className={buttonVariants({ variant: "outline" })}
          >
            Contract details
          </Link>
        </div>
        <Link to="/dashboard" className={buttonVariants({ variant: "ghost" })}>
          Back
        </Link>
      </div>
    </div>
  );
}

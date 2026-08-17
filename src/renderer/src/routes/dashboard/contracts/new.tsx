import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/contracts/new")({
  component: NewContractPage,
});

function NewContractPage() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">New contract</h1>
        <Link to="/dashboard/contracts" className={buttonVariants({ variant: "outline" })}>
          Back
        </Link>
      </div>
    </div>
  );
}

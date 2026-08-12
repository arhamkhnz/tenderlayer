import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/contracts/$contractId/activity")({
  component: ContractActivityPage,
});

function ContractActivityPage() {
  const { contractId } = Route.useParams();
  return <main className="grid min-h-screen place-items-center"><div className="flex flex-col items-center gap-6"><h1 className="text-2xl font-semibold">Contract activity</h1><Link to="/dashboard/contracts/$contractId" params={{ contractId }} className={buttonVariants({ variant: "outline" })}>Back</Link></div></main>;
}

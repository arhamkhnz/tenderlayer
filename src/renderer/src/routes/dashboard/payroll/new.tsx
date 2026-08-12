import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/payroll/new")({
  component: NewPayrollPage,
});

function NewPayrollPage() {
  return <main className="grid min-h-screen place-items-center"><div className="flex flex-col items-center gap-6"><h1 className="text-2xl font-semibold">New payroll run</h1><Link to="/dashboard/payroll" className={buttonVariants({ variant: "outline" })}>Back</Link></div></main>;
}

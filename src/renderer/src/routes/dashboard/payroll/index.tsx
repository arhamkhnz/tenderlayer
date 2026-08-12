import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/payroll/")({
  component: PayrollPage,
});

function PayrollPage() {
  return <div className="grid min-h-screen place-items-center"><div className="flex flex-col items-center gap-6"><h1 className="text-2xl font-semibold">Payroll</h1><div className="flex gap-2"><Link to="/dashboard/payroll/new" className={buttonVariants()}>New payroll run</Link><Link to="/dashboard/payroll/$payrollId" params={{ payrollId: "example-payroll" }} className={buttonVariants({ variant: "outline" })}>Payroll details</Link></div><Link to="/dashboard" className={buttonVariants({ variant: "ghost" })}>Back</Link></div></div>;
}

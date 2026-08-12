import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/employees/")({
  component: EmployeesPage,
});

function EmployeesPage() {
  return <main className="grid min-h-screen place-items-center"><div className="flex flex-col items-center gap-6"><h1 className="text-2xl font-semibold">Employees</h1><div className="flex gap-2"><Link to="/dashboard/employees/new" className={buttonVariants()}>New employee</Link><Link to="/dashboard/employees/$employeeId" params={{ employeeId: "example-employee" }} className={buttonVariants({ variant: "outline" })}>Employee details</Link></div><Link to="/dashboard" className={buttonVariants({ variant: "ghost" })}>Back</Link></div></main>;
}

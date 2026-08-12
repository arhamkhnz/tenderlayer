import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const destinations = [
    { to: "/dashboard/contracts", label: "Contracts" },
    { to: "/dashboard/employees", label: "Employees" },
    { to: "/dashboard/invoices", label: "Invoices" },
    { to: "/dashboard/payroll", label: "Payroll" },
    { to: "/dashboard/settings/organization", label: "Organization settings" },
    { to: "/dashboard/settings/tax", label: "Tax settings" },
  ] as const;

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <nav className="grid w-full grid-cols-2 gap-2">
          {destinations.map((destination) => (
            <Link key={destination.to} to={destination.to} className={buttonVariants({ variant: "outline" })}>
              {destination.label}
            </Link>
          ))}
        </nav>
        <Link to="/create-organization" className={buttonVariants({ variant: "ghost" })}>
          Back
        </Link>
      </div>
    </div>
  );
}

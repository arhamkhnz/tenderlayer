import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/contracts/$contractId/")({
  component: ContractPage,
});

function ContractPage() {
  const { contractId } = Route.useParams();
  const sections = [
    { to: "/dashboard/contracts/$contractId/employees", label: "Employees" },
    { to: "/dashboard/contracts/$contractId/invoices", label: "Invoices" },
    { to: "/dashboard/contracts/$contractId/payroll", label: "Payroll" },
    { to: "/dashboard/contracts/$contractId/documents", label: "Documents" },
    { to: "/dashboard/contracts/$contractId/activity", label: "Activity" },
    { to: "/dashboard/contracts/$contractId/deadlines", label: "Deadlines" },
  ] as const;

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">Contract details</h1>
        <nav className="grid w-full grid-cols-2 gap-2">
          {sections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              params={{ contractId }}
              className={buttonVariants({ variant: "outline" })}
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <Link to="/dashboard/contracts" className={buttonVariants({ variant: "ghost" })}>
          Back
        </Link>
      </div>
    </div>
  );
}

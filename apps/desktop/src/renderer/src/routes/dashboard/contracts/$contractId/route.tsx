import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/contracts/$contractId")({
  component: ContractLayout,
});

function ContractLayout() {
  const { contractId } = Route.useParams();
  const tabs = [
    { label: "Overview", to: "/dashboard/contracts/$contractId" },
    { label: "Employees", to: "/dashboard/contracts/$contractId/employees" },
    { label: "Invoices", to: "/dashboard/contracts/$contractId/invoices" },
    { label: "Payroll", to: "/dashboard/contracts/$contractId/payroll" },
    { label: "Documents", to: "/dashboard/contracts/$contractId/documents" },
    { label: "Activity", to: "/dashboard/contracts/$contractId/activity" },
    { label: "Deadlines", to: "/dashboard/contracts/$contractId/deadlines" },
  ] as const;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            to="/dashboard/contracts"
            className="mb-1 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon />
            Contracts
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Railway signaling maintenance</h1>
            <Badge variant="outline">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">GEM/2026/B/4412081 · Indian Railways</p>
        </div>
        <Button type="button" variant="outline">
          Edit contract
        </Button>
      </div>

      <nav className="scrollbar-none flex overflow-x-auto border-b" aria-label="Contract sections">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            params={{ contractId }}
            activeOptions={{ exact: true }}
            className="shrink-0 border-b-2 px-3 py-2 text-xs"
            activeProps={{ className: "border-foreground font-medium text-foreground" }}
            inactiveProps={{
              className: "border-transparent text-muted-foreground hover:text-foreground",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <Outlet />
    </>
  );
}

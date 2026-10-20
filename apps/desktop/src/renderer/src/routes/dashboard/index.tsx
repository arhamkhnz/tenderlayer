import {
  BanknoteIcon,
  BriefcaseIcon,
  IndianRupeeIcon,
  MoreVerticalIcon,
  FilePlusIcon,
  ReceiptIcon,
  UserPlusIcon,
  UsersIcon,
} from "@keyline-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, buttonVariants } from "@tenderlayer/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";

import { KpiCards } from "./-components/kpi-cards";
import { PeriodFilter } from "./-components/period-filter";
import { BidsWonChart } from "./-components/bids-won-chart";
import { ContractValueByDepartmentChart } from "./-components/contract-value-by-department-chart";
import { PaymentsOverview } from "./-components/payments-overview";
import { FinancialYearChart } from "./-components/financial-year-chart";
import type { ReportingPeriod } from "./-components/reporting-period";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [today] = useState(() => new Date());
  const [period, setPeriod] = useState<ReportingPeriod>("last-12-months");
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tighter leading-none">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Here's your business summary as of {formattedDate}.</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <PeriodFilter value={period} onValueChange={setPeriod} />
          <Link to="/dashboard/contracts/new" className={buttonVariants({ size: "sm" })}>
            <FilePlusIcon data-icon="inline-start" />
            New contract
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" />}
              aria-label="More dashboard actions"
            >
              <MoreVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40 font-450">
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link to="/dashboard/invoices/new" />}>
                  <ReceiptIcon />
                  New invoice
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to="/dashboard/employees/new" />}>
                  <UserPlusIcon />
                  Add employee
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to="/dashboard/payroll/new" />}>
                  <BanknoteIcon />
                  Run payroll
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <KpiCards
        items={[
          {
            label: "Active contracts",
            value: "12",
            icon: BriefcaseIcon,
            to: "/dashboard/contracts",
          },
          {
            label: "Contract value",
            value: "₹18.4L",
            icon: IndianRupeeIcon,
            to: "/dashboard/contracts",
          },
          {
            label: "Employees on contract",
            value: "—",
            icon: UsersIcon,
            to: "/dashboard/employees",
          },
          {
            label: "Outstanding invoices",
            value: "₹7.8L",
            icon: ReceiptIcon,
            to: "/dashboard/invoices",
          },
        ]}
      />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <BidsWonChart today={today} />
        <ContractValueByDepartmentChart />
      </div>
      <FinancialYearChart today={today} />
      <PaymentsOverview today={today} />
    </div>
  );
}

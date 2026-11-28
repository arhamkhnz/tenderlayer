import {
  ArrowLeftIcon,
  BanknoteIcon,
  PlusIcon,
  CalendarIcon,
  BriefcaseIcon,
  UsersIcon,
  IndianRupeeIcon,
  TagIcon,
} from "@keyline-icons/react";
import { Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@tenderlayer/ui/components/field";
import { Input } from "@tenderlayer/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";

import { FinanceStatusBadge } from "../../-components/records/finance-status-badge";
import { RecordsTable, type RecordColumn } from "../../-components/records/records-table";
import { DataCard, KeyValueGrid, PageHeader, StaticTable } from "./payroll-screen-components";

const payrollRuns = [
  {
    id: "PAY-AUG-2026",
    period: "August 2026",
    contracts: "6",
    employees: "38",
    gross: "₹14,82,000",
    deductions: "₹1,24,600",
    status: "Review",
  },
  {
    id: "PAY-JUL-2026",
    period: "July 2026",
    contracts: "6",
    employees: "38",
    gross: "₹14,65,000",
    deductions: "₹1,22,900",
    status: "Paid",
  },
  {
    id: "PAY-JUN-2026",
    period: "June 2026",
    contracts: "5",
    employees: "36",
    gross: "₹13,92,000",
    deductions: "₹1,17,300",
    status: "Paid",
  },
  {
    id: "PAY-MAY-2026",
    period: "May 2026",
    contracts: "5",
    employees: "35",
    gross: "₹13,48,000",
    deductions: "₹1,13,800",
    status: "Paid",
  },
];

const payrollColumns: RecordColumn<(typeof payrollRuns)[number]>[] = [
  {
    id: "period",
    label: "Pay period",
    icon: CalendarIcon,
    numeric: false,
    cell: (record) => (
      <Link
        from="/dashboard/$organizationId"
        to="/dashboard/$organizationId/payroll/$payrollId"
        params={{ payrollId: record.id }}
        className="rounded-sm font-450 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        {record.period}
      </Link>
    ),
  },
  { id: "contracts", label: "Contracts", icon: BriefcaseIcon, numeric: true, cell: (record) => record.contracts },
  { id: "employees", label: "Employees", icon: UsersIcon, numeric: true, cell: (record) => record.employees },
  { id: "gross", label: "Gross pay", icon: IndianRupeeIcon, numeric: true, cell: (record) => record.gross },
  { id: "deductions", label: "Deductions", icon: IndianRupeeIcon, numeric: true, cell: (record) => record.deductions },
  {
    id: "status",
    label: "Status",
    icon: TagIcon,
    numeric: false,
    cell: (record) => <FinanceStatusBadge status={record.status} />,
  },
];

export function PayrollScreen() {
  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background"
    >
      <header className="flex shrink-0 flex-col gap-4 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tighter leading-none">
            Payroll <span className="font-mono text-muted-foreground text-xl leading-none">[{payrollRuns.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">Review monthly employee pay across active contracts.</p>
        </div>
        <Link
          from="/dashboard/$organizationId"
          to="/dashboard/$organizationId/payroll/new"
          className={buttonVariants({ size: "sm" })}
        >
          <BanknoteIcon data-icon="inline-start" />
          New payroll run
        </Link>
      </header>
      <RecordsTable
        records={payrollRuns}
        columns={payrollColumns}
        label="Payroll runs"
        searchText={(record) => Object.values(record).join(" ")}
      />
    </section>
  );
}

export function NewPayrollScreen() {
  return (
    <>
      <PageHeader
        title="New payroll run"
        description="Prepare payroll for a selected period and contract set."
        action={
          <Link
            from="/dashboard/$organizationId"
            to="/dashboard/$organizationId/payroll"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Payroll
          </Link>
        }
      />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Payroll period</CardTitle>
          <CardDescription>Select the period and payment date for this run.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel>Month</FieldLabel>
                <Select defaultValue="august">
                  <SelectTrigger className="w-full" aria-label="Payroll month">
                    <SelectValue className="font-450" />
                  </SelectTrigger>
                  <SelectContent className="font-450">
                    <SelectGroup>
                      <SelectItem value="august">August 2026</SelectItem>
                      <SelectItem value="september">September 2026</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="period-start">Period start</FieldLabel>
                <Input id="period-start" type="date" defaultValue="2026-08-01" />
              </Field>
              <Field>
                <FieldLabel htmlFor="payment-date">Payment date</FieldLabel>
                <Input id="payment-date" type="date" defaultValue="2026-08-31" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <DataCard
        title="Included contracts"
        description="Contracts and employees currently included in this run."
        action={
          <Button type="button" variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add contract
          </Button>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={[
            {
              id: "contract-1",
              contract: "Railway signaling maintenance",
              employees: "18",
              gross: "₹6,84,000",
              deductions: "₹58,400",
              net: "₹6,25,600",
            },
            {
              id: "contract-2",
              contract: "Regional IT support services",
              employees: "9",
              gross: "₹3,42,000",
              deductions: "₹28,900",
              net: "₹3,13,100",
            },
            {
              id: "contract-3",
              contract: "Airport facility staffing",
              employees: "6",
              gross: "₹2,76,000",
              deductions: "₹22,700",
              net: "₹2,53,300",
            },
            {
              id: "contract-4",
              contract: "Municipal fleet maintenance",
              employees: "5",
              gross: "₹1,80,000",
              deductions: "₹14,600",
              net: "₹1,65,400",
            },
          ]}
          columns={[
            {
              key: "contract",
              label: "Contract",
              render: (value) => <span className="font-medium">{String(value)}</span>,
            },
            { key: "employees", label: "Employees", className: "text-right tabular-nums" },
            { key: "gross", label: "Gross", className: "text-right tabular-nums" },
            { key: "deductions", label: "Deductions", className: "text-right tabular-nums" },
            { key: "net", label: "Net payable", className: "text-right font-medium tabular-nums" },
          ]}
        />
      </DataCard>
      <div className="ml-auto w-full max-w-sm">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Run summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employees</span>
              <span>38</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross pay</span>
              <span>₹14,82,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deductions</span>
              <span>₹1,24,600</span>
            </div>
            <div className="flex justify-between border-t pt-2.5 font-medium">
              <span>Net payable</span>
              <span>₹13,57,400</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end gap-2">
        <Link
          from="/dashboard/$organizationId"
          to="/dashboard/$organizationId/payroll"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
        <Button type="button">Create payroll run</Button>
      </div>
    </>
  );
}

export function PayrollDetailsScreen() {
  const employees = [
    {
      id: "emp-1",
      employee: "Ananya Sharma",
      contract: "Railway signaling maintenance",
      gross: "₹48,000",
      deductions: "₹4,200",
      net: "₹43,800",
      status: "Ready",
    },
    {
      id: "emp-2",
      employee: "Vikram Singh",
      contract: "Railway signaling maintenance",
      gross: "₹36,000",
      deductions: "₹3,100",
      net: "₹32,900",
      status: "Ready",
    },
    {
      id: "emp-3",
      employee: "Kabir Verma",
      contract: "Regional IT support services",
      gross: "₹42,000",
      deductions: "₹3,600",
      net: "₹38,400",
      status: "Review",
    },
    {
      id: "emp-4",
      employee: "Sana Khan",
      contract: "Airport facility staffing",
      gross: "₹39,000",
      deductions: "₹3,300",
      net: "₹35,700",
      status: "Ready",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            from="/dashboard/$organizationId"
            to="/dashboard/$organizationId/payroll"
            className="mb-1 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon />
            Payroll
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl tracking-tighter leading-none">August 2026 payroll</h1>
            <FinanceStatusBadge status="Review" />
          </div>
          <p className="text-sm text-muted-foreground">PAY-AUG-2026 · Payment date 31 August 2026</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Export register
          </Button>
          <Button type="button">Approve payroll</Button>
        </div>
      </div>
      <DataCard title="Payroll summary" description="Totals for the current run.">
        <KeyValueGrid
          items={[
            { label: "Employees", value: "38" },
            { label: "Contracts", value: "6" },
            { label: "Gross pay", value: "₹14,82,000" },
            { label: "Statutory deductions", value: "₹1,24,600" },
            { label: "Net payable", value: "₹13,57,400" },
            { label: "Requires review", value: "3 employees" },
          ]}
        />
      </DataCard>
      <DataCard
        title="Employee payroll"
        description="Pay calculation by employee and contract."
        contentClassName="px-0"
      >
        <StaticTable
          rows={employees}
          columns={[
            {
              key: "employee",
              label: "Employee",
              render: (value) => <span className="font-medium">{String(value)}</span>,
            },
            { key: "contract", label: "Contract" },
            { key: "gross", label: "Gross", className: "text-right tabular-nums" },
            { key: "deductions", label: "Deductions", className: "text-right tabular-nums" },
            { key: "net", label: "Net pay", className: "text-right font-medium tabular-nums" },
            { key: "status", label: "Status", render: (value) => <FinanceStatusBadge status={String(value)} /> },
          ]}
        />
      </DataCard>
    </>
  );
}

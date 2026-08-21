import { ArrowLeftIcon, FilePlusIcon, MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  DataCard,
  KeyValueGrid,
  MetricStrip,
  PageBody,
  PageHeader,
  StaticStatus,
  StaticTable,
} from "../-components/screen";

const contracts = [
  {
    id: "gem-rail-2026",
    name: "Railway signaling maintenance",
    reference: "GEM/2026/B/4412081",
    authority: "Indian Railways",
    status: "Active",
    value: "₹48,60,000",
    endDate: "18 Dec 2026",
  },
  {
    id: "nhai-support-2026",
    name: "Regional IT support services",
    reference: "NHAI/IT/2026/118",
    authority: "NHAI",
    status: "Active",
    value: "₹31,20,000",
    endDate: "02 Nov 2026",
  },
  {
    id: "airport-facility-2026",
    name: "Airport facility staffing",
    reference: "AAI/OPS/2026/084",
    authority: "Airports Authority of India",
    status: "Draft",
    value: "₹22,40,000",
    endDate: "—",
  },
  {
    id: "municipal-fleet-2025",
    name: "Municipal fleet maintenance",
    reference: "MC/TRANS/2025/304",
    authority: "Pune Municipal Corporation",
    status: "Ending soon",
    value: "₹18,75,000",
    endDate: "08 Sep 2026",
  },
  {
    id: "warehouse-security-2025",
    name: "Warehouse security services",
    reference: "CWC/SEC/2025/091",
    authority: "Central Warehousing Corporation",
    status: "Completed",
    value: "₹14,10,000",
    endDate: "30 Jun 2026",
  },
];

export function ContractsScreen() {
  return (
    <PageBody>
      <PageHeader
        title="Contracts"
        description="Track awarded work, delivery periods, assigned teams, and commercial records."
        action={
          <Link to="/dashboard/contracts/new" className={buttonVariants()}>
            <FilePlusIcon data-icon="inline-start" />
            New contract
          </Link>
        }
      />

      <MetricStrip
        items={[
          { label: "Active", value: "12", detail: "₹2.84Cr awarded value" },
          { label: "Ending soon", value: "3", detail: "Within 30 days" },
          { label: "Draft", value: "4", detail: "2 awaiting review" },
          { label: "Completed", value: "28", detail: "Current financial year" },
        ]}
      />

      <DataCard
        title="All contracts"
        description="Static contract records for the selected organization."
        action={
          <div className="relative w-52">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-7" placeholder="Search contracts" />
          </div>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={contracts}
          columns={[
            {
              key: "name",
              label: "Contract",
              render: (value, row) => (
                <div className="flex flex-col">
                  <Link
                    to="/dashboard/contracts/$contractId"
                    params={{ contractId: row.id }}
                    className="font-medium hover:underline"
                  >
                    {String(value)}
                  </Link>
                  <span className="text-xs text-muted-foreground">{row.reference}</span>
                </div>
              ),
            },
            { key: "authority", label: "Authority" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
            { key: "value", label: "Value", className: "text-right tabular-nums" },
            { key: "endDate", label: "Ends", className: "text-right tabular-nums" },
          ]}
        />
      </DataCard>
    </PageBody>
  );
}

export function NewContractScreen() {
  return (
    <PageBody className="max-w-4xl">
      <PageHeader
        title="New contract"
        description="Record the awarded contract and its delivery period."
        action={
          <Link to="/dashboard/contracts" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon data-icon="inline-start" />
            Contracts
          </Link>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Contract information</CardTitle>
          <CardDescription>
            These details appear across employee, invoice, payroll, and compliance records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="contract-title">Contract title</FieldLabel>
                <Input id="contract-title" placeholder="e.g. Regional IT support services" />
              </Field>
              <Field>
                <FieldLabel htmlFor="contract-reference">Contract reference</FieldLabel>
                <Input id="contract-reference" placeholder="GEM/2026/B/0000000" />
              </Field>
              <Field>
                <FieldLabel htmlFor="awarding-authority">Awarding authority</FieldLabel>
                <Input id="awarding-authority" placeholder="Organization or department" />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select defaultValue="draft">
                  <SelectTrigger className="w-full" aria-label="Contract status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="contract-value">Awarded value</FieldLabel>
                <Input id="contract-value" placeholder="₹0.00" />
              </Field>
              <Field>
                <FieldLabel htmlFor="contract-start">Start date</FieldLabel>
                <Input id="contract-start" type="date" />
              </Field>
              <Field>
                <FieldLabel htmlFor="contract-end">End date</FieldLabel>
                <Input id="contract-end" type="date" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="contract-notes">Internal notes</FieldLabel>
                <Textarea id="contract-notes" placeholder="Scope summary, owners, or handover notes" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Link to="/dashboard/contracts" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
        <Button type="button">Create contract</Button>
      </div>
    </PageBody>
  );
}

type ContractTab = "overview" | "employees" | "invoices" | "payroll" | "documents" | "activity" | "deadlines";

function ContractShell({
  contractId,
  active,
  children,
}: {
  contractId: string;
  active: ContractTab;
  children: ReactNode;
}) {
  const tabs = [
    { id: "overview", label: "Overview", to: "/dashboard/contracts/$contractId" },
    { id: "employees", label: "Employees", to: "/dashboard/contracts/$contractId/employees" },
    { id: "invoices", label: "Invoices", to: "/dashboard/contracts/$contractId/invoices" },
    { id: "payroll", label: "Payroll", to: "/dashboard/contracts/$contractId/payroll" },
    { id: "documents", label: "Documents", to: "/dashboard/contracts/$contractId/documents" },
    { id: "activity", label: "Activity", to: "/dashboard/contracts/$contractId/activity" },
    { id: "deadlines", label: "Deadlines", to: "/dashboard/contracts/$contractId/deadlines" },
  ] as const;

  return (
    <PageBody>
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
            key={tab.id}
            to={tab.to}
            params={{ contractId }}
            className={
              active === tab.id
                ? "shrink-0 border-b-2 border-foreground px-3 py-2 text-xs font-medium text-foreground"
                : "shrink-0 border-b-2 border-transparent px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            }
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </PageBody>
  );
}

export function ContractOverviewScreen({ contractId }: { contractId: string }) {
  return (
    <ContractShell contractId={contractId} active="overview">
      <MetricStrip
        items={[
          { label: "Awarded value", value: "₹48.6L", detail: "Excluding taxes" },
          { label: "Employees", value: "18", detail: "16 active assignments" },
          { label: "Invoiced", value: "₹31.2L", detail: "64% of contract value" },
          { label: "Time remaining", value: "119 days", detail: "Ends 18 Dec 2026" },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <DataCard title="Contract details" description="Commercial and delivery information.">
          <KeyValueGrid
            items={[
              { label: "Status", value: "Active" },
              { label: "Start date", value: "19 December 2025" },
              { label: "End date", value: "18 December 2026" },
              { label: "Awarding authority", value: "Indian Railways" },
              { label: "Contract owner", value: "Aarav Mehta" },
              { label: "Billing cycle", value: "Monthly" },
            ]}
          />
        </DataCard>
        <DataCard title="Next deadlines" description="Nearest contract obligations.">
          <div className="flex flex-col divide-y">
            {[
              ["Monthly compliance report", "24 Aug 2026"],
              ["Attendance certification", "31 Aug 2026"],
              ["Invoice submission", "05 Sep 2026"],
            ].map(([label, date]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="font-medium">{label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{date}</span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </ContractShell>
  );
}

const contractEmployees = [
  { id: "emp-001", name: "Ananya Sharma", role: "Site supervisor", start: "19 Dec 2025", status: "Active" },
  { id: "emp-002", name: "Vikram Singh", role: "Signal technician", start: "02 Jan 2026", status: "Active" },
  { id: "emp-003", name: "Rahul Nair", role: "Safety officer", start: "02 Jan 2026", status: "Active" },
  { id: "emp-004", name: "Meera Joshi", role: "Documentation lead", start: "12 Jan 2026", status: "On leave" },
];

export function ContractEmployeesScreen({ contractId }: { contractId: string }) {
  return (
    <ContractShell contractId={contractId} active="employees">
      <DataCard
        title="Assigned employees"
        description="People currently allocated to this contract."
        action={
          <Button type="button" size="sm">
            <PlusIcon data-icon="inline-start" />
            Assign employee
          </Button>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={contractEmployees}
          columns={[
            { key: "name", label: "Employee", render: (value) => <span className="font-medium">{String(value)}</span> },
            { key: "role", label: "Role" },
            { key: "start", label: "Assigned from", className: "tabular-nums" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
          ]}
        />
      </DataCard>
    </ContractShell>
  );
}

export function ContractInvoicesScreen({ contractId }: { contractId: string }) {
  const rows = [
    {
      id: "INV-2026-039",
      invoice: "INV-2026-039",
      period: "July 2026",
      amount: "₹4,05,000",
      status: "Paid",
      due: "10 Aug 2026",
    },
    {
      id: "INV-2026-042",
      invoice: "INV-2026-042",
      period: "August 2026",
      amount: "₹4,05,000",
      status: "Draft",
      due: "10 Sep 2026",
    },
    {
      id: "INV-2026-034",
      invoice: "INV-2026-034",
      period: "June 2026",
      amount: "₹4,05,000",
      status: "Paid",
      due: "10 Jul 2026",
    },
  ];
  return (
    <ContractShell contractId={contractId} active="invoices">
      <DataCard
        title="Contract invoices"
        description="Billing records raised against this award."
        contentClassName="px-0"
      >
        <StaticTable
          rows={rows}
          columns={[
            {
              key: "invoice",
              label: "Invoice",
              render: (value) => <span className="font-medium">{String(value)}</span>,
            },
            { key: "period", label: "Billing period" },
            { key: "amount", label: "Amount", className: "text-right tabular-nums" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
            { key: "due", label: "Due date", className: "text-right tabular-nums" },
          ]}
        />
      </DataCard>
    </ContractShell>
  );
}

export function ContractPayrollScreen({ contractId }: { contractId: string }) {
  const rows = [
    {
      id: "PAY-AUG-2026",
      period: "August 2026",
      employees: "18",
      gross: "₹6,84,000",
      deductions: "₹58,400",
      status: "Review",
    },
    {
      id: "PAY-JUL-2026",
      period: "July 2026",
      employees: "18",
      gross: "₹6,76,000",
      deductions: "₹57,900",
      status: "Paid",
    },
    {
      id: "PAY-JUN-2026",
      period: "June 2026",
      employees: "17",
      gross: "₹6,42,000",
      deductions: "₹54,600",
      status: "Paid",
    },
  ];
  return (
    <ContractShell contractId={contractId} active="payroll">
      <DataCard title="Contract payroll" description="Payroll runs allocated to this contract." contentClassName="px-0">
        <StaticTable
          rows={rows}
          columns={[
            {
              key: "period",
              label: "Pay period",
              render: (value) => <span className="font-medium">{String(value)}</span>,
            },
            { key: "employees", label: "Employees", className: "text-right tabular-nums" },
            { key: "gross", label: "Gross pay", className: "text-right tabular-nums" },
            { key: "deductions", label: "Deductions", className: "text-right tabular-nums" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
          ]}
        />
      </DataCard>
    </ContractShell>
  );
}

export function ContractDocumentsScreen({ contractId }: { contractId: string }) {
  const rows = [
    { id: "doc-1", document: "Letter of award.pdf", category: "Award", updated: "19 Dec 2025", owner: "Aarav Mehta" },
    {
      id: "doc-2",
      document: "Performance security.pdf",
      category: "Security",
      updated: "22 Dec 2025",
      owner: "Finance",
    },
    { id: "doc-3", document: "Scope of work.pdf", category: "Contract", updated: "19 Dec 2025", owner: "Operations" },
    {
      id: "doc-4",
      document: "July compliance report.pdf",
      category: "Compliance",
      updated: "24 Jul 2026",
      owner: "Meera Joshi",
    },
  ];
  return (
    <ContractShell contractId={contractId} active="documents">
      <DataCard
        title="Documents"
        description="Award, compliance, security, and delivery files."
        action={
          <Button type="button" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add document
          </Button>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={rows}
          columns={[
            {
              key: "document",
              label: "Document",
              render: (value) => <span className="font-medium">{String(value)}</span>,
            },
            { key: "category", label: "Category" },
            { key: "owner", label: "Owner" },
            { key: "updated", label: "Last updated", className: "text-right tabular-nums" },
          ]}
        />
      </DataCard>
    </ContractShell>
  );
}

export function ContractActivityScreen({ contractId }: { contractId: string }) {
  const activity = [
    ["Invoice INV-2026-042 created", "Priya Kapoor", "Today, 10:42"],
    ["August payroll moved to review", "Rohan Desai", "Yesterday, 16:18"],
    ["Compliance report uploaded", "Meera Joshi", "19 Aug, 12:06"],
    ["Employee Vikram Singh assigned", "Aarav Mehta", "16 Aug, 09:31"],
  ];
  return (
    <ContractShell contractId={contractId} active="activity">
      <DataCard title="Activity" description="Recent changes recorded against this contract.">
        <div className="flex flex-col divide-y">
          {activity.map(([event, person, time]) => (
            <div
              key={event}
              className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_10rem_8rem] sm:items-center"
            >
              <span className="font-medium">{event}</span>
              <span className="text-muted-foreground">{person}</span>
              <span className="text-right text-xs text-muted-foreground tabular-nums">{time}</span>
            </div>
          ))}
        </div>
      </DataCard>
    </ContractShell>
  );
}

export function ContractDeadlinesScreen({ contractId }: { contractId: string }) {
  const rows = [
    {
      id: "deadline-1",
      item: "Monthly compliance report",
      owner: "Meera Joshi",
      due: "24 Aug 2026",
      status: "In progress",
    },
    {
      id: "deadline-2",
      item: "Attendance certification",
      owner: "Aarav Mehta",
      due: "31 Aug 2026",
      status: "Not started",
    },
    { id: "deadline-3", item: "August invoice submission", owner: "Priya Kapoor", due: "05 Sep 2026", status: "Draft" },
    {
      id: "deadline-4",
      item: "Quarterly performance review",
      owner: "Rohan Desai",
      due: "30 Sep 2026",
      status: "Scheduled",
    },
  ];
  return (
    <ContractShell contractId={contractId} active="deadlines">
      <DataCard
        title="Deadlines"
        description="Upcoming contractual and operational obligations."
        action={
          <Button type="button" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add deadline
          </Button>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={rows}
          columns={[
            {
              key: "item",
              label: "Obligation",
              render: (value) => <span className="font-medium">{String(value)}</span>,
            },
            { key: "owner", label: "Owner" },
            { key: "due", label: "Due date", className: "tabular-nums" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
          ]}
        />
      </DataCard>
    </ContractShell>
  );
}

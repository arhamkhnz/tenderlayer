import { ArrowRightIcon, FilePlusIcon, ReceiptIcon, UserPlusIcon } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";

import { DataCard, MetricStrip, PageBody, PageHeader, StaticStatus, StaticTable } from "./-components/screen";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

const contracts = [
  {
    id: "gem-rail-2026",
    name: "Railway signaling maintenance",
    reference: "GEM/2026/B/4412081",
    status: "Active",
    endDate: "18 Dec 2026",
  },
  {
    id: "nhai-support-2026",
    name: "Regional IT support services",
    reference: "NHAI/IT/2026/118",
    status: "Active",
    endDate: "02 Nov 2026",
  },
  {
    id: "airport-facility-2026",
    name: "Airport facility staffing",
    reference: "AAI/OPS/2026/084",
    status: "Draft",
    endDate: "—",
  },
];

const attentionItems = [
  { title: "Submit September compliance report", context: "Railway signaling maintenance", due: "Due in 3 days" },
  { title: "Review expiring employee documents", context: "4 employee records", due: "Due in 8 days" },
  { title: "Prepare invoice INV-2026-042", context: "Regional IT support services", due: "Due in 12 days" },
];

function DashboardPage() {
  return (
    <PageBody>
      <PageHeader
        title="Overview"
        description="Contracts, deadlines, and work requiring your attention."
        action={
          <Link to="/dashboard/contracts/new" className={buttonVariants()}>
            <FilePlusIcon data-icon="inline-start" />
            New contract
          </Link>
        }
      />

      <MetricStrip
        items={[
          { label: "Active contracts", value: "12", detail: "Across 5 departments" },
          { label: "Ending in 30 days", value: "3", detail: "₹18.4L total value" },
          { label: "Draft contracts", value: "4", detail: "2 awaiting review" },
          { label: "Open invoices", value: "₹7.8L", detail: "6 invoices" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <DataCard
          title="Recent contracts"
          description="The latest contracts added or updated in this workspace."
          action={
            <Link to="/dashboard/contracts" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              View all
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
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
                  <Link
                    to="/dashboard/contracts/$contractId"
                    params={{ contractId: row.id }}
                    className="font-medium hover:underline"
                  >
                    {String(value)}
                  </Link>
                ),
              },
              { key: "reference", label: "Reference", className: "text-muted-foreground" },
              { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
              { key: "endDate", label: "Ends", className: "text-right tabular-nums" },
            ]}
          />
        </DataCard>

        <DataCard title="Needs attention" description="Items with the nearest due dates.">
          <div className="flex flex-col divide-y">
            {attentionItems.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.context}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.due}</span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      <DataCard title="Quick actions" description="Start a common post-award task.">
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/contracts/new" className={buttonVariants({ variant: "outline" })}>
            <FilePlusIcon data-icon="inline-start" />
            Add contract
          </Link>
          <Link to="/dashboard/employees/new" className={buttonVariants({ variant: "outline" })}>
            <UserPlusIcon data-icon="inline-start" />
            Add employee
          </Link>
          <Link to="/dashboard/invoices/new" className={buttonVariants({ variant: "outline" })}>
            <ReceiptIcon data-icon="inline-start" />
            Create invoice
          </Link>
        </div>
      </DataCard>
    </PageBody>
  );
}

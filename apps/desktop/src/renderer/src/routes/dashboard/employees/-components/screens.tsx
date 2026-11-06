import { ArrowLeftIcon } from "@keyline-icons/react";
import { Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback } from "@tenderlayer/ui/components/avatar";
import { Badge } from "@tenderlayer/ui/components/badge";
import { Button } from "@tenderlayer/ui/components/button";
import { EmployeeDataTable } from "./employee-data-table";
import { employees } from "./data";
import { NewEmployeeDrawer } from "./new-employee-drawer";
import { DataCard, KeyValueGrid, StaticStatus, StaticTable } from "../../-components/screen";

export function EmployeesScreen({ openNewEmployee = false }: { openNewEmployee?: boolean } = {}) {
  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background"
    >
      <header className="flex shrink-0 flex-col gap-4 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tighter leading-none">
            Employees <span className="font-mono text-muted-foreground text-xl leading-none">[{employees.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Track employee records, contract assignments, and payroll details.
          </p>
        </div>
        <NewEmployeeDrawer defaultOpen={openNewEmployee} />
      </header>

      <EmployeeDataTable data={employees} />
    </section>
  );
}

export function EmployeeDetailsScreen() {
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar size="lg">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link
              to="/dashboard/employees"
              className="mb-1 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon />
              Employees
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl tracking-tighter leading-none">Ananya Sharma</h1>
              <Badge variant="outline">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">EMP-014 · Site supervisor · Delhi</p>
          </div>
        </div>
        <Button type="button" variant="outline">
          Edit employee
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <DataCard title="Employment details" description="Role, assignment, and employment record.">
            <KeyValueGrid
              items={[
                { label: "Job title", value: "Site supervisor" },
                { label: "Employment type", value: "Full-time" },
                { label: "Joining date", value: "12 August 2024" },
                { label: "Current contract", value: "Railway signaling maintenance" },
                { label: "Work location", value: "Delhi" },
                { label: "Reporting manager", value: "Aarav Mehta" },
              ]}
            />
          </DataCard>
          <DataCard title="Contract history" description="Current and previous assignments." contentClassName="px-0">
            <StaticTable
              rows={[
                {
                  id: "assignment-1",
                  contract: "Railway signaling maintenance",
                  role: "Site supervisor",
                  period: "Dec 2025 – Present",
                  status: "Active",
                },
                {
                  id: "assignment-2",
                  contract: "Warehouse security services",
                  role: "Shift supervisor",
                  period: "Aug 2024 – Nov 2025",
                  status: "Completed",
                },
              ]}
              columns={[
                {
                  key: "contract",
                  label: "Contract",
                  render: (value) => <span className="font-medium">{String(value)}</span>,
                },
                { key: "role", label: "Role" },
                { key: "period", label: "Period" },
                { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
              ]}
            />
          </DataCard>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <DataCard title="Contact" description="Primary contact information.">
            <KeyValueGrid
              items={[
                { label: "Email", value: "ananya.sharma@tenderlayer.in" },
                { label: "Phone", value: "+91 98765 42180" },
                { label: "Emergency contact", value: "+91 98111 08492" },
              ]}
            />
          </DataCard>
          <DataCard title="Documents" description="Employment and statutory records.">
            <div className="flex flex-col divide-y">
              {[
                ["Aadhaar verification", "Verified"],
                ["PAN", "Verified"],
                ["Employment agreement", "Signed"],
                ["Safety certification", "Expires 14 Oct 2026"],
              ].map(([name, status]) => (
                <div key={name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span>{name}</span>
                  <span className="text-xs text-muted-foreground">{status}</span>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      </div>
    </>
  );
}

import { ArrowLeftIcon, MagnifyingGlassIcon, UserPlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const employees = [
  {
    id: "ananya-sharma",
    initials: "AS",
    name: "Ananya Sharma",
    role: "Site supervisor",
    contract: "Railway signaling maintenance",
    location: "Delhi",
    status: "Active",
  },
  {
    id: "vikram-singh",
    initials: "VS",
    name: "Vikram Singh",
    role: "Signal technician",
    contract: "Railway signaling maintenance",
    location: "Lucknow",
    status: "Active",
  },
  {
    id: "meera-joshi",
    initials: "MJ",
    name: "Meera Joshi",
    role: "Documentation lead",
    contract: "Railway signaling maintenance",
    location: "Pune",
    status: "On leave",
  },
  {
    id: "kabir-verma",
    initials: "KV",
    name: "Kabir Verma",
    role: "Support engineer",
    contract: "Regional IT support services",
    location: "Jaipur",
    status: "Active",
  },
  {
    id: "sana-khan",
    initials: "SK",
    name: "Sana Khan",
    role: "Payroll coordinator",
    contract: "Airport facility staffing",
    location: "Mumbai",
    status: "Active",
  },
];

export function EmployeesScreen() {
  return (
    <PageBody>
      <PageHeader
        title="Employees"
        description="Manage employee records and contract assignments."
        action={
          <Link to="/dashboard/employees/new" className={buttonVariants()}>
            <UserPlusIcon data-icon="inline-start" />
            New employee
          </Link>
        }
      />
      <MetricStrip
        items={[
          { label: "Total employees", value: "42", detail: "38 currently active" },
          { label: "Assigned", value: "35", detail: "Across 12 contracts" },
          { label: "Unassigned", value: "3", detail: "Available for allocation" },
          { label: "Documents expiring", value: "4", detail: "Within 30 days" },
        ]}
      />
      <DataCard
        title="Employee directory"
        description="Static workforce records for this organization."
        action={
          <div className="relative w-52">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-7" placeholder="Search employees" />
          </div>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={employees}
          columns={[
            {
              key: "name",
              label: "Employee",
              render: (value, row) => (
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>{row.initials}</AvatarFallback>
                  </Avatar>
                  <Link
                    to="/dashboard/employees/$employeeId"
                    params={{ employeeId: row.id }}
                    className="font-medium hover:underline"
                  >
                    {String(value)}
                  </Link>
                </div>
              ),
            },
            { key: "role", label: "Role" },
            { key: "contract", label: "Current contract" },
            { key: "location", label: "Location" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
          ]}
        />
      </DataCard>
    </PageBody>
  );
}

export function NewEmployeeScreen() {
  return (
    <PageBody className="max-w-4xl">
      <PageHeader
        title="New employee"
        description="Create a workforce record before assigning the employee to a contract."
        action={
          <Link to="/dashboard/employees" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon data-icon="inline-start" />
            Employees
          </Link>
        }
      />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Employee information</CardTitle>
          <CardDescription>Personal, employment, and statutory details used in contract operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="employee-name">Full name</FieldLabel>
                <Input id="employee-name" placeholder="Employee name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="employee-code">Employee code</FieldLabel>
                <Input id="employee-code" placeholder="EMP-000" />
              </Field>
              <Field>
                <FieldLabel htmlFor="employee-email">Email address</FieldLabel>
                <Input id="employee-email" type="email" placeholder="name@company.in" />
              </Field>
              <Field>
                <FieldLabel htmlFor="employee-phone">Phone number</FieldLabel>
                <Input id="employee-phone" placeholder="+91" />
              </Field>
              <Field>
                <FieldLabel htmlFor="employee-role">Job title</FieldLabel>
                <Input id="employee-role" placeholder="e.g. Site supervisor" />
              </Field>
              <Field>
                <FieldLabel>Employment type</FieldLabel>
                <Select defaultValue="full-time">
                  <SelectTrigger className="w-full" aria-label="Employment type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="employee-joining">Joining date</FieldLabel>
                <Input id="employee-joining" type="date" />
              </Field>
              <Field>
                <FieldLabel htmlFor="employee-location">Work location</FieldLabel>
                <Input id="employee-location" placeholder="City or site" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="employee-address">Address</FieldLabel>
                <Textarea id="employee-address" placeholder="Current residential address" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Link to="/dashboard/employees" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
        <Button type="button">Create employee</Button>
      </div>
    </PageBody>
  );
}

export function EmployeeDetailsScreen({ employeeId: _employeeId }: { employeeId: string }) {
  return (
    <PageBody>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
              <h1 className="text-2xl font-semibold tracking-tight">Ananya Sharma</h1>
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
    </PageBody>
  );
}

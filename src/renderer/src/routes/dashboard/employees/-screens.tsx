import {
  ArrowLeftIcon,
  ArrowsDownUpIcon,
  BriefcaseIcon,
  CalendarBlankIcon,
  ColumnsIcon,
  CurrencyInrIcon,
  FloppyDiskIcon,
  FunnelSimpleIcon,
  GearSixIcon,
  IdentificationBadgeIcon,
  ListBulletsIcon,
  PlusIcon,
  UserIcon,
  UserPlusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import {
  DataCard,
  KeyValueGrid,
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
    monthlyPay: "₹68,000",
    joiningDate: "12 Aug 2024",
  },
  {
    id: "vikram-singh",
    initials: "VS",
    name: "Vikram Singh",
    role: "Signal technician",
    contract: "Railway signaling maintenance",
    location: "Lucknow",
    status: "Active",
    monthlyPay: "₹48,000",
    joiningDate: "03 Feb 2025",
  },
  {
    id: "meera-joshi",
    initials: "MJ",
    name: "Meera Joshi",
    role: "Documentation lead",
    contract: "Railway signaling maintenance",
    location: "Pune",
    status: "On leave",
    monthlyPay: "₹62,000",
    joiningDate: "18 Nov 2024",
  },
  {
    id: "kabir-verma",
    initials: "KV",
    name: "Kabir Verma",
    role: "Support engineer",
    contract: "Regional IT support services",
    location: "Jaipur",
    status: "Active",
    monthlyPay: "₹55,000",
    joiningDate: "08 Jan 2026",
  },
  {
    id: "sana-khan",
    initials: "SK",
    name: "Sana Khan",
    role: "Payroll coordinator",
    contract: "Airport facility staffing",
    location: "Mumbai",
    status: "Active",
    monthlyPay: "₹52,000",
    joiningDate: "22 Jul 2025",
  },
];

export function EmployeesScreen() {
  return (
    <section
      className="flex min-h-0 flex-col overflow-hidden bg-background"
      style={{ height: "calc(100vh - env(titlebar-area-height, 3rem))" }}
    >
      <header className="flex min-h-14 items-center justify-between gap-4 border-b px-4">
        <div className="flex items-center gap-2">
          <UsersThreeIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-base font-medium">Employees</h1>
        </div>
        <Link to="/dashboard/employees/new" className={buttonVariants({ variant: "ghost" })}>
          <PlusIcon data-icon="inline-start" />
          Employee
        </Link>
      </header>

      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b px-2 py-2">
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost">
            <FunnelSimpleIcon data-icon="inline-start" />
            Filter (0)
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Add filter">
            <PlusIcon />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1">
          <Button type="button" variant="ghost">
            <ColumnsIcon data-icon="inline-start" />
            Layout
          </Button>
          <Button type="button" variant="ghost">
            <ArrowsDownUpIcon data-icon="inline-start" />
            Sort
          </Button>
          <Button type="button" variant="ghost">
            <GearSixIcon data-icon="inline-start" />
            View settings
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Save view">
            <FloppyDiskIcon />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 [&>[data-slot=table-container]]:h-full">
        <Table className="h-full min-w-[64rem] text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 w-1/5 border-r px-4">
                <span className="flex items-center gap-2">
                  <UserIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  Employee
                </span>
              </TableHead>
              <TableHead className="h-12 w-1/5 border-r px-4">
                <span className="flex items-center gap-2">
                  <IdentificationBadgeIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  Role
                </span>
              </TableHead>
              <TableHead className="h-12 w-1/5 border-r px-4">
                <span className="flex items-center gap-2">
                  <BriefcaseIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  Contract
                </span>
              </TableHead>
              <TableHead className="h-12 w-1/5 border-r px-4">
                <span className="flex items-center gap-2">
                  <CurrencyInrIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  Monthly pay
                </span>
              </TableHead>
              <TableHead className="h-12 w-1/5 px-4">
                <span className="flex items-center gap-2">
                  <CalendarBlankIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  Joining date
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="h-14 border-r px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <AvatarFallback>{employee.initials}</AvatarFallback>
                    </Avatar>
                    <Link
                      to="/dashboard/employees/$employeeId"
                      params={{ employeeId: employee.id }}
                      className="font-medium hover:underline"
                    >
                      {employee.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="h-14 border-r px-4">{employee.role}</TableCell>
                <TableCell className="h-14 max-w-72 truncate border-r px-4">{employee.contract}</TableCell>
                <TableCell className="h-14 border-r px-4 font-mono tabular-nums">{employee.monthlyPay}</TableCell>
                <TableCell className="h-14 px-4 tabular-nums">{employee.joiningDate}</TableCell>
              </TableRow>
            ))}
            <TableRow aria-hidden="true" className="h-full hover:bg-transparent">
              <TableCell colSpan={5} className="p-0" />
            </TableRow>
          </TableBody>
          <TableFooter className="sticky bottom-0">
            <TableRow className="hover:bg-transparent">
              <TableCell className="h-12 border-r px-4">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ListBulletsIcon className="size-4" aria-hidden="true" />
                  Total: 42 employees
                </span>
              </TableCell>
              <TableCell className="h-12 border-r px-4 text-muted-foreground">5 roles</TableCell>
              <TableCell className="h-12 border-r px-4 text-muted-foreground">12 contracts</TableCell>
              <TableCell className="h-12 border-r px-4 font-mono text-muted-foreground tabular-nums">
                ₹23.8L monthly
              </TableCell>
              <TableCell className="h-12 px-4 text-muted-foreground">5 records shown</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}

export function NewEmployeeScreen() {
  return (
    <>
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
    </>
  );
}

export function EmployeeDetailsScreen({ employeeId: _employeeId }: { employeeId: string }) {
  return (
    <>
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
    </>
  );
}

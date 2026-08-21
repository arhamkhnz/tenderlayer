import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, ReceiptIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import {
  DataCard,
  KeyValueGrid,
  MetricStrip,
  PageHeader,
  StaticStatus,
  StaticTable,
} from "../../-components/screen";

const invoices = [
  {
    id: "INV-2026-042",
    invoice: "INV-2026-042",
    contract: "Railway signaling maintenance",
    issued: "21 Aug 2026",
    due: "10 Sep 2026",
    amount: "₹4,05,000",
    status: "Draft",
  },
  {
    id: "INV-2026-041",
    invoice: "INV-2026-041",
    contract: "Regional IT support services",
    issued: "05 Aug 2026",
    due: "20 Aug 2026",
    amount: "₹2,60,000",
    status: "Overdue",
  },
  {
    id: "INV-2026-040",
    invoice: "INV-2026-040",
    contract: "Municipal fleet maintenance",
    issued: "02 Aug 2026",
    due: "17 Aug 2026",
    amount: "₹1,56,250",
    status: "Sent",
  },
  {
    id: "INV-2026-039",
    invoice: "INV-2026-039",
    contract: "Railway signaling maintenance",
    issued: "22 Jul 2026",
    due: "10 Aug 2026",
    amount: "₹4,05,000",
    status: "Paid",
  },
  {
    id: "INV-2026-038",
    invoice: "INV-2026-038",
    contract: "Regional IT support services",
    issued: "05 Jul 2026",
    due: "20 Jul 2026",
    amount: "₹2,60,000",
    status: "Paid",
  },
];

export function InvoicesScreen() {
  return (
    <>
      <PageHeader
        title="Invoices"
        description="Prepare and track invoices raised against awarded contracts."
        action={
          <Link to="/dashboard/invoices/new" className={buttonVariants()}>
            <ReceiptIcon data-icon="inline-start" />
            New invoice
          </Link>
        }
      />
      <MetricStrip
        items={[
          { label: "Outstanding", value: "₹7.8L", detail: "6 open invoices" },
          { label: "Overdue", value: "₹2.6L", detail: "1 invoice" },
          { label: "Draft", value: "₹4.05L", detail: "Ready for review" },
          { label: "Paid this month", value: "₹11.4L", detail: "4 invoices" },
        ]}
      />
      <DataCard
        title="All invoices"
        description="Static billing records for all contracts."
        action={
          <div className="relative w-52">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-7" placeholder="Search invoices" />
          </div>
        }
        contentClassName="px-0"
      >
        <StaticTable
          rows={invoices}
          columns={[
            {
              key: "invoice",
              label: "Invoice",
              render: (value, row) => (
                <Link
                  to="/dashboard/invoices/$invoiceId"
                  params={{ invoiceId: row.id }}
                  className="font-medium hover:underline"
                >
                  {String(value)}
                </Link>
              ),
            },
            { key: "contract", label: "Contract" },
            { key: "issued", label: "Issued", className: "tabular-nums" },
            { key: "due", label: "Due", className: "tabular-nums" },
            { key: "amount", label: "Amount", className: "text-right tabular-nums" },
            { key: "status", label: "Status", render: (value) => <StaticStatus>{String(value)}</StaticStatus> },
          ]}
        />
      </DataCard>
    </>
  );
}

export function NewInvoiceScreen() {
  return (
    <>
      <PageHeader
        title="New invoice"
        description="Prepare an invoice for completed work under a contract."
        action={
          <Link to="/dashboard/invoices" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon data-icon="inline-start" />
            Invoices
          </Link>
        }
      />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Invoice details</CardTitle>
          <CardDescription>Reference, contract, and billing period.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="invoice-number">Invoice number</FieldLabel>
                <Input id="invoice-number" defaultValue="INV-2026-043" />
              </Field>
              <Field>
                <FieldLabel>Contract</FieldLabel>
                <Select defaultValue="railway">
                  <SelectTrigger className="w-full" aria-label="Contract">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="railway">Railway signaling maintenance</SelectItem>
                      <SelectItem value="nhai">Regional IT support services</SelectItem>
                      <SelectItem value="municipal">Municipal fleet maintenance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="billing-period">Billing period</FieldLabel>
                <Input id="billing-period" defaultValue="August 2026" />
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-date">Invoice date</FieldLabel>
                <Input id="invoice-date" type="date" defaultValue="2026-08-21" />
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-due">Due date</FieldLabel>
                <Input id="invoice-due" type="date" defaultValue="2026-09-10" />
              </Field>
              <Field>
                <FieldLabel htmlFor="work-order">Work order reference</FieldLabel>
                <Input id="work-order" defaultValue="GEM/2026/B/4412081" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <DataCard
        title="Line items"
        description="Services and reimbursable amounts included in this invoice."
        action={
          <Button type="button" variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add item
          </Button>
        }
        contentClassName="px-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="w-28 text-right">Quantity</TableHead>
              <TableHead className="w-36 text-right">Rate</TableHead>
              <TableHead className="w-36 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input defaultValue="Monthly signaling maintenance services" />
              </TableCell>
              <TableCell>
                <Input className="text-right" defaultValue="1" />
              </TableCell>
              <TableCell>
                <Input className="text-right" defaultValue="375000" />
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">₹3,75,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Input defaultValue="Approved travel reimbursement" />
              </TableCell>
              <TableCell>
                <Input className="text-right" defaultValue="1" />
              </TableCell>
              <TableCell>
                <Input className="text-right" defaultValue="30000" />
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">₹30,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DataCard>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Payment instructions or supporting information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea defaultValue="Payment is requested within 20 days of invoice receipt." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">₹4,05,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="tabular-nums">₹72,900</span>
            </div>
            <div className="flex justify-between border-t pt-2.5 font-medium">
              <span>Total</span>
              <span className="tabular-nums">₹4,77,900</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end gap-2">
        <Link to="/dashboard/invoices" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
        <Button type="button" variant="outline">
          Save draft
        </Button>
        <Button type="button">Create invoice</Button>
      </div>
    </>
  );
}

export function InvoiceDetailsScreen() {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/dashboard/invoices"
            className="mb-1 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon />
            Invoices
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">INV-2026-042</h1>
            <Badge variant="outline">Draft</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Railway signaling maintenance · August 2026</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Edit
          </Button>
          <Button type="button">Mark as sent</Button>
        </div>
      </div>
      <DataCard title="Invoice summary" description="Commercial and payment information.">
        <KeyValueGrid
          items={[
            { label: "Invoice date", value: "21 August 2026" },
            { label: "Due date", value: "10 September 2026" },
            { label: "Billing period", value: "August 2026" },
            { label: "Contract reference", value: "GEM/2026/B/4412081" },
            { label: "Bill to", value: "Indian Railways" },
            { label: "Payment status", value: "Not sent" },
          ]}
        />
      </DataCard>
      <DataCard title="Line items" description="Services included in this invoice." contentClassName="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Monthly signaling maintenance services</TableCell>
              <TableCell className="text-right tabular-nums">1</TableCell>
              <TableCell className="text-right tabular-nums">₹3,75,000</TableCell>
              <TableCell className="text-right tabular-nums">₹3,75,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Approved travel reimbursement</TableCell>
              <TableCell className="text-right tabular-nums">1</TableCell>
              <TableCell className="text-right tabular-nums">₹30,000</TableCell>
              <TableCell className="text-right tabular-nums">₹30,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DataCard>
      <div className="ml-auto w-full max-w-sm">
        <Card>
          <CardContent className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹4,05,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span>₹72,900</span>
            </div>
            <div className="flex justify-between border-t pt-2.5 text-sm font-medium">
              <span>Total</span>
              <span>₹4,77,900</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

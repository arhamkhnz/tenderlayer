import { ArrowLeftIcon, PlusIcon, ReceiptIcon } from "@keyline-icons/react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";
import { Textarea } from "@tenderlayer/ui/components/textarea";

import { FinanceStatusBadge } from "../../-components/shared/records/finance-status-badge";
import { invoices } from "./data";
import { DataCard, KeyValueGrid, PageHeader } from "./invoice-screen-components";
import { InvoicesTable } from "./table/invoices-table";

export function InvoicesScreen() {
  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background"
    >
      <header className="flex shrink-0 flex-col gap-4 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tighter leading-none">
            Invoices <span className="font-mono text-muted-foreground text-xl leading-none">[{invoices.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">Prepare and track invoices raised against awarded contracts.</p>
        </div>
        <Link
          from="/dashboard/$organizationId"
          to="/dashboard/$organizationId/invoices/new"
          className={buttonVariants({ size: "sm" })}
        >
          <ReceiptIcon data-icon="inline-start" />
          New invoice
        </Link>
      </header>
      <InvoicesTable records={invoices} />
    </section>
  );
}

export function NewInvoiceScreen() {
  return (
    <>
      <PageHeader
        title="New invoice"
        description="Prepare an invoice for completed work under a contract."
        action={
          <Link
            from="/dashboard/$organizationId"
            to="/dashboard/$organizationId/invoices"
            className={buttonVariants({ variant: "outline" })}
          >
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
                    <SelectValue className="font-450" />
                  </SelectTrigger>
                  <SelectContent className="font-450">
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
        <Link
          from="/dashboard/$organizationId"
          to="/dashboard/$organizationId/invoices"
          className={buttonVariants({ variant: "outline" })}
        >
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
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            from="/dashboard/$organizationId"
            to="/dashboard/$organizationId/invoices"
            className="mb-1 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon />
            Invoices
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl tracking-tighter leading-none">INV-2026-042</h1>
            <FinanceStatusBadge status="Draft" />
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

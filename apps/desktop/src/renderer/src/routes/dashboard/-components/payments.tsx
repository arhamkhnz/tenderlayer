import { useState } from "react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { ScrollArea } from "@tenderlayer/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

const invoices = [
  { id: "INV-018", department: "CCI", amount: 180000, daysOverdue: 78 },
  { id: "INV-021", department: "Ministry of Defense", amount: 150000, daysOverdue: 63 },
  { id: "INV-024", department: "Railway", amount: 150000, daysOverdue: 51 },
  { id: "INV-027", department: "CCI", amount: 120000, daysOverdue: 42 },
  { id: "INV-030", department: "Education", amount: 80000, daysOverdue: 31 },
  { id: "INV-033", department: "Ministry of Defense", amount: 100000, daysOverdue: 18 },
  { id: "INV-036", department: "Aviation & Defense", amount: 60000, daysOverdue: 12 },
  { id: "INV-039", department: "DH", amount: 40000, daysOverdue: 6 },
];

const bills = [
  { id: "BILL-041", name: "Office supplies", amount: 25000, daysUntilDue: 1 },
  { id: "BILL-042", name: "Equipment rental", amount: 60000, daysUntilDue: 3 },
  { id: "BILL-043", name: "Transport services", amount: 45000, daysUntilDue: 5 },
  { id: "BILL-044", name: "Site maintenance", amount: 80000, daysUntilDue: 7 },
  { id: "BILL-045", name: "October payroll", amount: 240000, daysUntilDue: 12 },
  { id: "BILL-046", name: "Office rent", amount: 40000, daysUntilDue: 13 },
];

const paymentGroups = [
  {
    value: "receivables",
    label: "Receivables",
    title: "Outstanding payments",
    summary: "to collect",
    items: [...invoices]
      .sort((a, b) => b.daysOverdue - a.daysOverdue)
      .map((invoice) => ({
        id: invoice.id,
        name: invoice.department,
        amount: invoice.amount,
        detail: `${invoice.daysOverdue} days overdue`,
      })),
  },
  {
    value: "payables",
    label: "Payables",
    title: "Upcoming payments",
    summary: "to pay",
    items: [...bills]
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
      .map((bill) => ({
        id: bill.id,
        name: bill.name,
        amount: bill.amount,
        detail: bill.daysUntilDue === 1 ? "Due tomorrow" : `Due in ${bill.daysUntilDue} days`,
      })),
  },
];

const paymentOptions = paymentGroups.map(({ label, value }) => ({ label, value }));

export function Payments() {
  const [paymentType, setPaymentType] = useState("receivables");
  const activeGroup = paymentGroups.find((group) => group.value === paymentType) ?? paymentGroups[0];
  const total = activeGroup.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card size="sm" className="min-h-0 min-w-0">
      <CardHeader>
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="leading-none text-muted-foreground font-normal">{activeGroup.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-xl font-medium tracking-tighter text-foreground tabular-nums">
              ₹{formatCompactNumber(total)}
            </span>
            <span>{activeGroup.summary}</span>
          </CardDescription>
        </div>
        <CardAction className="row-span-1">
          <Select
            items={paymentOptions}
            value={paymentType}
            onValueChange={(value) => {
              if (value) setPaymentType(value);
            }}
          >
            <SelectTrigger className="bg-background dark:bg-background" aria-label="Payment type">
              <SelectValue className="font-medium" />
            </SelectTrigger>
            <SelectContent className="min-w-max" alignItemWithTrigger={false} side="bottom" align="end">
              <SelectGroup>
                {paymentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="pr-8">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <ScrollArea key={paymentType} className="h-0 min-h-64 flex-1 sm:min-h-60 xl:min-h-0">
          <ul aria-label={activeGroup.label} className="divide-y divide-border pr-3">
            {activeGroup.items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-4 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-xs font-medium">{item.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {item.id} · {item.detail}
                  </span>
                </div>
                <span className="shrink-0 text-right text-xs font-medium tabular-nums">
                  ₹{formatCompactNumber(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

const departments = [
  { label: "CCI", count: 2, amount: 300000 },
  { label: "Ministry of Defense", count: 2, amount: 250000 },
  { label: "Railway", count: 1, amount: 150000 },
  { label: "Education", count: 1, amount: 80000 },
  { label: "Aviation & Defense", count: 1, amount: 60000 },
  { label: "DH", count: 1, amount: 40000 },
];

export function InvoiceAgeing() {
  const totals = departments.reduce(
    (sum, group) => ({ count: sum.count + group.count, amount: sum.amount + group.amount }),
    { count: 0, amount: 0 },
  );

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle className="leading-none text-muted-foreground font-normal">Outstanding payments</CardTitle>
        <CardDescription className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-xl font-medium tracking-tighter text-foreground tabular-nums">
            ₹{formatCompactNumber(totals.amount)}
          </span>
          <span>
            across {totals.count} unpaid {totals.count === 1 ? "invoice" : "invoices"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="border-separate border-spacing-y-1.5">
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="h-8">
                <span className="sr-only">Department</span>
              </TableHead>
              <TableHead className="h-8 text-right text-muted-foreground font-normal">Invoices</TableHead>
              <TableHead className="h-8 text-right text-muted-foreground font-normal">Amount due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((group) => (
              <TableRow key={group.label} className="border-0 bg-muted">
                <TableCell className="rounded-l-md">{group.label}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{group.count}</TableCell>
                <TableCell className="rounded-r-md text-right font-medium tabular-nums">
                  ₹{formatCompactNumber(group.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

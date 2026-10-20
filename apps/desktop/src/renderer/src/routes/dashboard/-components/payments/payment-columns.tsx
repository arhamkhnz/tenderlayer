import { createColumnHelper } from "@tanstack/react-table";

import { Badge } from "@tenderlayer/ui/components/badge";
import { Checkbox } from "@tenderlayer/ui/components/checkbox";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

import { paymentDateFormatter, type Payment } from "./payment-data";
import type { PaymentTableFeatures } from "./payment-table-features";

export const paymentColumnLabels: Record<string, string> = {
  name: "Particulars",
  id: "Reference",
  direction: "Direction",
  category: "Category",
  dueDate: "Due date",
  status: "Status",
  amount: "Amount due",
};

const columnHelper = createColumnHelper<PaymentTableFeatures, Payment>();

export const paymentColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all payments on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  }),
  columnHelper.accessor("name", {
    enableHiding: false,
    header: "Particulars",
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("id", {
    header: "Reference",
    cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue()}</span>,
  }),
  columnHelper.accessor("direction", {
    header: "Direction",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() === "collect" ? "To collect" : "To pay"}</span>
    ),
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  columnHelper.accessor("dueDate", {
    header: "Due date",
    cell: ({ getValue }) => <span className="tabular-nums">{paymentDateFormatter.format(getValue())}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === "Overdue" ? "destructive" : "secondary"}>{getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("amount", {
    header: () => <div className="text-right">Amount due</div>,
    cell: ({ getValue }) => (
      <div className="text-right font-medium tabular-nums">₹{formatCompactNumber(getValue())}</div>
    ),
  }),
]);

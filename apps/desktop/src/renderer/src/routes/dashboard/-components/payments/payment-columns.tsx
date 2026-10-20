import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "cn";

import { Badge } from "@tenderlayer/ui/components/badge";
import { Checkbox } from "@tenderlayer/ui/components/checkbox";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

import { paymentDateFormatter, type Payment } from "./payment-data";
import type { DataTableFeatures } from "@/lib/data-table-features";

export const paymentColumnLabels: Record<string, string> = {
  name: "Particulars",
  id: "Reference",
  category: "Category",
  dueDate: "Due date",
  status: "Status",
  amount: "Amount due",
};

const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

const categoryColors: Record<string, string> = {
  Invoice: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Salaries: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  PF: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  ESIC: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  GST: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Vendor bill": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Rent: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
};

const statusColors: Record<Payment["status"], string> = {
  Overdue: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "Due today": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Upcoming: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
};

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
    cell: ({ getValue }) => <span className="text-muted-foreground font-mono">{getValue()}</span>,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: ({ getValue }) => {
      const category = getValue();
      return (
        <Badge variant="secondary" className={cn("rounded-md px-1.5", categoryColors[category])}>
          {category}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("dueDate", {
    header: "Due date",
    cell: ({ getValue }) => <span className="tabular-nums">{paymentDateFormatter.format(getValue())}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge variant="secondary" className={cn("rounded-md px-1.5", statusColors[status])}>
          {status}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: () => <div className="text-right">Amount due</div>,
    cell: ({ getValue }) => (
      <div className="text-right font-medium tabular-nums">₹{formatCompactNumber(getValue())}</div>
    ),
  }),
]);

import type { ComponentType } from "react";

import { BriefcaseIcon, CalendarIcon, HashIcon, IndianRupeeIcon, TagIcon, type IconProps } from "@keyline-icons/react";
import { Link } from "@tanstack/react-router";
import {
  createColumnHelper,
  filterFn_equals,
  globalFilteringFeature,
  metaHelper,
  tableFeatures,
} from "@tanstack/react-table";
import { cn } from "cn";

import { Checkbox } from "@tenderlayer/ui/components/checkbox";

import { dataTableFeatures } from "@/lib/data-table-features";

import { FinanceStatusBadge } from "../../../-components/shared/records/finance-status-badge";
import type { Invoice } from "../data";

export const invoiceTableFeatures = tableFeatures({
  ...dataTableFeatures,
  globalFilteringFeature,
  filterFns: { ...dataTableFeatures.filterFns, equals: filterFn_equals },
  columnMeta: metaHelper<{ numeric?: boolean }>(),
});

const columnHelper = createColumnHelper<typeof invoiceTableFeatures, Invoice>();

function columnHeader(label: string, Icon: ComponentType<IconProps>, numeric = false) {
  return {
    meta: { numeric },
    header: () => (
      <div className={cn("flex items-center gap-2", numeric && "justify-end")}>
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {label}
      </div>
    ),
  };
}

export const invoiceColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        aria-label="Select all invoices on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        disabled={!table.getRowModel().rows.length}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        aria-label={`Select ${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  }),
  columnHelper.accessor("invoice", {
    ...columnHeader("Invoice", HashIcon),
    enableHiding: false,
    cell: ({ row, getValue }) => (
      <Link
        from="/dashboard/$organizationId"
        to="/dashboard/$organizationId/invoices/$invoiceId"
        params={{ invoiceId: row.original.id }}
        className="rounded-sm font-mono outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        {getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("contract", {
    ...columnHeader("Contract", BriefcaseIcon),
  }),
  columnHelper.accessor("issued", {
    ...columnHeader("Issued", CalendarIcon),
    cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue()}</span>,
  }),
  columnHelper.accessor("due", {
    ...columnHeader("Due", CalendarIcon),
    cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue()}</span>,
  }),
  columnHelper.accessor("amount", {
    ...columnHeader("Amount", IndianRupeeIcon, true),
  }),
  columnHelper.accessor("status", {
    ...columnHeader("Status", TagIcon),
    filterFn: "equals",
    cell: ({ getValue }) => <FinanceStatusBadge status={getValue()} />,
  }),
]);

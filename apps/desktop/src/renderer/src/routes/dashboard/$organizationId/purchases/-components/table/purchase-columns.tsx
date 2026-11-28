import type { ComponentType } from "react";

import {
  BriefcaseIcon,
  Building,
  CalendarIcon,
  HashIcon,
  IndianRupeeIcon,
  ReceiptIcon,
  TagIcon,
  type IconProps,
} from "@keyline-icons/react";
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
import { formatAmount, type PurchaseRecord } from "../data";

export const purchaseTableFeatures = tableFeatures({
  ...dataTableFeatures,
  globalFilteringFeature,
  filterFns: { ...dataTableFeatures.filterFns, equals: filterFn_equals },
  columnMeta: metaHelper<{ numeric?: boolean }>(),
});

const columnHelper = createColumnHelper<typeof purchaseTableFeatures, PurchaseRecord>();

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

export const purchaseColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        aria-label="Select all purchases on this page"
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
    cell: ({ getValue }) => <span className="font-mono">{getValue()}</span>,
  }),
  columnHelper.accessor("vendor", {
    ...columnHeader("Vendor", Building),
    cell: ({ getValue }) => <span className="font-450">{getValue()}</span>,
  }),
  columnHelper.accessor("category", {
    ...columnHeader("Category", TagIcon),
  }),
  columnHelper.accessor("contract", {
    ...columnHeader("Contract", BriefcaseIcon),
    cell: ({ getValue }) => getValue() || "—",
  }),
  columnHelper.accessor("date", {
    ...columnHeader("Date", CalendarIcon),
    cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue()}</span>,
  }),
  columnHelper.accessor("gst", {
    ...columnHeader("GST", IndianRupeeIcon, true),
    cell: ({ getValue }) => formatAmount(getValue()),
  }),
  columnHelper.accessor((record) => record.amount + record.gst, {
    id: "total",
    ...columnHeader("Total", IndianRupeeIcon, true),
    cell: ({ getValue }) => formatAmount(getValue()),
  }),
  columnHelper.accessor("status", {
    ...columnHeader("Payment", ReceiptIcon),
    filterFn: "equals",
    cell: ({ getValue }) => <FinanceStatusBadge status={getValue()} />,
  }),
]);

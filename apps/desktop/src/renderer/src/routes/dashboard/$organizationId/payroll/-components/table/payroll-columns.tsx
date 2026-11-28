import type { ComponentType } from "react";

import { BriefcaseIcon, CalendarIcon, IndianRupeeIcon, TagIcon, UsersIcon, type IconProps } from "@keyline-icons/react";
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
import type { PayrollRun } from "../data";

export const payrollTableFeatures = tableFeatures({
  ...dataTableFeatures,
  globalFilteringFeature,
  filterFns: { ...dataTableFeatures.filterFns, equals: filterFn_equals },
  columnMeta: metaHelper<{ numeric?: boolean }>(),
});

const columnHelper = createColumnHelper<typeof payrollTableFeatures, PayrollRun>();

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

export const payrollColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        aria-label="Select all payroll runs on this page"
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
  columnHelper.accessor("period", {
    ...columnHeader("Pay period", CalendarIcon),
    enableHiding: false,
    cell: ({ row, getValue }) => (
      <Link
        from="/dashboard/$organizationId"
        to="/dashboard/$organizationId/payroll/$payrollId"
        params={{ payrollId: row.original.id }}
        className="rounded-sm font-450 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        {getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("contracts", {
    ...columnHeader("Contracts", BriefcaseIcon, true),
  }),
  columnHelper.accessor("employees", {
    ...columnHeader("Employees", UsersIcon, true),
  }),
  columnHelper.accessor("gross", {
    ...columnHeader("Gross pay", IndianRupeeIcon, true),
  }),
  columnHelper.accessor("deductions", {
    ...columnHeader("Deductions", IndianRupeeIcon, true),
  }),
  columnHelper.accessor("status", {
    ...columnHeader("Status", TagIcon),
    filterFn: "equals",
    cell: ({ getValue }) => <FinanceStatusBadge status={getValue()} />,
  }),
]);

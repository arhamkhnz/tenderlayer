import {
  BinIcon,
  BriefcaseIcon,
  CalendarIcon,
  HashIcon,
  IndianRupeeIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  TagIcon,
} from "@keyline-icons/react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_equals,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table";
import { cn } from "cn";

import { Badge } from "@tenderlayer/ui/components/badge";
import { Button } from "@tenderlayer/ui/components/button";
import { Checkbox } from "@tenderlayer/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";

import type { ContractRecord } from "@shared/contracts/contracts";

export const contractStatuses: Record<ContractRecord["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  "wo-received": {
    label: "WO Received",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  scheduled: { label: "Scheduled", className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200" },
  active: { label: "Active", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  "on-hold": { label: "On Hold", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  terminated: { label: "Terminated", className: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200" },
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export const contractTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { equals: filterFn_equals },
  columnMeta: metaHelper<{ widthClassName?: string }>(),
  tableMeta: metaHelper<{
    onEdit: (contract: ContractRecord) => void;
    onDelete: (contract: ContractRecord) => void;
  }>(),
});

const columnHelper = createColumnHelper<typeof contractTableFeatures, ContractRecord>();

function contractColumnHeader(label: string, Icon?: typeof BriefcaseIcon, right = false) {
  return () => (
    <div className={cn("flex items-center gap-2", right && "justify-end")}>
      {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
      {label}
    </div>
  );
}

export const contractColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    meta: { widthClassName: "w-14" },
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        aria-label="Select all contracts on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        disabled={table.getRowModel().rows.length === 0}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        aria-label={`Select ${row.original.title}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  }),
  columnHelper.accessor("title", {
    header: contractColumnHeader("Contract", BriefcaseIcon),
    cell: ({ getValue }) => (
      <span className="block truncate font-450" title={getValue()}>
        {getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("gemReference", {
    meta: { widthClassName: "w-40" },
    header: contractColumnHeader("Reference", HashIcon),
    cell: ({ getValue }) => (
      <span className="block truncate font-mono text-xs text-muted-foreground" title={getValue() ?? undefined}>
        {getValue() ?? "—"}
      </span>
    ),
  }),
  columnHelper.accessor("departmentId", {
    meta: { widthClassName: "w-48" },
    header: contractColumnHeader("Department"),
    filterFn: "equals",
    cell: ({ row }) => (
      <span className="block truncate" title={row.original.departmentName ?? undefined}>
        {row.original.departmentName ?? "—"}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    meta: { widthClassName: "w-36" },
    header: contractColumnHeader("Status", TagIcon),
    filterFn: "equals",
    cell: ({ getValue }) => {
      const { label, className } = contractStatuses[getValue()];
      return (
        <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", className)}>
          {label}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("amount", {
    meta: { widthClassName: "w-36" },
    header: contractColumnHeader("Value", IndianRupeeIcon, true),
    cell: ({ row, getValue }) => {
      const amount = getValue();
      if (amount === null) return <div className="text-right text-muted-foreground">—</div>;

      const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: row.original.currency });
      const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
      const value = formatter.format(amount / 10 ** fractionDigits);
      return (
        <div className="truncate text-right font-450 tabular-nums" title={value}>
          {value}
        </div>
      );
    },
  }),
  columnHelper.accessor("endDate", {
    meta: { widthClassName: "w-32" },
    header: contractColumnHeader("Ends", CalendarIcon, true),
    cell: ({ getValue }) => {
      const endDate = getValue();
      const date = endDate ? new Date(`${endDate}T00:00:00Z`) : null;
      return (
        <div className="text-right text-muted-foreground tabular-nums">
          {date && !Number.isNaN(date.getTime()) ? dateFormatter.format(date) : "—"}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    meta: { widthClassName: "w-14" },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.title}`} />}
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 font-450">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => table.options.meta?.onEdit(row.original)}>
                <PenLineIcon aria-hidden="true" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={() => table.options.meta?.onDelete(row.original)}>
                <BinIcon aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }),
]);

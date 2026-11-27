import {
  BinIcon,
  BriefcaseIcon,
  CalendarIcon,
  EyeIcon,
  HashIcon,
  IndianRupeeIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  TagIcon,
} from "@keyline-icons/react";
import { Link } from "@tanstack/react-router";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
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

import { contractStatusDisplay, formatContractAmount, formatContractDate } from "../contract-display";

export const contractTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { equals: filterFn_equals },
  columnMeta: metaHelper<{ label?: string; width?: number }>(),
  tableMeta: metaHelper<{
    onEdit: (contract: ContractRecord) => void;
    onDelete: (contract: ContractRecord) => void;
  }>(),
});

const columnHelper = createColumnHelper<typeof contractTableFeatures, ContractRecord>();

function contractColumnHeader(label: string, width?: number, Icon?: typeof BriefcaseIcon, right = false) {
  return {
    meta: { label, width },
    header: () => (
      <div className={cn("flex items-center gap-2", right && "justify-end")}>
        {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
        {label}
      </div>
    ),
  };
}

export const contractColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    meta: { width: 56 },
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
    ...contractColumnHeader("Contract", undefined, BriefcaseIcon),
    enableHiding: false,
    cell: ({ getValue }) => (
      <span className="block truncate font-450" title={getValue()}>
        {getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("gemReference", {
    ...contractColumnHeader("Reference", 160, HashIcon),
    cell: ({ getValue }) => (
      <span className="block truncate font-mono text-xs text-muted-foreground" title={getValue() ?? undefined}>
        {getValue() ?? "—"}
      </span>
    ),
  }),
  columnHelper.accessor("departmentId", {
    ...contractColumnHeader("Department", 192),
    filterFn: "equals",
    cell: ({ row }) => (
      <span className="block truncate" title={row.original.departmentName ?? undefined}>
        {row.original.departmentName ?? "—"}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    ...contractColumnHeader("Status", 144, TagIcon),
    filterFn: "equals",
    cell: ({ getValue }) => {
      const { label, className } = contractStatusDisplay[getValue()];
      return (
        <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", className)}>
          {label}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("amount", {
    ...contractColumnHeader("Value", 144, IndianRupeeIcon, true),
    cell: ({ row, getValue }) => {
      const amount = getValue();
      if (amount === null) return <div className="text-right text-muted-foreground">—</div>;

      const value = formatContractAmount(amount, row.original.currency);
      return (
        <div className="truncate text-right font-450 tabular-nums" title={value}>
          {value}
        </div>
      );
    },
  }),
  columnHelper.accessor("endDate", {
    ...contractColumnHeader("Ended on", 128, CalendarIcon, true),
    cell: ({ getValue }) => (
      <div className="text-right text-muted-foreground tabular-nums">{formatContractDate(getValue())}</div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    meta: { width: 56 },
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
              <DropdownMenuItem
                render={
                  <Link
                    from="/dashboard/$organizationId"
                    to="/dashboard/$organizationId/contracts/$contractId"
                    params={{ contractId: row.original.id }}
                  />
                }
              >
                <EyeIcon aria-hidden="true" />
                View
              </DropdownMenuItem>
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

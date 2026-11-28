import type { ComponentType, CSSProperties } from "react";

import {
  BinIcon,
  BriefcaseIcon,
  EyeIcon,
  IdBadgeIcon,
  IndianRupeeIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  TagIcon,
  UserIcon,
  type IconProps,
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
import { getAvatarColors } from "@tenderlayer/ui/lib/avatar-colors";
import { getInitials } from "@tenderlayer/ui/lib/utils";

import type { EmployeeRecord } from "@shared/contracts/employees";

import { employeeStatusDisplay } from "../employee-display";

export const employeeTableFeatures = tableFeatures({
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
    onEdit: (employeeId: string) => void;
    onDelete: (employee: EmployeeRecord) => void;
    loadingEmployee: boolean;
  }>(),
});

const columnHelper = createColumnHelper<typeof employeeTableFeatures, EmployeeRecord>();

function employeeColumnHeader(label: string, Icon: ComponentType<IconProps>, width?: number, right = false) {
  return {
    meta: { label, width },
    header: () => (
      <div className={cn("flex items-center gap-2", right && "justify-end")}>
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {label}
      </div>
    ),
  };
}

function EmployeeAvatar({ name }: { name: string }) {
  const colors = getAvatarColors(name);

  return (
    <div
      aria-hidden="true"
      className="size-4.5 shrink-0 grid place-items-center text-xs font-mono rounded-sm bg-(--avatar-bg) text-(--avatar-fg) ring-1 ring-inset ring-(--avatar-outline) dark:bg-(--avatar-dark-bg) dark:text-(--avatar-dark-fg) dark:ring-(--avatar-dark-outline)"
      style={
        {
          "--avatar-bg": colors.light.background,
          "--avatar-fg": colors.light.foreground,
          "--avatar-outline": colors.light.outline,
          "--avatar-dark-bg": colors.dark.background,
          "--avatar-dark-fg": colors.dark.foreground,
          "--avatar-dark-outline": colors.dark.outline,
        } as CSSProperties
      }
    >
      {getInitials(name, 1)}
    </div>
  );
}

export const employeeColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    meta: { width: 56 },
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        aria-label="Select all employees on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        disabled={table.getRowModel().rows.length === 0}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  }),
  columnHelper.accessor("name", {
    ...employeeColumnHeader("Employee", UserIcon),
    enableHiding: false,
    cell: ({ row: { original: employee } }) => (
      <div className="flex min-w-0 items-center gap-2.5">
        <EmployeeAvatar name={employee.name} />
        <span title={employee.name} className="truncate font-450">
          {employee.name}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("jobTitle", {
    ...employeeColumnHeader("Role", IdBadgeIcon, 144),
    cell: ({ getValue }) => (
      <span className="block truncate" title={getValue()}>
        {getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("contractId", {
    ...employeeColumnHeader("Contract", BriefcaseIcon, 200),
    filterFn: "equals",
    cell: ({
      row: {
        original: { contractTitle },
      },
    }) => (
      <span className="block truncate" title={contractTitle ?? undefined}>
        {contractTitle ?? "—"}
      </span>
    ),
  }),
  columnHelper.accessor("location", {
    ...employeeColumnHeader("Location", MapPinIcon, 160),
    filterFn: "equals",
    cell: ({ getValue }) => (
      <span className="block truncate" title={getValue() ?? undefined}>
        {getValue() ?? "—"}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    ...employeeColumnHeader("Status", TagIcon, 120),
    filterFn: "equals",
    cell: ({ getValue }) => {
      const { label, className } = employeeStatusDisplay[getValue()];
      return (
        <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", className)}>
          {label}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("monthlyPay", {
    ...employeeColumnHeader("Monthly pay", IndianRupeeIcon, 136, true),
    cell: ({ row, getValue }) => {
      const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: row.original.currency });
      const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
      const pay = formatter.format(getValue() / 10 ** fractionDigits);
      return (
        <div className="truncate text-right font-450 tabular-nums" title={pay}>
          {pay}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    meta: { width: 56 },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const { id, name } = row.original;
      const meta = table.options.meta;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${name}`} />}
              disabled={meta?.loadingEmployee}
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 font-450">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <Link
                      from="/dashboard/$organizationId"
                      to="/dashboard/$organizationId/employees/$employeeId"
                      params={{ employeeId: id }}
                    />
                  }
                >
                  <EyeIcon aria-hidden="true" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => meta?.onEdit(id)}>
                  <PenLineIcon aria-hidden="true" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete(row.original)}>
                  <BinIcon aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }),
]);

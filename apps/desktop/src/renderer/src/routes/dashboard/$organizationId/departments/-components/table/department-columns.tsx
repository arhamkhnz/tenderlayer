import {
  BinIcon,
  BriefcaseIcon,
  Building,
  HashIcon,
  IndianRupeeIcon,
  MoreHorizontalIcon,
  PenLineIcon,
} from "@keyline-icons/react";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table";

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

import type { DepartmentRecord } from "@shared/contracts/departments";

export const departmentTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: metaHelper<{ label?: string; widthClassName?: string }>(),
  tableMeta: metaHelper<{
    onEdit: (department: DepartmentRecord) => void;
    onDelete: (department: DepartmentRecord) => void;
  }>(),
});

const columnHelper = createColumnHelper<typeof departmentTableFeatures, DepartmentRecord>();

function departmentColumnHeader(label: string, Icon: typeof Building, widthClassName?: string) {
  return {
    meta: { label, widthClassName },
    header: () => (
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {label}
      </div>
    ),
  };
}

export const departmentColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    meta: { widthClassName: "w-14" },
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        aria-label="Select all departments on this page"
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
    ...departmentColumnHeader("Department", Building),
    cell: ({ getValue }) => (
      <span className="block truncate font-450" title={getValue()}>
        {getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("code", {
    ...departmentColumnHeader("Code", HashIcon, "w-32 lg:w-40"),
    cell: ({ getValue }) => {
      const code = getValue();
      return code ? (
        <Badge variant="outline" className="rounded-md font-mono">
          {code}
        </Badge>
      ) : (
        "—"
      );
    },
  }),
  columnHelper.display({
    id: "activeContracts",
    ...departmentColumnHeader("Active contracts", BriefcaseIcon, "w-48"),
    cell: () => (
      <span className="text-muted-foreground tabular-nums" aria-label="Active contract count unavailable">
        —
      </span>
    ),
  }),
  columnHelper.display({
    id: "activeContractValue",
    ...departmentColumnHeader("Active contract value", IndianRupeeIcon, "w-52"),
    cell: () => (
      <span className="font-mono text-muted-foreground tabular-nums" aria-label="Active contract value unavailable">
        —
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    meta: { widthClassName: "w-14" },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.name}`} />}
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

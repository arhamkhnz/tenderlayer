import { useState } from "react";
import {
  ArrowsDownUpIcon,
  ColumnsIcon,
  FloppyDiskIcon,
  FunnelSimpleIcon,
  GearSixIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import {
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type SortingState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { employeeColumns, type Employee } from "./employee-columns";
import { employeeTableFeatures } from "./employee-data-table-features";

const columnLabels: Record<string, string> = {
  role: "Role",
  contract: "Contract",
  monthlyPay: "Monthly pay",
  joiningDate: "Joining date",
};

type SavedEmployeeTableView = {
  sorting: SortingState;
  columnVisibility: ColumnVisibilityState;
};

function readSavedView(): SavedEmployeeTableView {
  try {
    const storedView = window.localStorage.getItem("tenderlayer.employee-table-view");
    return storedView ? JSON.parse(storedView) : { sorting: [], columnVisibility: {} };
  } catch {
    return { sorting: [], columnVisibility: {} };
  }
}

function ariaSort(direction: false | "asc" | "desc"): "ascending" | "descending" | "none" {
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return "none";
}

export function EmployeeDataTable({ data }: { data: Employee[] }) {
  const [initialView] = useState(readSavedView);
  const [sorting, setSorting] = useState<SortingState>(initialView.sorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialView.columnVisibility);
  const [showFilter, setShowFilter] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const table = useTable({
    features: employeeTableFeatures,
    data,
    columns: employeeColumns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const nameColumn = table.getColumn("name");
  const sortDirection = nameColumn?.getIsSorted() ?? false;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;

  function cycleNameSorting() {
    if (!nameColumn) return;
    if (!sortDirection) nameColumn.toggleSorting(false);
    else if (sortDirection === "asc") nameColumn.toggleSorting(true);
    else nameColumn.clearSorting();
  }

  function resetView() {
    table.resetColumnFilters(true);
    table.resetSorting(true);
    table.resetColumnVisibility(true);
    setShowFilter(false);
    setShowColumns(false);
  }

  function saveView() {
    window.localStorage.setItem(
      "tenderlayer.employee-table-view",
      JSON.stringify({ sorting: table.state.sorting, columnVisibility: table.state.columnVisibility }),
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b px-2 py-2">
        <div className="flex flex-wrap items-center gap-1">
          <Button type="button" variant="ghost" onClick={() => setShowFilter((current) => !current)}>
            <FunnelSimpleIcon data-icon="inline-start" />
            Filter ({table.state.columnFilters.length})
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Add filter" onClick={() => setShowFilter(true)}>
            <PlusIcon />
          </Button>
          {showFilter ? (
            <Input
              aria-label="Filter employees by name"
              placeholder="Filter employees"
              value={(nameColumn?.getFilterValue() as string) ?? ""}
              onChange={(event) => nameColumn?.setFilterValue(event.target.value)}
              className="w-48"
            />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1">
          <Button type="button" variant="ghost" onClick={() => setShowColumns((current) => !current)}>
            <ColumnsIcon data-icon="inline-start" />
            Layout
          </Button>
          {showColumns
            ? table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <Button
                    key={column.id}
                    type="button"
                    variant={column.getIsVisible() ? "secondary" : "ghost"}
                    size="sm"
                    aria-pressed={column.getIsVisible()}
                    onClick={() => column.toggleVisibility()}
                  >
                    {columnLabels[column.id] ?? column.id}
                  </Button>
                ))
            : null}
          <Button type="button" variant="ghost" onClick={cycleNameSorting}>
            <ArrowsDownUpIcon data-icon="inline-start" />
            Sort
          </Button>
          <Button type="button" variant="ghost" onClick={resetView}>
            <GearSixIcon data-icon="inline-start" />
            View settings
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Save view" onClick={saveView}>
            <FloppyDiskIcon />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 [&>[data-slot=table-container]]:h-full">
        <Table className="h-full min-w-[64rem] table-fixed text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={ariaSort(header.column.getIsSorted())}
                    className="h-12 border-r px-4 last:border-r-0"
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-14 truncate border-r px-4 last:border-r-0">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
            <TableRow aria-hidden="true" className="h-full hover:bg-transparent">
              <TableCell colSpan={visibleColumnCount} className="p-0" />
            </TableRow>
          </TableBody>
          <TableFooter className="sticky bottom-0">
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id} className="hover:bg-transparent">
                {footerGroup.headers.map((footer) => (
                  <TableCell key={footer.id} className="h-12 border-r px-4 last:border-r-0">
                    {footer.isPlaceholder ? null : <table.FlexRender footer={footer} />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

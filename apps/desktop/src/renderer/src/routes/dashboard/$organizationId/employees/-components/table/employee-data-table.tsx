import { useLayoutEffect, useRef } from "react";

import { SearchIcon, XIcon } from "@keyline-icons/react";
import { useTable } from "@tanstack/react-table";
import { cn } from "cn";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@tenderlayer/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";

import type { ContractRecord } from "@shared/contracts/contracts";
import type { EmployeeRecord } from "@shared/contracts/employees";

import { DataTableViewOptions } from "../../../-components/shared/records/data-table-view-options";
import { employeeStatusDisplay } from "../employee-display";
import { employeeColumns, employeeTableFeatures } from "./employee-columns";
import { EmployeeTableFooter } from "./employee-table-footer";

const filters = [
  { id: "contractId", name: "contract", label: "All contracts", width: "w-48" },
  { id: "status", name: "status", label: "All statuses", width: "w-36" },
  { id: "location", name: "location", label: "All locations", width: "w-36" },
] as const;
const statusOptions = Object.entries(employeeStatusDisplay).map(([value, { label }]) => ({ label, value }));

export function EmployeeDataTable({
  data,
  contracts,
  onEdit,
  onDelete,
  loadingEmployee,
}: {
  data: EmployeeRecord[];
  contracts: ContractRecord[];
  onEdit: (employeeId: string) => void;
  onDelete: (employee: EmployeeRecord) => void;
  loadingEmployee: boolean;
}) {
  const searchInput = useRef<HTMLInputElement>(null);
  const table = useTable({
    features: employeeTableFeatures,
    data,
    columns: employeeColumns,
    meta: { onEdit, onDelete, loadingEmployee },
    getRowId: (employee) => employee.id,
    autoResetPageIndex: false,
    getColumnCanGlobalFilter: (column) => column.id === "name",
    globalFilterFn: ({ original: { name, code, jobTitle, contractTitle, location } }, _columnId, query) =>
      `${name} ${code} ${jobTitle} ${contractTitle ?? ""} ${location ?? ""}`
        .toLowerCase()
        .includes(String(query).trim().toLowerCase()),
  });

  const search = String(table.state.globalFilter ?? "");
  const { columnFilters, pagination } = table.state;
  const { pageIndex, pageSize } = pagination;
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const minimumTableWidth = visibleColumns.reduce((width, column) => width + (column.columnDef.meta?.width ?? 168), 0);
  const pageCount = Math.max(1, table.getPageCount());
  const assignedContractIds = new Set(data.map(({ contractId }) => contractId));
  const assignedContracts = contracts.filter(({ id }) => assignedContractIds.has(id));
  const contractLabels = assignedContracts.map(({ id, title, departmentName, gemReference }) => ({
    value: id,
    label: [title, departmentName, gemReference].filter(Boolean).join(" · "),
  }));
  const labelCounts = new Map<string, number>();
  for (const { label } of contractLabels) {
    labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
  }
  const contractOptions = contractLabels.map(({ value, label }) => ({
    value,
    label: labelCounts.get(label) === 1 ? label : `${label} · ${value.slice(0, 8)}`,
  }));
  const locationOptions = Array.from(
    new Set(data.flatMap(({ location }) => (location ? [location] : []))),
    (value) => ({
      label: value,
      value,
    }),
  );
  const filterOptions = { contractId: contractOptions, status: statusOptions, location: locationOptions };
  const contractFilter = columnFilters.find(({ id }) => id === "contractId")?.value;
  const locationFilter = columnFilters.find(({ id }) => id === "location")?.value;
  const contractFilterIsStale =
    contractFilter !== undefined && !contractOptions.some(({ value }) => value === contractFilter);
  const locationFilterIsStale =
    locationFilter !== undefined && !locationOptions.some(({ value }) => value === locationFilter);

  useLayoutEffect(() => {
    if (contractFilterIsStale || locationFilterIsStale) {
      if (contractFilterIsStale) table.getColumn("contractId")?.setFilterValue(undefined);
      if (locationFilterIsStale) table.getColumn("location")?.setFilterValue(undefined);
      table.firstPage();
    } else if (pageIndex >= pageCount) {
      table.setPageIndex(pageCount - 1);
    }
  }, [contractFilterIsStale, locationFilterIsStale, pageCount, pageIndex, table]);

  return (
    <section
      aria-label="Employees list"
      className="flex min-h-0 min-w-0 flex-1 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-start gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 max-w-full shrink-0 bg-background **:data-[slot=input-group-control]:h-7 dark:bg-background">
          <InputGroupInput
            ref={searchInput}
            type="text"
            value={search}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
              table.firstPage();
            }}
            placeholder="Search employees…"
            aria-label="Search employees"
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          {search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => {
                  table.resetGlobalFilter();
                  table.firstPage();
                  searchInput.current?.focus();
                }}
              >
                <XIcon aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <div className="flex min-w-0 grow basis-48 flex-wrap items-center justify-end gap-2">
          {filters.map(({ id, name, label, width }) => {
            const items = [{ label, value: "" }, ...filterOptions[id]];

            return (
              <Select
                key={id}
                items={items}
                value={String(columnFilters.find((filter) => filter.id === id)?.value ?? "")}
                onValueChange={(value) => {
                  table.getColumn(id)?.setFilterValue(value || undefined);
                  table.firstPage();
                }}
              >
                <SelectTrigger
                  size="sm"
                  className={cn("bg-background dark:bg-background", width)}
                  aria-label={`Filter employees by ${name}`}
                >
                  <SelectValue className="font-450" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="end" className="min-w-max font-450">
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          })}
          <DataTableViewOptions columns={table.getAllLeafColumns()} columnVisibility={table.state.columnVisibility} />
        </div>
      </div>
      <Table
        className="table-fixed border-y border-border/60"
        style={{ minWidth: minimumTableWidth }}
        aria-label="Employees"
      >
        <colgroup>
          {visibleColumns.map((column) => (
            <col key={column.id} style={{ width: column.columnDef.meta?.width }} />
          ))}
        </colgroup>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="border-border/60 hover:bg-transparent">
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground first:px-0 last:border-r-0"
                >
                  <table.FlexRender header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id} className="border-border/60 hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="h-12 border-r border-border/50 px-4.5 py-2 first:px-0 last:border-r-0"
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-muted-foreground">
                {data.length ? "No employees match your filters." : "No employees yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EmployeeTableFooter
        rowCount={table.getRowCount()}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(page) => table.setPageIndex(page)}
        onPageSizeChange={(size) => table.setPagination({ pageIndex: 0, pageSize: size })}
      />
    </section>
  );
}

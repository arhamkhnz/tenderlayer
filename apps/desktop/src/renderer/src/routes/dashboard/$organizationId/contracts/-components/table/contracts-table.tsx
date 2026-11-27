import { useLayoutEffect, useRef } from "react";

import { Columns3Icon, SearchIcon, XIcon } from "@keyline-icons/react";
import { useTable } from "@tanstack/react-table";
import { cn } from "cn";

import { Button } from "@tenderlayer/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";
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

import { contractStatusOptions } from "../contract-display";
import { contractColumns, contractTableFeatures } from "./contract-columns";
import { ContractTableFooter } from "./contract-table-footer";

const statusOptions = [{ value: "all", label: "All statuses" }, ...contractStatusOptions];
const minimumTitleWidth = 160;

export function ContractsTable({
  contracts,
  onEdit,
  onDelete,
}: {
  contracts: ContractRecord[];
  onEdit: (contract: ContractRecord) => void;
  onDelete: (contract: ContractRecord) => void;
}) {
  const searchInput = useRef<HTMLInputElement>(null);
  const table = useTable({
    features: contractTableFeatures,
    data: contracts,
    columns: contractColumns,
    meta: { onEdit, onDelete },
    getRowId: (contract) => contract.id,
    autoResetPageIndex: false,
    getColumnCanGlobalFilter: (column) => column.id === "title",
    globalFilterFn: ({ original: { title, gemReference, departmentName } }, _columnId, query) =>
      `${title} ${gemReference ?? ""} ${departmentName ?? ""}`
        .toLowerCase()
        .includes(String(query).trim().toLowerCase()),
  });

  const search = String(table.state.globalFilter ?? "");
  const { columnFilters, pagination } = table.state;
  const { pageIndex, pageSize } = pagination;
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const minimumTableWidth = visibleColumns.reduce(
    (width, column) => width + (column.columnDef.meta?.width ?? minimumTitleWidth),
    0,
  );
  const contractCount = table.getRowCount();
  const pageCount = Math.max(1, table.getPageCount());

  const departmentOptions = [
    { value: "all", label: "All departments" },
    ...Array.from(
      new Map(
        contracts.flatMap(({ departmentId, departmentName }) =>
          departmentId && departmentName ? [[departmentId, departmentName] as const] : [],
        ),
      ),
      ([value, label]) => ({ value, label }),
    ),
  ];
  const departmentFilter = columnFilters.find(({ id }) => id === "departmentId")?.value;
  const departmentFilterIsStale =
    departmentFilter !== undefined && !departmentOptions.some(({ value }) => value === departmentFilter);

  useLayoutEffect(() => {
    if (departmentFilterIsStale) {
      table.getColumn("departmentId")?.setFilterValue(undefined);
      table.firstPage();
    } else if (pageIndex >= pageCount) {
      table.setPageIndex(pageCount - 1);
    }
  }, [departmentFilterIsStale, pageCount, pageIndex, table]);

  return (
    <section
      aria-label="Contracts list"
      className="flex min-h-0 min-w-0 flex-1 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 bg-background **:data-[slot=input-group-control]:h-7 dark:bg-background">
          <InputGroupInput
            ref={searchInput}
            type="text"
            value={search}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
              table.firstPage();
            }}
            placeholder="Search contracts…"
            aria-label="Search contracts"
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
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {[
            { id: "status", label: "Filter contract status", items: statusOptions, width: "w-36" },
            { id: "departmentId", label: "Filter contract department", items: departmentOptions, width: "w-44" },
          ].map(({ id, label, items, width }) => (
            <Select
              key={id}
              items={items}
              value={String(columnFilters.find((filter) => filter.id === id)?.value ?? "all")}
              onValueChange={(value) => {
                table.getColumn(id)?.setFilterValue(value === "all" ? undefined : value);
                table.firstPage();
              }}
            >
              <SelectTrigger size="sm" className={cn("bg-background dark:bg-background", width)} aria-label={label}>
                <SelectValue className="font-450" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="end" className="min-w-max font-450">
                <SelectGroup>
                  {items.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <Columns3Icon data-icon="inline-start" aria-hidden="true" />
              View
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 font-450">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Columns</DropdownMenuLabel>
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => column.toggleVisibility(checked)}
                    >
                      {column.columnDef.meta?.label ?? column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table
        className="table-fixed border-y border-border/60"
        style={{ minWidth: minimumTableWidth }}
        aria-label="Contracts"
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
                  className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground first:px-0 last:border-r-0 last:px-2.5"
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
                    className="h-12 border-r border-border/50 px-4.5 py-2 first:px-0 last:border-r-0 last:px-2.5"
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-muted-foreground">
                {contracts.length ? "No contracts match your filters." : "No contracts yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ContractTableFooter
        label="contracts"
        rowCount={contractCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(page) => table.setPageIndex(page)}
        onPageSizeChange={(size) => table.setPagination({ pageIndex: 0, pageSize: size })}
      />
    </section>
  );
}

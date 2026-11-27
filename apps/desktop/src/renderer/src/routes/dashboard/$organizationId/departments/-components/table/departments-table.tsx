import { useLayoutEffect, useRef } from "react";

import { ChevronLeftIcon, ChevronRightIcon, Columns3Icon, SearchIcon, XIcon } from "@keyline-icons/react";
import { useTable } from "@tanstack/react-table";

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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@tenderlayer/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";

import { pageSizeOptions } from "@/lib/data-table-constants";
import type { DepartmentRecord } from "@shared/contracts/departments";

import { departmentColumns, departmentTableFeatures } from "./department-columns";

export function DepartmentsTable({
  departments,
  onEdit,
  onDelete,
}: {
  departments: DepartmentRecord[];
  onEdit: (department: DepartmentRecord) => void;
  onDelete: (department: DepartmentRecord) => void;
}) {
  const searchInput = useRef<HTMLInputElement>(null);
  const table = useTable({
    features: departmentTableFeatures,
    data: departments,
    columns: departmentColumns,
    initialState: {
      columnVisibility: { activeContracts: false, activeContractValue: false },
    },
    getRowId: (department) => department.id,
    autoResetPageIndex: false,
    // Search name and code as a pair, including queries that span both fields.
    getColumnCanGlobalFilter: (column) => column.id === "name",
    globalFilterFn: ({ original: { name, code } }, _columnId, query) =>
      `${name} ${code ?? ""}`.toLowerCase().includes(String(query).trim().toLowerCase()),
    meta: { onEdit, onDelete },
  });

  const search = String(table.state.globalFilter ?? "");
  const { pageIndex, pageSize } = table.state.pagination;
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const departmentCount = table.getRowCount();
  const pageCount = Math.max(1, table.getPageCount());
  const pageStart = Math.max(0, Math.min(pageIndex - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);
  const firstRow = rows.length ? pageIndex * pageSize + 1 : 0;
  const lastRow = Math.min((pageIndex + 1) * pageSize, departmentCount);

  // Keep the current page after saving unless the refreshed results no longer reach it.
  useLayoutEffect(() => {
    if (pageIndex >= pageCount) table.setPageIndex(pageCount - 1);
  }, [pageCount, pageIndex, table]);

  return (
    <section
      aria-label="Departments list"
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
            placeholder="Search departments…"
            aria-label="Search departments"
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
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="ml-auto" />}>
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
      <Table className="min-w-200 table-fixed border-y border-border/60" aria-label="Departments">
        <colgroup>
          {visibleColumns.map((column) => (
            <col key={column.id} className={column.columnDef.meta?.widthClassName} />
          ))}
        </colgroup>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="border-border/60 hover:bg-transparent">
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground first:w-14 first:px-0 last:w-14 last:border-r-0 last:px-2.5"
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
                    className="h-12 border-r border-border/50 px-4.5 py-2 first:w-14 first:px-0 last:w-14 last:border-r-0 last:px-2.5"
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-muted-foreground">
                {departments.length ? "No departments match your search." : "No departments yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <footer className="flex min-h-12.25 shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-12.25 sm:py-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="tabular-nums" aria-live="polite">
            {firstRow} – {lastRow} of {departmentCount} departments
          </span>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              items={pageSizeOptions}
              value={String(pageSize)}
              onValueChange={(value) => {
                if (value) {
                  table.setPagination({ pageIndex: 0, pageSize: Number(value) });
                }
              }}
            >
              <SelectTrigger
                size="sm"
                className="w-16 bg-background dark:bg-background"
                aria-label="Departments per page"
              >
                <SelectValue className="font-450" />
              </SelectTrigger>
              <SelectContent side="top" align="start" alignItemWithTrigger={false} className="font-450">
                <SelectGroup>
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Pagination aria-label="Department pages" className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                variant="outline"
                size="icon-sm"
                text=""
                aria-label="Previous page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeftIcon />
              </PaginationPrevious>
            </PaginationItem>
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  variant={page === pageIndex ? "secondary" : "ghost"}
                  size="icon-sm"
                  isActive={page === pageIndex}
                  aria-label={`Page ${page + 1}`}
                  onClick={() => table.setPageIndex(page)}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                variant="outline"
                size="icon-sm"
                text=""
                aria-label="Next page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <ChevronRightIcon />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </section>
  );
}

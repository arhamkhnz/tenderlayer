import { useLayoutEffect, useRef } from "react";

import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from "@keyline-icons/react";
import { useTable } from "@tanstack/react-table";
import { cn } from "cn";

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
import type { ContractRecord } from "@shared/contracts/contracts";

import { contractColumns, contractStatuses, contractTableFeatures } from "./contract-columns";

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(contractStatuses).map(([value, { label }]) => ({ value, label })),
];

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
  const contractCount = table.getRowCount();
  const pageCount = Math.max(1, table.getPageCount());
  const pageStart = Math.max(0, Math.min(pageIndex - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);
  const firstRow = rows.length ? pageIndex * pageSize + 1 : 0;
  const lastRow = Math.min((pageIndex + 1) * pageSize, contractCount);

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

  useLayoutEffect(() => {
    if (pageIndex >= pageCount) table.setPageIndex(pageCount - 1);
  }, [pageCount, pageIndex, table]);

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
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </div>
      <Table className="min-w-260 table-fixed border-y border-border/60" aria-label="Contracts">
        <colgroup>
          {table.getAllLeafColumns().map((column) => (
            <col key={column.id} className={column.columnDef.meta?.widthClassName} />
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
                {row.getAllCells().map((cell) => (
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
              <TableCell colSpan={contractColumns.length} className="h-24 text-center text-muted-foreground">
                {contracts.length ? "No contracts match your filters." : "No contracts yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <footer className="flex min-h-12.25 shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-12.25 sm:py-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="tabular-nums" aria-live="polite">
            {firstRow} – {lastRow} of {contractCount} contracts
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
                aria-label="Contracts per page"
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
        <Pagination aria-label="Contract pages" className="mx-0 w-auto">
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

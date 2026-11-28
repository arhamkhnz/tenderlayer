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

import { DataTablePagination } from "../../../-components/shared/records/data-table-pagination";
import type { Invoice } from "../data";
import { invoiceColumns, invoiceTableFeatures } from "./invoice-columns";

export function InvoicesTable({ records }: { records: Invoice[] }) {
  const searchInput = useRef<HTMLInputElement>(null);
  const table = useTable({
    features: invoiceTableFeatures,
    data: records,
    columns: invoiceColumns,
    getRowId: (record) => record.id,
    autoResetPageIndex: false,
    getColumnCanGlobalFilter: (column) => column.id === "invoice",
    globalFilterFn: ({ original }, _columnId, query) =>
      Object.values(original).join(" ").toLowerCase().includes(String(query).trim().toLowerCase()),
  });

  const search = String(table.state.globalFilter ?? "");
  const status = String(table.getColumn("status")?.getFilterValue() ?? "all");
  const { pageIndex, pageSize } = table.state.pagination;
  const rows = table.getRowModel().rows;
  const pageCount = Math.max(1, table.getPageCount());
  const statusOptions = [
    { value: "all", label: "All statuses" },
    ...Array.from(new Set(records.map((record) => record.status)), (value) => ({ value, label: value })),
  ];

  useLayoutEffect(() => {
    if (pageIndex >= pageCount) table.setPageIndex(pageCount - 1);
  }, [pageCount, pageIndex, table]);

  return (
    <section
      aria-label="Invoices list"
      className="flex min-h-0 min-w-0 flex-1 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 max-w-full bg-background **:data-[slot=input-group-control]:h-7 dark:bg-background">
          <InputGroupInput
            ref={searchInput}
            type="text"
            value={search}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
              table.firstPage();
            }}
            placeholder="Search invoices…"
            aria-label="Search invoices"
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
        <Select
          items={statusOptions}
          value={status}
          onValueChange={(value) => {
            table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
            table.firstPage();
          }}
        >
          <SelectTrigger
            size="sm"
            className="ml-auto w-36 bg-background dark:bg-background"
            aria-label="Filter invoices by status"
          >
            <SelectValue className="font-450" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end" className="font-450">
            <SelectGroup>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table className="min-w-260 border-y border-border/60" aria-label="Invoices">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="border-border/60 hover:bg-transparent">
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground first:w-14 first:min-w-14 first:px-0 last:border-r-0"
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
                    className={cn(
                      "h-12 border-r border-border/50 px-4.5 py-2 first:px-0 last:border-r-0",
                      cell.column.columnDef.meta?.numeric && "text-right font-mono tabular-nums",
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                {records.length ? "No invoices match your filters." : "No invoices yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination
        label="invoices"
        rowCount={table.getRowCount()}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(page) => table.setPageIndex(page)}
        onPageSizeChange={(size) => table.setPagination({ pageIndex: 0, pageSize: size })}
      />
    </section>
  );
}

import { ChevronLeftIcon, ChevronRightIcon, Columns3Icon, DownloadIcon, SearchIcon } from "@keyline-icons/react";
import { useMemo, useState } from "react";
import {
  useTable,
  type ColumnVisibilityState,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table";

import { Button } from "@tenderlayer/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tenderlayer/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@tenderlayer/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tenderlayer/ui/components/tabs";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

import { paymentColumns, paymentColumnLabels } from "./payments/payment-columns";
import {
  getSamplePayments,
  paymentDateFormatter,
  paymentDirectionOptions,
  paymentStatusOptions,
} from "./payments/payment-data";
import { getPaymentMonthRange, type PaymentDateRange, type PaymentPeriod } from "./payments/payment-date-range";
import { PaymentPeriodFilter } from "./payments/payment-period-filter";
import { paymentTableFeatures } from "./payments/payment-table-features";

const pageSizes = [10, 25, 50, 100].map((size) => ({ value: String(size), label: String(size) }));

export function PaymentsOverview({ today }: { today: Date }) {
  const [period, setPeriod] = useState<PaymentPeriod>("this-month");
  const [dateRange, setDateRange] = useState<PaymentDateRange>(() => getPaymentMonthRange(today, "this-month"));
  const [direction, setDirection] = useState("collect");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const data = useMemo(() => getSamplePayments(today), [today]);

  const table = useTable({
    features: paymentTableFeatures,
    data,
    columns: paymentColumns,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    state: { rowSelection, columnVisibility, pagination },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  const categories = [
    { value: "all", label: "All categories" },
    ...Array.from(new Set(data.map((item) => item.category))).map((value) => ({ value, label: value })),
  ];
  const rows = table.getRowModel().rows;
  const paymentCount = data.length;
  const selectedCount = table.getSelectedRowModel().rows.length;
  const pageCount = Math.max(1, table.getPageCount());
  const currentPage = table.state.pagination.pageIndex;
  const pageStart = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);
  const firstRow = paymentCount ? currentPage * table.state.pagination.pageSize + 1 : 0;
  const lastRow = Math.min((currentPage + 1) * table.state.pagination.pageSize, paymentCount);
  const toCollect = data.filter((item) => item.direction === "collect").reduce((sum, item) => sum + item.amount, 0);
  const toPay = data.filter((item) => item.direction === "pay").reduce((sum, item) => sum + item.amount, 0);

  function exportCsv() {
    const exportPayments = selectedCount ? table.getSelectedRowModel().rows.map((row) => row.original) : data;
    const records = [
      ["Particulars", "Reference", "Direction", "Category", "Due date", "Status", "Amount (INR)"],
      ...exportPayments.map((item) => [
        item.name,
        item.id,
        item.direction === "collect" ? "To collect" : "To pay",
        item.category,
        paymentDateFormatter.format(item.dueDate),
        item.status,
        item.amount,
      ]),
    ];
    const csv = records
      .map((record) => record.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle className="leading-none text-muted-foreground font-normal">Payments overview</CardTitle>
        <CardDescription className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span>
            <span className="text-xl font-medium tracking-tighter text-foreground tabular-nums">
              ₹{formatCompactNumber(direction === "collect" ? toCollect : toPay)}
            </span>{" "}
            {direction === "collect" ? "to collect" : "to pay"}
          </span>
        </CardDescription>
        <CardAction>
          <Button variant="outline" onClick={exportCsv} disabled={paymentCount === 0}>
            <DownloadIcon data-icon="inline-start" />
            {selectedCount ? `Export ${selectedCount} selected` : "Export CSV"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs
          value={direction}
          onValueChange={(value) => {
            if (typeof value === "string") {
              setDirection(value);
            }
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <TabsList aria-label="Payment direction">
                {paymentDirectionOptions.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <PaymentPeriodFilter
                today={today}
                value={period}
                range={dateRange}
                onChange={(value, range) => {
                  setPeriod(value);
                  setDateRange(range);
                }}
              />
              <Select
                items={paymentStatusOptions}
                value={status}
                onValueChange={(value) => {
                  if (value) setStatus(value);
                }}
              >
                <SelectTrigger aria-label="Filter payment status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  <SelectGroup>
                    {paymentStatusOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value} className="pr-8">
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                items={categories}
                value={category}
                onValueChange={(value) => {
                  if (value) setCategory(value);
                }}
              >
                <SelectTrigger aria-label="Filter payment category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-max" alignItemWithTrigger={false} align="start">
                  <SelectGroup>
                    {categories.map((item) => (
                      <SelectItem key={item.value} value={item.value} className="pr-8">
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <InputGroup className="w-52">
                <InputGroupAddon>
                  <SearchIcon aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  aria-label="Search payments"
                  placeholder="Search name or reference…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </InputGroup>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="icon" />}
                  aria-label="Choose payment columns"
                >
                  <Columns3Icon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                          {paymentColumnLabels[column.id] ?? column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value={direction}>
            <Table className="min-w-220" aria-label="Payments overview">
              <TableHeader className="border-t">
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id} className="bg-muted hover:bg-muted">
                    {group.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-10 px-4 font-[450] text-muted-foreground first:w-10 first:pr-0"
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
                    <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="h-12 px-4 py-3 first:w-10 first:pr-0">
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
                      No payments yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-3 border-t">
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              items={pageSizes}
              value={String(table.state.pagination.pageSize)}
              onValueChange={(value) => {
                if (value) table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-16" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" alignItemWithTrigger={false}>
                <SelectGroup>
                  {pageSizes.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="pr-8">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <span aria-live="polite">
            {selectedCount ? `${selectedCount} selected · ` : ""}
            {firstRow}–{lastRow} of {paymentCount} payments
          </span>
        </div>
        <nav aria-label="Payment pages" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          {pages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "secondary" : "ghost"}
              size="icon"
              aria-label={`Page ${page + 1}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </nav>
      </CardFooter>
    </Card>
  );
}

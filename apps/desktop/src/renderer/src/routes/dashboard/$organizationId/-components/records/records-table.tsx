import { useState, type ComponentType, type ReactNode } from "react";

import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, type IconProps } from "@keyline-icons/react";
import { cn } from "cn";

import { Button } from "@tenderlayer/ui/components/button";
import { Checkbox } from "@tenderlayer/ui/components/checkbox";
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

import { pageSizeOptions } from "@/lib/data-table-constants";

export type RecordColumn<T> = {
  id: string;
  label: string;
  icon?: ComponentType<IconProps>;
  numeric?: boolean;
  cell: (record: T) => ReactNode;
};

export function RecordsTable<T extends { id: string; status: string }>({
  records,
  columns,
  label,
  searchText,
}: {
  records: T[];
  columns: RecordColumn<T>[];
  label: string;
  searchText: (record: T) => string;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const query = search.trim().toLowerCase();
  const filtered = records.filter(
    (record) => (status === "all" || record.status === status) && searchText(record).toLowerCase().includes(query),
  );
  const statuses = [
    { value: "all", label: "All statuses" },
    ...Array.from(new Set(records.map((record) => record.status))).map((value) => ({ value, label: value })),
  ];
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const start = currentPage * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  const selectedCount = visible.filter((record) => selectedIds.has(record.id)).length;
  const allSelected = visible.length > 0 && selectedCount === visible.length;
  const pageStart = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);

  return (
    <section
      aria-label={`${label} list`}
      className="flex min-h-0 min-w-0 flex-1 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 max-w-full bg-background **:data-[slot=input-group-control]:h-7 dark:bg-background">
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPageIndex(0);
            }}
            placeholder={`Search ${label.toLowerCase()}…`}
            aria-label={`Search ${label.toLowerCase()}`}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <Select
          items={statuses}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value);
              setPageIndex(0);
            }
          }}
        >
          <SelectTrigger
            size="sm"
            className="w-36 bg-background dark:bg-background"
            aria-label={`Filter ${label.toLowerCase()} by status`}
          >
            <SelectValue className="font-450" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end" className="font-450">
            <SelectGroup>
              {statuses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table className="min-w-260 border-y border-border/60" aria-label={label}>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="h-10 w-14 min-w-14 border-r border-border/50 px-0">
              <Checkbox
                className="mx-auto"
                checked={allSelected}
                indeterminate={selectedCount > 0 && !allSelected}
                disabled={!visible.length}
                aria-label={`Select all ${label.toLowerCase()} on this page`}
                onCheckedChange={(checked) =>
                  setSelectedIds((current) => {
                    const next = new Set(current);
                    for (const record of visible) {
                      if (checked) next.add(record.id);
                      else next.delete(record.id);
                    }
                    return next;
                  })
                }
              />
            </TableHead>
            {columns.map(({ id, label: columnLabel, icon: Icon, numeric }) => (
              <TableHead
                key={id}
                className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground last:border-r-0"
              >
                <div className={cn("flex items-center gap-2", numeric && "justify-end")}>
                  {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
                  {columnLabel}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((record) => (
            <TableRow key={record.id} className="border-border/60 hover:bg-muted/30">
              <TableCell className="h-12 w-14 min-w-14 border-r border-border/50 px-0 py-2">
                <Checkbox
                  className="mx-auto"
                  checked={selectedIds.has(record.id)}
                  aria-label={`Select ${record.id}`}
                  onCheckedChange={(checked) =>
                    setSelectedIds((current) => {
                      const next = new Set(current);
                      if (checked) next.add(record.id);
                      else next.delete(record.id);
                      return next;
                    })
                  }
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    "h-12 border-r border-border/50 px-4.5 py-2 last:border-r-0",
                    column.numeric && "text-right font-mono tabular-nums",
                  )}
                >
                  {column.cell(record)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!visible.length && (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                {records.length ? `No ${label.toLowerCase()} match your filters.` : `No ${label.toLowerCase()} yet.`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <footer className="flex min-h-12.25 shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-12.25 sm:py-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="tabular-nums" aria-live="polite">
            {filtered.length ? start + 1 : 0} – {Math.min(start + pageSize, filtered.length)} of {filtered.length}{" "}
            {label.toLowerCase()}
          </span>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              items={pageSizeOptions}
              value={String(pageSize)}
              onValueChange={(value) => {
                if (value) {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }
              }}
            >
              <SelectTrigger
                size="sm"
                className="w-16 bg-background dark:bg-background"
                aria-label={`${label} per page`}
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
        <nav aria-label={`${label} pages`} className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={currentPage === 0}
            onClick={() => setPageIndex(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          {pages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label={`Page ${page + 1}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPageIndex(currentPage + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </nav>
      </footer>
    </section>
  );
}

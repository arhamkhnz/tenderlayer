import { ChevronLeftIcon, ChevronRightIcon } from "@keyline-icons/react";

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

import { pageSizeOptions } from "@/lib/data-table-constants";

export function DataTablePagination({
  label,
  rowCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  label: string;
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize));
  const pageStart = Math.max(0, Math.min(pageIndex - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);
  const firstRow = rowCount > pageIndex * pageSize ? pageIndex * pageSize + 1 : 0;
  const lastRow = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <footer className="flex min-h-12.25 shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-12.25 sm:py-0">
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
        <span className="tabular-nums" aria-live="polite">
          {firstRow} – {lastRow} of {rowCount} {label}
        </span>
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <Select
            items={pageSizeOptions}
            value={String(pageSize)}
            disabled={!onPageSizeChange}
            onValueChange={(value) => {
              if (value) {
                onPageSizeChange?.(Number(value));
              }
            }}
          >
            <SelectTrigger size="sm" className="w-16 bg-background dark:bg-background" aria-label={`${label} per page`}>
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
      <Pagination aria-label={`${label} pages`} className="mx-0 w-auto">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              variant="outline"
              size="icon-sm"
              text=""
              aria-label="Previous page"
              disabled={!onPageChange || pageIndex === 0}
              onClick={() => onPageChange?.(pageIndex - 1)}
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
                disabled={!onPageChange}
                onClick={() => onPageChange?.(page)}
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
              disabled={!onPageChange || pageIndex >= pageCount - 1}
              onClick={() => onPageChange?.(pageIndex + 1)}
            >
              <ChevronRightIcon />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </footer>
  );
}

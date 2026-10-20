import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HashIcon,
  IndianRupeeIcon,
  SearchIcon,
  TagIcon,
} from "@keyline-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "cn";

import { Badge } from "@tenderlayer/ui/components/badge";
import { Button } from "@tenderlayer/ui/components/button";
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

type ContractRecord = {
  id: string;
  name: string;
  reference: string;
  authority: string;
  status: string;
  value: string;
  endDate: string;
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  "Ending soon": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const columns = [
  { label: "Contract", icon: BriefcaseIcon },
  { label: "Reference", icon: HashIcon },
  { label: "Authority" },
  { label: "Status", icon: TagIcon },
  { label: "Value", icon: IndianRupeeIcon, right: true },
  { label: "Ends", icon: CalendarIcon, right: true },
];

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({ value: String(size), label: String(size) }));

export function ContractsTable({ contracts }: { contracts: ContractRecord[] }) {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.max(1, Math.ceil(contracts.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const start = currentPage * pageSize;
  const visibleContracts = contracts.slice(start, start + pageSize);
  const pageStart = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);
  const statuses = [
    { value: "all", label: "All statuses" },
    ...Object.keys(statusColors).map((value) => ({ value, label: value })),
  ];
  const authorities = [
    { value: "all", label: "All authorities" },
    ...Array.from(new Set(contracts.map((contract) => contract.authority))).map((value) => ({ value, label: value })),
  ];

  return (
    <section
      aria-label="Contracts list"
      className="flex min-h-0 min-w-0 flex-1 flex-col [&>[data-slot=table-container]]:min-h-0 [&>[data-slot=table-container]]:flex-1 [&>[data-slot=table-container]]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 bg-background [&_[data-slot=input-group-control]]:h-7 dark:bg-background">
          <InputGroupInput type="search" placeholder="Search contracts…" aria-label="Search contracts" />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-wrap items-center gap-2">
          <Select items={statuses} defaultValue="all">
            <SelectTrigger
              size="sm"
              className="w-36 bg-background dark:bg-background"
              aria-label="Filter contract status"
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
          <Select items={authorities} defaultValue="all">
            <SelectTrigger
              size="sm"
              className="w-44 bg-background dark:bg-background"
              aria-label="Filter contract authority"
            >
              <SelectValue className="font-450" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="end" className="min-w-max font-450">
              <SelectGroup>
                {authorities.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="min-w-260 border-y border-border/60" aria-label="Contracts">
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            {columns.map(({ label, icon: Icon, right }) => (
              <TableHead
                key={label}
                className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground last:border-r-0"
              >
                <div className={cn("flex items-center gap-2", right && "justify-end")}>
                  {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                  {label}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleContracts.map((contract) => (
            <TableRow key={contract.id} className="border-border/60 hover:bg-muted/30">
              <TableCell className="h-12 border-r border-border/50 px-4.5 py-2">
                <Link
                  to="/dashboard/contracts/$contractId"
                  params={{ contractId: contract.id }}
                  className="flex w-fit items-center gap-2.5 rounded-sm font-450 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {contract.name}
                </Link>
              </TableCell>
              <TableCell className="border-r border-border/50 px-4.5 py-2 font-mono text-xs text-muted-foreground">
                {contract.reference}
              </TableCell>
              <TableCell className="border-r border-border/50 px-4.5 py-2">{contract.authority}</TableCell>
              <TableCell className="border-r border-border/50 px-4.5 py-2">
                <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", statusColors[contract.status])}>
                  {contract.status}
                </Badge>
              </TableCell>
              <TableCell className="border-r border-border/50 px-4.5 py-2 text-right font-450 tabular-nums">
                {contract.value}
              </TableCell>
              <TableCell className="px-4.5 py-2 text-right text-muted-foreground tabular-nums">
                {contract.endDate}
              </TableCell>
            </TableRow>
          ))}
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No contracts yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <footer className="flex min-h-[49px] shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-[49px] sm:py-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="tabular-nums" aria-live="polite">
            {contracts.length ? start + 1 : 0} – {Math.min(start + pageSize, contracts.length)} of {contracts.length}{" "}
            contracts
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
        <nav aria-label="Contract pages" className="flex items-center gap-1">
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

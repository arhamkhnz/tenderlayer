import {
  BriefcaseIcon,
  Building,
  ChevronLeftIcon,
  ChevronRightIcon,
  HashIcon,
  IndianRupeeIcon,
  SearchIcon,
} from "@keyline-icons/react";
import { useState } from "react";

import { Badge } from "@tenderlayer/ui/components/badge";
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

type DepartmentRecord = {
  id: string;
  name: string;
  code: string;
  activeContractCount?: number;
  activeContractValue?: number;
};

const columns = [
  { label: "Department", icon: Building },
  { label: "Code", icon: HashIcon },
  { label: "Active contracts", icon: BriefcaseIcon },
  { label: "Active contract value", icon: IndianRupeeIcon },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({ value: String(size), label: String(size) }));

export function DepartmentsTable({ departments }: { departments: DepartmentRecord[] }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredDepartments = departments.filter((department) =>
    `${department.name} ${department.code}`.toLowerCase().includes(query),
  );
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const pageCount = Math.max(1, Math.ceil(filteredDepartments.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const start = currentPage * pageSize;
  const visibleDepartments = filteredDepartments.slice(start, start + pageSize);
  const selectedCount = visibleDepartments.filter((department) => selectedIds.has(department.id)).length;
  const allSelected = visibleDepartments.length > 0 && selectedCount === visibleDepartments.length;
  const pageStart = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);

  return (
    <section
      aria-label="Departments list"
      className="flex min-h-0 min-w-0 flex-1 flex-col [&>[data-slot=table-container]]:min-h-0 [&>[data-slot=table-container]]:flex-1 [&>[data-slot=table-container]]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 bg-background [&_[data-slot=input-group-control]]:h-7 dark:bg-background">
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPageIndex(0);
            }}
            placeholder="Search departments…"
            aria-label="Search departments"
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Table className="min-w-200 table-fixed border-y border-border/60" aria-label="Departments">
        <colgroup>
          <col className="w-14" />
          <col />
          <col className="w-32 lg:w-40" />
          <col className="w-48" />
          <col className="w-52" />
        </colgroup>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="h-10 w-14 border-r border-border/50 px-2.5 [&:has([role=checkbox])]:pr-2.5">
              <Checkbox
                className="mx-auto"
                aria-label="Select all departments on this page"
                checked={allSelected}
                indeterminate={selectedCount > 0 && !allSelected}
                disabled={visibleDepartments.length === 0}
                onCheckedChange={(checked) =>
                  setSelectedIds((current) => {
                    const next = new Set(current);
                    for (const department of visibleDepartments) {
                      if (checked) next.add(department.id);
                      else next.delete(department.id);
                    }
                    return next;
                  })
                }
              />
            </TableHead>
            {columns.map(({ label, icon: Icon }) => (
              <TableHead
                key={label}
                className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground last:border-r-0"
              >
                <div className="flex items-center gap-2">
                  {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                  {label}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleDepartments.map((department) => (
            <TableRow key={department.id} className="border-border/60 hover:bg-muted/30">
              <TableCell className="h-12 w-14 border-r border-border/50 px-2.5 py-2 [&:has([role=checkbox])]:pr-2.5">
                <Checkbox
                  className="mx-auto"
                  aria-label={`Select ${department.name}`}
                  checked={selectedIds.has(department.id)}
                  onCheckedChange={(checked) =>
                    setSelectedIds((current) => {
                      const next = new Set(current);
                      if (checked) next.add(department.id);
                      else next.delete(department.id);
                      return next;
                    })
                  }
                />
              </TableCell>
              <TableCell className="h-12 border-r border-border/50 px-4.5 py-2">
                <span className="block truncate font-450" title={department.name}>
                  {department.name}
                </span>
              </TableCell>
              <TableCell className="border-r border-border/50 px-4.5 py-2">
                {department.code ? (
                  <Badge variant="outline" className="rounded-md font-mono">
                    {department.code}
                  </Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="border-r border-border/50 px-4.5 py-2 tabular-nums">
                {department.activeContractCount === undefined ? (
                  <span className="text-muted-foreground" aria-label="Active contract count unavailable">
                    —
                  </span>
                ) : (
                  <span className="font-mono">{department.activeContractCount}</span>
                )}
              </TableCell>
              <TableCell className="px-4.5 py-2 font-mono tabular-nums">
                {department.activeContractValue === undefined ? (
                  <span className="text-muted-foreground" aria-label="Active contract value unavailable">
                    —
                  </span>
                ) : (
                  currencyFormatter.format(department.activeContractValue)
                )}
              </TableCell>
            </TableRow>
          ))}
          {filteredDepartments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                {departments.length ? "No departments match your search." : "No departments yet."}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <footer className="flex min-h-[49px] shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-[49px] sm:py-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="tabular-nums" aria-live="polite">
            {filteredDepartments.length ? start + 1 : 0} – {Math.min(start + pageSize, filteredDepartments.length)} of{" "}
            {filteredDepartments.length} departments
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
        <nav aria-label="Department pages" className="flex items-center gap-1">
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

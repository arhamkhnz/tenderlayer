import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@keyline-icons/react";
import { cn } from "cn";
import { useState } from "react";

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

import { employeeColumns, type Employee } from "./employee-columns";

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({ value: String(size), label: String(size) }));

export function EmployeeDataTable({ data }: { data: Employee[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const selectedCount = data.filter((employee) => selectedIds.has(employee.id)).length;
  const allSelected = data.length > 0 && selectedCount === data.length;
  const filters = [
    { key: "contract", label: "All contracts", width: "w-48" },
    { key: "status", label: "All statuses", width: "w-36" },
    { key: "location", label: "All locations", width: "w-36" },
  ] as const;

  return (
    <section
      aria-label="Employees list"
      className="flex min-h-0 min-w-0 flex-1 flex-col [&>[data-slot=table-container]]:min-h-0 [&>[data-slot=table-container]]:flex-1 [&>[data-slot=table-container]]:overflow-auto"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="h-7 w-64 bg-background [&_[data-slot=input-group-control]]:h-7 dark:bg-background">
          <InputGroupInput type="search" placeholder="Search employees…" aria-label="Search employees" />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const items = [
              { value: "all", label: filter.label },
              ...Array.from(new Set(data.map((employee) => employee[filter.key]))).map((value) => ({
                value,
                label: value,
              })),
            ];
            return (
              <Select key={filter.key} items={items} defaultValue="all">
                <SelectTrigger
                  size="sm"
                  className={cn(filter.width, "bg-background dark:bg-background")}
                  aria-label={`Filter employees by ${filter.key}`}
                >
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
            );
          })}
        </div>
      </div>
      <Table className="min-w-260 border-y border-border/60" aria-label="Employees">
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="h-10 w-14 border-r border-border/50 px-2.5 [&:has([role=checkbox])]:pr-2.5">
              <Checkbox
                className="mx-auto"
                aria-label="Select all employees"
                checked={allSelected}
                indeterminate={selectedCount > 0 && !allSelected}
                disabled={data.length === 0}
                onCheckedChange={(checked) =>
                  setSelectedIds(new Set(checked ? data.map((employee) => employee.id) : []))
                }
              />
            </TableHead>
            {employeeColumns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground last:border-r-0",
                  column.id === "actions" && "w-14 px-2.5",
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((employee) => (
            <TableRow key={employee.id} className="border-border/60 hover:bg-muted/30">
              <TableCell className="h-12 w-14 border-r border-border/50 px-2.5 py-2 [&:has([role=checkbox])]:pr-2.5">
                <Checkbox
                  className="mx-auto"
                  aria-label={`Select ${employee.name}`}
                  checked={selectedIds.has(employee.id)}
                  onCheckedChange={(checked) =>
                    setSelectedIds((current) => {
                      const next = new Set(current);
                      if (checked) next.add(employee.id);
                      else next.delete(employee.id);
                      return next;
                    })
                  }
                />
              </TableCell>
              {employeeColumns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    "h-12 border-r border-border/50 px-4.5 py-2 last:border-r-0",
                    column.id === "actions" && "w-14 px-2.5",
                  )}
                >
                  {column.cell(employee)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={employeeColumns.length + 1} className="h-24 text-center text-muted-foreground">
                No employees yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <footer className="flex min-h-[49px] shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-sm sm:h-[49px] sm:py-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="tabular-nums" aria-live="polite">
            {data.length ? 1 : 0} – {data.length} of {data.length} employees
          </span>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select items={pageSizeOptions} defaultValue="10">
              <SelectTrigger
                size="sm"
                className="w-16 bg-background dark:bg-background"
                aria-label="Employees per page"
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
        <nav aria-label="Employee pages" className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled>
            <ChevronLeftIcon />
          </Button>
          <Button variant="secondary" size="icon-sm" aria-label="Page 1" aria-current="page">
            1
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Next page" disabled>
            <ChevronRightIcon />
          </Button>
        </nav>
      </footer>
    </section>
  );
}

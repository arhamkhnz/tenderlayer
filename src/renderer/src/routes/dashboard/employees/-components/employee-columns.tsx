import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsDownUpIcon,
  BriefcaseIcon,
  CalendarBlankIcon,
  CurrencyInrIcon,
  IdentificationBadgeIcon,
  ListBulletsIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { createColumnHelper, type Column } from "@tanstack/react-table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { EmployeeTableFeatures } from "./employee-data-table-features";

export type Employee = {
  id: string;
  initials: string;
  name: string;
  role: string;
  contract: string;
  location: string;
  status: string;
  monthlyPay: number;
  joiningDate: string;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function EmployeeColumnHeader<TValue>({
  column,
  icon: HeaderIcon,
  title,
}: {
  column: Column<EmployeeTableFeatures, Employee, TValue>;
  icon: Icon;
  title: string;
}) {
  const sortDirection = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-2"
      onClick={() => column.toggleSorting(sortDirection === "asc")}
    >
      <HeaderIcon data-icon="inline-start" />
      {title}
      {sortDirection ? <ArrowsDownUpIcon data-icon="inline-end" weight="bold" /> : null}
    </Button>
  );
}

const columnHelper = createColumnHelper<EmployeeTableFeatures, Employee>();

export const employeeColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    enableHiding: false,
    filterFn: "includesString",
    sortFn: "text",
    header: ({ column }) => <EmployeeColumnHeader column={column} icon={UserIcon} title="Employee" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback>{row.original.initials}</AvatarFallback>
        </Avatar>
        <Link
          to="/dashboard/employees/$employeeId"
          params={{ employeeId: row.original.id }}
          className="font-medium hover:underline"
        >
          {row.original.name}
        </Link>
      </div>
    ),
    footer: ({ table }) => {
      const visibleEmployees = table.getFilteredRowModel().rows.length;

      return (
        <span className="flex items-center gap-2 text-muted-foreground">
          <ListBulletsIcon className="size-4" aria-hidden="true" />
          Total: {visibleEmployees} employees
        </span>
      );
    },
  }),
  columnHelper.accessor("role", {
    sortFn: "text",
    header: ({ column }) => <EmployeeColumnHeader column={column} icon={IdentificationBadgeIcon} title="Role" />,
    footer: ({ table }) => {
      const roles = new Set(table.getFilteredRowModel().rows.map((row) => row.original.role));
      return <span className="text-muted-foreground">{roles.size} roles</span>;
    },
  }),
  columnHelper.accessor("contract", {
    sortFn: "text",
    header: ({ column }) => <EmployeeColumnHeader column={column} icon={BriefcaseIcon} title="Contract" />,
    footer: ({ table }) => {
      const contracts = new Set(table.getFilteredRowModel().rows.map((row) => row.original.contract));
      return <span className="text-muted-foreground">{contracts.size} contracts</span>;
    },
  }),
  columnHelper.accessor("monthlyPay", {
    header: ({ column }) => <EmployeeColumnHeader column={column} icon={CurrencyInrIcon} title="Monthly pay" />,
    cell: ({ getValue }) => <span className="font-mono tabular-nums">{currencyFormatter.format(getValue())}</span>,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.monthlyPay, 0);

      return <span className="font-mono text-muted-foreground tabular-nums">Sum: {currencyFormatter.format(total)}</span>;
    },
  }),
  columnHelper.accessor("joiningDate", {
    sortFn: "text",
    header: ({ column }) => <EmployeeColumnHeader column={column} icon={CalendarBlankIcon} title="Joining date" />,
    cell: ({ getValue }) => <span className="tabular-nums">{dateFormatter.format(new Date(`${getValue()}T00:00:00`))}</span>,
    footer: ({ table }) => (
      <span className="text-muted-foreground">{table.getFilteredRowModel().rows.length} records shown</span>
    ),
  }),
]);

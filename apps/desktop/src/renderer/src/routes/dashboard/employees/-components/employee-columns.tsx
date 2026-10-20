import type { ComponentType, CSSProperties, ReactNode } from "react";
import {
  BinIcon,
  BriefcaseIcon,
  EyeIcon,
  IdBadgeIcon,
  IndianRupeeIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  TagIcon,
  UserIcon,
  type IconProps,
} from "@keyline-icons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { Badge } from "@tenderlayer/ui/components/badge";
import { Button } from "@tenderlayer/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";
import { getAvatarColors } from "@tenderlayer/ui/lib/avatar-colors";
import { getInitials } from "@tenderlayer/ui/lib/utils";

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

type EmployeeColumn = {
  id: string;
  header: ReactNode;
  cell: (employee: Employee) => ReactNode;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "On leave": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

function EmployeeColumnHeader({
  icon: Icon,
  title,
  right = false,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  right?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", right && "justify-end")}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {title}
    </div>
  );
}

function EmployeeAvatar({ name }: { name: string }) {
  const colors = getAvatarColors(name);

  return (
    <div
      aria-hidden="true"
      className="size-4.5 shrink-0 grid place-items-center text-xs font-mono rounded-sm bg-(--avatar-bg) text-(--avatar-fg) ring-1 ring-inset ring-(--avatar-outline) dark:bg-(--avatar-dark-bg) dark:text-(--avatar-dark-fg) dark:ring-(--avatar-dark-outline)"
      style={
        {
          "--avatar-bg": colors.light.background,
          "--avatar-fg": colors.light.foreground,
          "--avatar-outline": colors.light.outline,
          "--avatar-dark-bg": colors.dark.background,
          "--avatar-dark-fg": colors.dark.foreground,
          "--avatar-dark-outline": colors.dark.outline,
        } as CSSProperties
      }
    >
      {getInitials(name, 1)}
    </div>
  );
}

export const employeeColumns: EmployeeColumn[] = [
  {
    id: "name",
    header: <EmployeeColumnHeader icon={UserIcon} title="Employee" />,
    cell: (employee) => (
      <div className="flex items-center gap-2.5">
        <EmployeeAvatar name={employee.name} />
        <Link
          to="/dashboard/employees/$employeeId"
          params={{ employeeId: employee.id }}
          className="rounded-sm font-450 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          {employee.name}
        </Link>
      </div>
    ),
  },
  { id: "role", header: <EmployeeColumnHeader icon={IdBadgeIcon} title="Role" />, cell: (employee) => employee.role },
  {
    id: "contract",
    header: <EmployeeColumnHeader icon={BriefcaseIcon} title="Contract" />,
    cell: (employee) => employee.contract,
  },
  {
    id: "location",
    header: <EmployeeColumnHeader icon={MapPinIcon} title="Location" />,
    cell: (employee) => employee.location,
  },
  {
    id: "status",
    header: <EmployeeColumnHeader icon={TagIcon} title="Status" />,
    cell: (employee) => (
      <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", statusColors[employee.status])}>
        {employee.status}
      </Badge>
    ),
  },
  {
    id: "monthlyPay",
    header: <EmployeeColumnHeader icon={IndianRupeeIcon} title="Monthly pay" right />,
    cell: (employee) => (
      <div className="text-right font-450 tabular-nums">{currencyFormatter.format(employee.monthlyPay)}</div>
    ),
  },
  {
    id: "actions",
    header: null,
    cell: (employee) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${employee.name}`} />}
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 font-450">
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link to="/dashboard/employees/$employeeId" params={{ employeeId: employee.id }} />}
              >
                <EyeIcon aria-hidden="true" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PenLineIcon aria-hidden="true" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <BinIcon aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

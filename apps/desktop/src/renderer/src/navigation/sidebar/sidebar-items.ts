import {
  BanknoteIcon,
  BuildingsIcon,
  FileIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
  type IconProps,
} from "@keyline-icons/react";
import type { ComponentType } from "react";

import type { FileRouteTypes } from "@/routeTree.gen";

export interface NavItem {
  id: string;
  title: string;
  url: Exclude<FileRouteTypes["to"], `${string}$${string}`>;
  icon: ComponentType<IconProps>;
  exact?: boolean;
}

export interface NavGroup {
  id: string;
  label?: string;
  items: readonly NavItem[];
}

export const sidebarItems = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "overview", title: "Overview", url: "/dashboard", icon: BuildingsIcon, exact: true },
      { id: "contracts", title: "Contracts", url: "/dashboard/contracts", icon: FileIcon },
      { id: "employees", title: "Employees", url: "/dashboard/employees", icon: UsersIcon },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { id: "payroll", title: "Payroll", url: "/dashboard/payroll", icon: BanknoteIcon },
      { id: "invoices", title: "Invoices", url: "/dashboard/invoices", icon: ReceiptIcon },
    ],
  },
] as const satisfies readonly NavGroup[];

export const sidebarFooterItems = [
  { id: "organization", title: "Organization", url: "/dashboard/settings/organization", icon: SettingsIcon },
] as const satisfies readonly NavItem[];

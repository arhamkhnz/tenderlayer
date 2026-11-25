import type { ComponentType } from "react";

import {
  BanknoteIcon,
  BotIcon,
  BriefcaseIcon,
  BuildingsIcon,
  FileIcon,
  ReceiptIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
  type IconProps,
} from "@keyline-icons/react";

import type { FileRouteTypes } from "@/routeTree.gen";

export interface NavItem {
  id: string;
  title: string;
  url: Exclude<
    Extract<FileRouteTypes["to"], `/dashboard/$organizationId${string}`>,
    `/dashboard/$organizationId/${string}/$${string}`
  >;
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
      { id: "overview", title: "Overview", url: "/dashboard/$organizationId", icon: BuildingsIcon, exact: true },
      { id: "departments", title: "Departments", url: "/dashboard/$organizationId/departments", icon: BriefcaseIcon },
      { id: "contracts", title: "Contracts", url: "/dashboard/$organizationId/contracts", icon: FileIcon },
      { id: "employees", title: "Employees", url: "/dashboard/$organizationId/employees", icon: UsersIcon },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { id: "payroll", title: "Payroll", url: "/dashboard/$organizationId/payroll", icon: BanknoteIcon },
      { id: "invoices", title: "Invoices", url: "/dashboard/$organizationId/invoices", icon: ReceiptIcon },
      { id: "purchases", title: "Purchases", url: "/dashboard/$organizationId/purchases", icon: ShoppingBagIcon },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    items: [{ id: "agent", title: "Agent", url: "/dashboard/$organizationId/agent", icon: BotIcon }],
  },
] as const satisfies readonly NavGroup[];

export const sidebarFooterItems = [
  {
    id: "organization",
    title: "Organization",
    url: "/dashboard/$organizationId/settings/organization",
    icon: SettingsIcon,
  },
] as const satisfies readonly NavItem[];

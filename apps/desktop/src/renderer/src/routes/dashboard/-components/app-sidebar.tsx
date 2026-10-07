import { Link, useRouterState } from "@tanstack/react-router";
import {
  BankIcon,
  FileIcon,
  GearIcon,
  HouseIcon,
  MoneyIcon,
  ReceiptIcon,
  SquaresFourIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/dashboard", icon: SquaresFourIcon, exact: true },
      { label: "Contracts", to: "/dashboard/contracts", icon: FileIcon },
      { label: "Employees", to: "/dashboard/employees", icon: UsersThreeIcon },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", to: "/dashboard/invoices", icon: ReceiptIcon },
      { label: "Payroll", to: "/dashboard/payroll", icon: MoneyIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Organization",
        to: "/dashboard/settings/organization",
        icon: GearIcon,
      },
      { label: "Tax", to: "/dashboard/settings/tax", icon: BankIcon },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMac = window.electronAPI.platform === "darwin";

  return (
    <Sidebar collapsible="offcanvas" className={isMac ? "border-r-0!" : undefined}>
      {isMac ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 w-px bg-sidebar-border"
          style={{ top: "env(titlebar-area-height, 3rem)" }}
        />
      ) : null}
      <SidebarContent style={{ paddingTop: "calc(env(titlebar-area-height, 3rem) + 0.5rem)" }}>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {group.label === "Workspace" ? null : <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    "exact" in item
                      ? pathname === item.to || pathname === `${item.to}/`
                      : pathname === item.to || pathname.startsWith(`${item.to}/`);

                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton isActive={isActive} tooltip={item.label} render={<Link to={item.to} />}>
                        <item.icon weight="regular" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/welcome"} tooltip="Welcome" render={<Link to="/welcome" />}>
              <HouseIcon weight="regular" />
              <span>Welcome</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

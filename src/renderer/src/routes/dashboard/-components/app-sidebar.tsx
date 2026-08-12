import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building03Icon,
  DashboardSquare01Icon,
  File02Icon,
  Invoice01Icon,
  MoneyBag02Icon,
  Settings01Icon,
  TaxesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/dashboard", icon: DashboardSquare01Icon, exact: true },
      { label: "Contracts", to: "/dashboard/contracts", icon: File02Icon },
      { label: "Employees", to: "/dashboard/employees", icon: UserGroupIcon },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", to: "/dashboard/invoices", icon: Invoice01Icon },
      { label: "Payroll", to: "/dashboard/payroll", icon: MoneyBag02Icon },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Organization",
        to: "/dashboard/settings/organization",
        icon: Settings01Icon,
      },
      { label: "Tax", to: "/dashboard/settings/tax", icon: TaxesIcon },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader style={{ paddingTop: "calc(env(titlebar-area-height, 0px) + 0.5rem)" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="TenderLayer"
              render={<Link to="/dashboard" />}
            >
              <HugeiconsIcon icon={Building03Icon} strokeWidth={2} />
              <span className="font-semibold tracking-tight">TenderLayer</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = "exact" in item
                    ? pathname === item.to || pathname === `${item.to}/`
                    : pathname === item.to || pathname.startsWith(`${item.to}/`);

                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        render={<Link to={item.to} />}
                      >
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
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

      <SidebarRail />
    </Sidebar>
  );
}

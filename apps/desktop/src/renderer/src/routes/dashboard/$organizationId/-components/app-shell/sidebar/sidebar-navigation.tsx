import { Link, useParams, useRouterState } from "@tanstack/react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@tenderlayer/ui/components/sidebar";

import type { NavGroup, NavItem } from "./sidebar-items";

function isItemActive(pathname: string, item: NavItem, organizationId: string) {
  const url = item.url.replace("$organizationId", encodeURIComponent(organizationId));
  return pathname === url || pathname === `${url}/` || (!item.exact && pathname.startsWith(`${url}/`));
}

function SidebarNavigationItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="gap-1.5 text-xs"
        isActive={isActive}
        tooltip={item.title}
        render={
          <Link
            from="/dashboard/$organizationId"
            to={item.url}
            aria-label={item.title}
            aria-current={isActive ? "page" : undefined}
          />
        }
      >
        <Icon strokeWidth={1.75} />
        <span className="text-sm font-450">{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SidebarNavigation({ items }: { items: readonly NavGroup[] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { organizationId } = useParams({ from: "/dashboard/$organizationId" });

  return items.map((group) => (
    <SidebarGroup key={group.id} className="py-1">
      {group.label ? (
        <SidebarGroupLabel className="font-mono font-normal uppercase group-data-[collapsible=icon]:pointer-events-none">
          {group.label}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent className="text-xs">
        <SidebarMenu className="gap-px">
          {group.items.map((item) => (
            <SidebarNavigationItem key={item.id} item={item} isActive={isItemActive(pathname, item, organizationId)} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

export function SidebarFooterNavigation({ items }: { items: readonly NavItem[] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { organizationId } = useParams({ from: "/dashboard/$organizationId" });

  return (
    <SidebarMenu className="gap-px">
      {items.map((item) => (
        <SidebarNavigationItem key={item.id} item={item} isActive={isItemActive(pathname, item, organizationId)} />
      ))}
    </SidebarMenu>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@tenderlayer/ui/components/sidebar";
import type { NavGroup, NavItem } from "@/navigation/sidebar/sidebar-items";

function isItemActive(pathname: string, item: NavItem) {
  return pathname === item.url || pathname === `${item.url}/` || (!item.exact && pathname.startsWith(`${item.url}/`));
}

function SidebarNavigationItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="gap-1.5"
        isActive={isActive}
        tooltip={item.title}
        render={<Link to={item.url} aria-current={isActive ? "page" : undefined} />}
      >
        <Icon className="size-3.5" strokeWidth={1.75} />
        <span className="text-sm font-[450]">{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SidebarNavigation({ items }: { items: readonly NavGroup[] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return items.map((group) => (
    <SidebarGroup key={group.id}>
      {group.label ? <SidebarGroupLabel className="font-mono uppercase">{group.label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarNavigationItem key={item.id} item={item} isActive={isItemActive(pathname, item)} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

export function SidebarFooterNavigation({ items }: { items: readonly NavItem[] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarNavigationItem key={item.id} item={item} isActive={isItemActive(pathname, item)} />
      ))}
    </SidebarMenu>
  );
}

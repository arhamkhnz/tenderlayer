import { ChevronRightIcon } from "@keyline-icons/react";
import { Link, useLoaderData } from "@tanstack/react-router";

import { Avatar, AvatarFallback } from "@tenderlayer/ui/components/avatar";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@tenderlayer/ui/components/sidebar";

export function AppSidebarHeader() {
  const { organization } = useLoaderData({ from: "/dashboard" });
  const name = organization?.name ?? "TenderLayer";
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarHeader className="pb-3">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" render={<Link to="/dashboard/settings/organization" />}>
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate">{name}</span>
            <ChevronRightIcon className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

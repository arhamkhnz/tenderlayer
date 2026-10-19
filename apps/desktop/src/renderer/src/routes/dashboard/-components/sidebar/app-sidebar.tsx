import { useLoaderData } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { getAvatarColors } from "@tenderlayer/ui/lib/avatar-colors";
import { getInitials } from "@tenderlayer/ui/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@tenderlayer/ui/components/sidebar";
import { sidebarFooterItems, sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { SidebarFooterNavigation, SidebarNavigation } from "./sidebar-navigation";

export function AppSidebar() {
  const { organization } = useLoaderData({ from: "/dashboard" });
  const name = organization?.name ?? "TenderLayer";
  const avatarColors = getAvatarColors(name);

  return (
    <Sidebar collapsible="offcanvas" className="**:data-[slot=sidebar-inner]:pt-(--header-height)">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="gap-1.5 text-foreground hover:bg-transparent hover:text-foreground active:bg-transparent active:text-foreground data-open:hover:bg-transparent data-open:hover:text-foreground px-1.5">
              <div
                className="size-4.5 grid place-items-center text-xs font-mono rounded-sm bg-(--avatar-bg) text-(--avatar-fg) ring-1 ring-inset ring-(--avatar-outline) dark:bg-(--avatar-dark-bg) dark:text-(--avatar-dark-fg) dark:ring-(--avatar-dark-outline)"
                style={
                  {
                    "--avatar-bg": avatarColors.light.background,
                    "--avatar-fg": avatarColors.light.foreground,
                    "--avatar-outline": avatarColors.light.outline,
                    "--avatar-dark-bg": avatarColors.dark.background,
                    "--avatar-dark-fg": avatarColors.dark.foreground,
                    "--avatar-dark-outline": avatarColors.dark.outline,
                  } as CSSProperties
                }
              >
                {getInitials(name, 1)}
              </div>
              <span className="truncate text-sm tracking-tight font-[450]">{name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarFooterNavigation items={sidebarFooterItems} />
      </SidebarFooter>
    </Sidebar>
  );
}

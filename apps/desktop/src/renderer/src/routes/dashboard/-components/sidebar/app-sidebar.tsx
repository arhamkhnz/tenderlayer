import { ChevronsUpDownIcon, PlusIcon } from "@keyline-icons/react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";
import { sidebarFooterItems, sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { SidebarFooterNavigation, SidebarNavigation } from "./sidebar-navigation";

export function AppSidebar() {
  const { organization } = useLoaderData({ from: "/dashboard" });
  const name = organization?.name ?? "TenderLayer";
  const avatarColors = getAvatarColors(name);

  const avatar = (
    <div
      className="size-4.5 shrink-0 grid place-items-center text-xs font-mono font-normal rounded-sm bg-(--avatar-bg) text-(--avatar-fg)! ring-1 ring-inset ring-(--avatar-outline) dark:bg-(--avatar-dark-bg) dark:text-(--avatar-dark-fg)! dark:ring-(--avatar-dark-outline)"
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
  );

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--sidebar-top) h-[calc(100svh-var(--sidebar-top))] **:data-[slot=sidebar-inner]:pt-[calc(var(--header-height)-var(--sidebar-top))]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    aria-label={`Switch organization: ${name}`}
                    tooltip={name}
                    className="gap-0 px-0 text-foreground hover:text-foreground active:text-foreground data-open:hover:text-foreground group-data-[collapsible=icon]:p-0!"
                  />
                }
              >
                <div className="grid size-8 shrink-0 place-items-center">{avatar}</div>
                <span className="min-w-0 flex-1 truncate text-sm tracking-tight font-450">{name}</span>
                <div className="grid size-8 shrink-0 place-items-center group-data-[collapsible=icon]:hidden">
                  <ChevronsUpDownIcon aria-hidden="true" className="translate-x-0.5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-64">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value="current">
                    <DropdownMenuRadioItem value="current">
                      {avatar}
                      <span className="truncate">{name}</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <PlusIcon aria-hidden="true" />
                    Create organization
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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

import { Sidebar, SidebarContent, SidebarFooter } from "@tenderlayer/ui/components/sidebar";
import { sidebarFooterItems, sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { NavFooter, NavMain } from "./nav-main";
import { AppSidebarHeader } from "./app-sidebar-header";

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="[&_[data-slot=sidebar-inner]]:pt-(--header-height)">
      <AppSidebarHeader />
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter items={sidebarFooterItems} />
      </SidebarFooter>
    </Sidebar>
  );
}

import { Sidebar, SidebarContent, SidebarFooter } from "@tenderlayer/ui/components/sidebar";
import { sidebarFooterItems, sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { NavFooter, NavMain } from "./nav-main";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent style={{ paddingTop: "calc(env(titlebar-area-height, 3rem) + 0.5rem)" }}>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter items={sidebarFooterItems} />
      </SidebarFooter>
    </Sidebar>
  );
}

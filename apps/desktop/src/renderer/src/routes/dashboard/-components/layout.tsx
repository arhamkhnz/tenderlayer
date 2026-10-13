import { Outlet } from "@tanstack/react-router";

import { SidebarProvider } from "@tenderlayer/ui/components/sidebar";
import { TooltipProvider } from "@tenderlayer/ui/components/tooltip";

import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider className="relative">
        <AppHeader />
        <AppSidebar />
        <main
          className="relative min-w-0 w-full bg-background"
          style={{ paddingTop: "env(titlebar-area-height, 3rem)" }}
        >
          <div className="min-h-0 min-w-0 p-4 has-data-[content-padding=false]:p-0">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}

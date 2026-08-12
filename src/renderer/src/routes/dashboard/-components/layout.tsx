import { Outlet } from "@tanstack/react-router";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppSidebar } from "./app-sidebar";

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header
            className="flex shrink-0 items-center border-b px-4"
            style={{ paddingTop: "env(titlebar-area-height, 0px)" }}
          >
            <div className="flex h-12 items-center gap-3">
              <SidebarTrigger className="[-webkit-app-region:no-drag]" />
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </header>
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

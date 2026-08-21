import { Outlet } from "@tanstack/react-router";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <Outlet />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}

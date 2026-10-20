import { Outlet } from "@tanstack/react-router";

import { SidebarProvider, useSidebar } from "@tenderlayer/ui/components/sidebar";
import { TooltipProvider } from "@tenderlayer/ui/components/tooltip";
import { usePreferences } from "@/app/preferences";

import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./app-header";
import { ThemeToggle } from "./theme-toggle";

function MainHeader() {
  const { isMobile, open } = useSidebar();

  return (
    <div className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center border-b bg-background pr-4">
      {(isMobile || !open) && <div aria-hidden="true" className="w-(--header-controls-width) shrink-0" />}
      <div className="h-full flex-1 [app-region:drag]" />
      <ThemeToggle />
    </div>
  );
}

export function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = usePreferences();

  return (
    <TooltipProvider>
      <SidebarProvider
        className="relative [--header-height:env(titlebar-area-height,46px)]"
        open={sidebarOpen}
        onOpenChange={(open) => {
          void setSidebarOpen(open);
        }}
      >
        <AppHeader />
        <AppSidebar />
        <main className="relative flex min-w-0 flex-1 flex-col bg-background">
          <MainHeader />
          <div className="min-h-0 w-full min-w-0 p-4 has-data-[content-padding=false]:p-0">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}

import { Outlet, createRootRoute } from "@tanstack/react-router";

import { Toaster } from "@tenderlayer/ui/components/toast";

import { PageNotFound } from "@/app/page-not-found";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: PageNotFound,
});

function RootLayout() {
  return (
    <div className="antialiased">
      <Outlet />
      <Toaster />
    </div>
  );
}

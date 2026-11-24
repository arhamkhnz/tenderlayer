import { Outlet, createRootRoute } from "@tanstack/react-router";
import { PageNotFound } from "@/app/page-not-found";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: PageNotFound,
});

function RootLayout() {
  return (
    <div className="antialiased">
      <Outlet />
    </div>
  );
}

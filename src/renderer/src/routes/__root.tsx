import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 bg-background [app-region:drag]"
        style={{ height: "env(titlebar-area-height, 0px)" }}
      />
      <Outlet />
    </>
  );
}

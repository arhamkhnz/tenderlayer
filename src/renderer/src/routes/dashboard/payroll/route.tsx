import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/payroll")({
  component: PayrollLayout,
});

function PayrollLayout() {
  return <Outlet />;
}

import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/employees")({
  component: EmployeesLayout,
});

function EmployeesLayout() {
  return <Outlet />;
}

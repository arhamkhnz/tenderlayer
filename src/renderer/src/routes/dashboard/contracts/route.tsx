import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/contracts")({
  component: ContractsLayout,
});

function ContractsLayout() {
  return <Outlet />;
}

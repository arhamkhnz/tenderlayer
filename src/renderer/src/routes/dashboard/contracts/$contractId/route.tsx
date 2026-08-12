import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/contracts/$contractId")({
  component: ContractLayout,
});

function ContractLayout() {
  return <Outlet />;
}

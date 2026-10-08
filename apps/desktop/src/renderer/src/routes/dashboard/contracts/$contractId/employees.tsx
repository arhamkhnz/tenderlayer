import { createFileRoute } from "@tanstack/react-router";

import { ContractEmployeesScreen } from "../-components/screens";

export const Route = createFileRoute("/dashboard/contracts/$contractId/employees")({
  component: ContractEmployeesScreen,
});

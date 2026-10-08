import { createFileRoute } from "@tanstack/react-router";

import { NewEmployeeScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/employees/new")({
  component: NewEmployeeScreen,
});

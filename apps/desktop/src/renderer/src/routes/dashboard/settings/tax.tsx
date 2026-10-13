import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/tax")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/settings/organization", replace: true });
  },
});

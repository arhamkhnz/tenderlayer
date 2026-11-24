import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$organizationId/settings/tax")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/dashboard/$organizationId/settings/organization", params, replace: true });
  },
});

import { createFileRoute } from "@tanstack/react-router";

import { OrganizationSettingsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/settings/organization")({
  component: OrganizationSettingsScreen,
});

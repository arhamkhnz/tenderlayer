import { createFileRoute } from "@tanstack/react-router";

import { OrganizationSettingsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/settings/organization")({
  component: OrganizationSettingsScreen,
});

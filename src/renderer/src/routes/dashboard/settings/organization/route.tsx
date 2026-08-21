import { createFileRoute } from "@tanstack/react-router";

import { OrganizationSettingsScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/settings/organization")({
  component: OrganizationSettingsPage,
});

function OrganizationSettingsPage() {
  return <OrganizationSettingsScreen />;
}

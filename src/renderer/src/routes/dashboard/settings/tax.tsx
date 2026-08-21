import { createFileRoute } from "@tanstack/react-router";

import { TaxSettingsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/settings/tax")({
  component: TaxSettingsScreen,
});

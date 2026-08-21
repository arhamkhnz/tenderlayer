import { createFileRoute } from "@tanstack/react-router";

import { TaxSettingsScreen } from "../-screens";

export const Route = createFileRoute("/dashboard/settings/tax")({
  component: TaxSettingsPage,
});

function TaxSettingsPage() {
  return <TaxSettingsScreen />;
}

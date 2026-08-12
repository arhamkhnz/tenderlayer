import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/settings/tax")({
  component: TaxSettingsPage,
});

function TaxSettingsPage() {
  return <main className="grid min-h-screen place-items-center"><div className="flex flex-col items-center gap-6"><h1 className="text-2xl font-semibold">Tax settings</h1><Link to="/dashboard" className={buttonVariants({ variant: "outline" })}>Back</Link></div></main>;
}

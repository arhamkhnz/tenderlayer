import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="grid min-h-screen place-items-center">
      <p className="text-lg font-medium">Dashboard</p>
    </main>
  );
}

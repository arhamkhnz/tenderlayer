import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-organization")({
  component: CreateOrganizationPage,
});

function CreateOrganizationPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-semibold">Create your organization</h1>
        <p className="mt-2 text-sm text-muted-foreground">The organization form will be added next.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Continue to dashboard
        </Link>
      </div>
    </main>
  );
}

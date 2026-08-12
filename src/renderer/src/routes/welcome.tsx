import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section aria-labelledby="welcome-title" className="w-full max-w-md text-foreground">
        <header>
          <h1 id="welcome-title" className="text-3xl leading-tight font-medium tracking-tight">
            Welcome
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-6 text-muted-foreground">
            A local workspace for managing awarded tenders and the day-to-day work that follows.
          </p>
        </header>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-sm font-medium">Create your organization</h2>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Your organization keeps contracts, employees, invoices, payroll, documents, and
            deadlines together. You can update its details later.
          </p>

          <Link
            to="/create-organization"
            className={buttonVariants({ className: "mt-6 w-full", size: "lg" })}
          >
            Create organization
          </Link>

          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Your workspace is stored locally on this device.
          </p>
        </div>
      </section>
    </main>
  );
}

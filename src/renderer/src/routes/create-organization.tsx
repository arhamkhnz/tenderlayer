import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/create-organization")({
  component: CreateOrganizationPage,
});

function CreateOrganizationPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">Create organization</h1>
        <div className="flex gap-2">
          <Link to="/welcome" className={buttonVariants({ variant: "outline" })}>
            Back
          </Link>
          <Link to="/dashboard" className={buttonVariants()}>
            Continue to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

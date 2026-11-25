import { createFileRoute, useRouter } from "@tanstack/react-router";

import { RouteErrorScreen } from "@/app/route-error-screen";

import { DepartmentsScreen } from "./-components/screens";

export const Route = createFileRoute("/dashboard/$organizationId/departments/")({
  loader: ({ params }) => window.electronAPI.departments.list(params.organizationId),
  component: DepartmentsPage,
  errorComponent: DepartmentsLoadFailure,
});

function DepartmentsPage() {
  const departments = Route.useLoaderData();
  return <DepartmentsScreen departments={departments} />;
}

function DepartmentsLoadFailure() {
  const router = useRouter();

  return (
    <RouteErrorScreen
      title="Couldn’t load departments"
      onRetry={() => void router.invalidate({ filter: (match) => match.routeId === Route.id })}
    />
  );
}

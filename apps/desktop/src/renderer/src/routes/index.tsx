import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const organizations = await window.electronAPI.organizations.list();

    throw redirect({ to: organizations.length > 0 ? "/dashboard" : "/welcome" });
  },
});

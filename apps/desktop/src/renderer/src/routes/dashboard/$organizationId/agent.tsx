import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$organizationId/agent")({
  component: AgentPage,
});

function AgentPage() {
  return (
    <div className="grid min-h-[calc(100dvh-var(--header-height)-2rem)] place-items-center">
      <p className="text-muted-foreground">Coming soon</p>
    </div>
  );
}

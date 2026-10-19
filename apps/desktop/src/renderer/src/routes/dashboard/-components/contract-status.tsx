import { Label, Pie, PieChart } from "recharts";
import colors from "tailwindcss/colors";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@tenderlayer/ui/components/chart";

const chartConfig = {
  count: { label: "Contracts" },
  active: { label: "Active", color: colors.sky[500] },
  draft: { label: "Draft", color: "var(--muted-foreground)" },
  ending: { label: "Ending soon", color: colors.amber[500] },
  completed: { label: "Completed", color: colors.sky[300] },
} satisfies ChartConfig;

const statuses = [
  { status: "active", count: 12, fill: "var(--color-active)" },
  { status: "draft", count: 4, fill: "var(--color-draft)" },
  { status: "ending", count: 3, fill: "var(--color-ending)" },
  { status: "completed", count: 28, fill: "var(--color-completed)" },
];

export function ContractStatus() {
  const total = statuses.reduce((sum, status) => sum + status.count, 0);
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Contract status</CardTitle>
        <CardDescription>Current snapshot</CardDescription>
        <CardAction className="text-muted-foreground">Sample data</CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-wrap items-center justify-center gap-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-square size-36 shrink-0"
          aria-label="Contracts by current status"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie
              data={statuses}
              dataKey="count"
              nameKey="status"
              innerRadius="78%"
              outerRadius="98%"
              paddingAngle={3}
              cornerRadius={4}
              stroke="none"
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} dy="-0.2em" className="fill-foreground text-xl font-semibold tabular-nums">
                        {total}
                      </tspan>
                      <tspan x={viewBox.cx} dy="1.6em" className="fill-muted-foreground text-xs">
                        Contracts
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <dl className="flex min-w-32 flex-1 flex-col divide-y divide-dashed">
          {statuses.map(({ status, count }) => {
            const config = chartConfig[status as keyof typeof chartConfig];
            return (
              <div key={status} className="flex items-center justify-between gap-3 py-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-sm"
                    style={{ backgroundColor: "color" in config ? config.color : undefined }}
                  />
                  {config.label}
                </dt>
                <dd className="font-medium tabular-nums">{count}</dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}

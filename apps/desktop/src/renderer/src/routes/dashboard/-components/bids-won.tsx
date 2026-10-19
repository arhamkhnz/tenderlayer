import { useState } from "react";
import { Bar, BarChart, type BarShapeProps, CartesianGrid, Rectangle, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tenderlayer/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@tenderlayer/ui/components/chart";

import { PeriodFilter } from "./period-filter";
import { getReportingStart, reportingPeriods, type ReportingPeriod } from "./reporting-period";

const chartConfig = {
  count: { label: "Bids won", color: "var(--chart-1)" },
  value: { label: "Contract value" },
} satisfies ChartConfig;

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 2,
});
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const dayLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const fullDayLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });

type WeeklyWins = { date: number; tooltip: string; count: number; value: number };

function WinsBarShape({ x, y, width, height, payload, radius }: BarShapeProps) {
  const wins = (payload as WeeklyWins | undefined)?.count ?? 0;
  const barX = Number(x);
  const barY = Number(y);
  const barWidth = Number(width);
  const barHeight = Number(height);
  const fill = "var(--color-count)";

  return (
    <g>
      {wins === 0 ? (
        <rect x={barX} y={barY + barHeight - 2} width={barWidth} height={2} fill="var(--destructive)" />
      ) : null}
      {wins > 0 && barHeight > 0 ? (
        <Rectangle x={barX} y={barY} width={barWidth} height={barHeight} radius={radius} fill={fill} />
      ) : null}
    </g>
  );
}

// Preview records until award dates and values are available from storage.
function getSampleWins(today: Date, period: ReportingPeriod): WeeklyWins[] {
  const counts = [2, 3, 1, 4, 2, 5, 3, 2, 4, 3, 5, 2];
  const earliest = new Date(today.getFullYear() - 1, 0, 1);
  const start = getReportingStart(period, today, earliest);
  const end =
    period === "this-year"
      ? new Date(today.getFullYear(), 11, 31, 23, 59, 59)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  const keyFor = (date: Date) => {
    const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday.getTime();
  };
  const buckets = new Map<number, WeeklyWins>();

  for (const cursor = new Date(keyFor(start)); cursor <= end;) {
    const cycleEnd = new Date(cursor);
    cycleEnd.setDate(cycleEnd.getDate() + 6);
    buckets.set(keyFor(cursor), {
      date: keyFor(cursor),
      tooltip: `${fullDayLabel.format(Math.max(cursor.getTime(), start.getTime()))} – ${fullDayLabel.format(Math.min(cycleEnd.getTime(), end.getTime()))}`,
      count: 0,
      value: 0,
    });
    cursor.setDate(cursor.getDate() + 7);
  }

  for (let year = earliest.getFullYear(); year <= today.getFullYear(); year += 1) {
    counts.forEach((count, month) => {
      for (let index = 0; index < count; index += 1) {
        const date = new Date(year, month, 3 + index * 5);
        if (date < start || date > end) continue;
        const bucket = buckets.get(keyFor(date));
        if (bucket) {
          bucket.count += 1;
          bucket.value += 250000 + ((month * 3 + index) % 8) * 125000;
        }
      }
    });
  }

  return [...buckets.values()];
}

export function BidsWon({ today }: { today: Date }) {
  const [period, setPeriod] = useState<ReportingPeriod>("this-year");
  const data = getSampleWins(today, period);
  const totals = data.reduce((sum, cycle) => ({ count: sum.count + cycle.count, value: sum.value + cycle.value }), {
    count: 0,
    value: 0,
  });

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle className="leading-none text-muted-foreground font-normal">Bids won over time</CardTitle>
        <CardDescription className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-xl font-medium tracking-tighter text-foreground tabular-nums">
            {compactCurrency.format(totals.value)}
          </span>
          <span>
            across {totals.count} {totals.count === 1 ? "bid" : "bids"} won
          </span>
        </CardDescription>
        <CardAction>
          <PeriodFilter value={period} onValueChange={setPeriod} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-64 w-full sm:h-60"
          aria-label={`Weekly bids won, ${reportingPeriods.find((item) => item.value === period)?.label.toLowerCase()}`}
        >
          <BarChart accessibilityLayer data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} strokeDasharray="3 4" />
            <XAxis
              dataKey="date"
              tickFormatter={(value: number) => dayLabel.format(value)}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
            />
            <YAxis
              domain={[0, (dataMax: number) => Math.max(3, dataMax)]}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={28}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const cycle = payload?.[0]?.payload as WeeklyWins | undefined;
                return (
                  <ChartTooltipContent
                    active={active}
                    label={cycle?.tooltip}
                    hideIndicator
                    payload={
                      cycle
                        ? [
                            { name: "count", dataKey: "count", value: cycle.count },
                            { name: "value", dataKey: "value", value: currency.format(cycle.value) },
                          ]
                        : []
                    }
                  />
                );
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              shape={WinsBarShape}
              activeBar={WinsBarShape}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-[11px] text-muted-foreground">
          * Includes all bids won during the selected period, regardless of whether their contracts are still active.
        </p>
      </CardFooter>
    </Card>
  );
}

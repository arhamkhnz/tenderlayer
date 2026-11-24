import { CalendarIcon } from "@keyline-icons/react";
import { useId, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@tenderlayer/ui/components/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

const metrics = [
  { value: "revenue", label: "Revenue", summary: "turnover" },
  { value: "collections", label: "Collections", summary: "collected" },
  { value: "gst", label: "GST paid", summary: "GST paid" },
  { value: "payroll", label: "Payroll", summary: "payroll" },
] as const;
type Metric = (typeof metrics)[number]["value"];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  collections: { label: "Collections", color: "var(--chart-1)" },
  gst: { label: "GST paid", color: "var(--chart-1)" },
  payroll: { label: "Payroll", color: "var(--chart-1)" },
} satisfies ChartConfig;
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const axisNumberFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

function formatAxisValue(value: number) {
  if (value >= 10000000) return `${axisNumberFormatter.format(value / 10000000)}Cr`;
  if (value >= 100000) return `${axisNumberFormatter.format(value / 100000)}L`;
  if (value >= 1000) return `${axisNumberFormatter.format(value / 1000)}k`;
  return axisNumberFormatter.format(value);
}

// Preview monthly totals until financial records are connected.
const sampleRevenue = [
  7200000, 10800000, 8400000, 14600000, 9700000, 17200000, 12400000, 8100000, 15300000, 11800000, 18200000, 20000000,
];

export function FinancialYearChart({ today }: { today: Date }) {
  const gradientId = useId();
  const currentYear = today.getFullYear() - (today.getMonth() < 3 ? 1 : 0);
  const [year, setYear] = useState(String(currentYear));
  const [metric, setMetric] = useState<Metric>("revenue");
  const years = [
    ...Array.from({ length: 3 }, (_, index) => {
      const start = currentYear - index;
      return { value: String(start), label: `FY ${start}–${String(start + 1).slice(-2)}` };
    }),
    { value: "last-3-years", label: "Last 3 years" },
    { value: "last-5-years", label: "Last 5 years" },
  ];
  const activeMetric = metrics.find((item) => item.value === metric)!;
  const yearCount = year === "last-3-years" ? 3 : year === "last-5-years" ? 5 : 1;
  const firstYear = yearCount > 1 ? currentYear - yearCount + 1 : Number(year);
  const periodLabel = years.find((item) => item.value === year)!.label;
  const data = Array.from({ length: yearCount }, (_, offset) => firstYear + offset).flatMap((financialYear) =>
    months.map((month, index) => {
      const calendarYear = financialYear + (index >= 9 ? 1 : 0);
      const revenue = Math.round(sampleRevenue[index]! * (1 - (currentYear - financialYear) * 0.12));
      return {
        month: `${month} ${calendarYear}`,
        axisLabel: yearCount > 1 ? `${month} '${String(calendarYear).slice(-2)}` : month,
        revenue,
        collections: Math.round(revenue * (0.82 + (index % 3) * 0.04)),
        gst: Math.round(revenue * 0.18),
        payroll: Math.round(revenue * (0.48 + (index % 2) * 0.03)),
      };
    }),
  );
  const total = data.reduce((sum, month) => sum + (month[metric] ?? 0), 0);
  const maximum = Math.max(1, ...data.map((month) => month[metric] ?? 0));
  const roughStep = maximum / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step = [1, 2, 5, 10].find((value) => value * magnitude >= roughStep)! * magnitude;
  const axisMaximum = Math.ceil(maximum / step) * step;
  const axisTicks = Array.from({ length: axisMaximum / step + 1 }, (_, index) => index * step);

  return (
    <Card size="sm" className="card-plain-footer min-w-0">
      <CardHeader>
        <CardTitle className="leading-none text-muted-foreground font-normal">Financial year overview</CardTitle>
        <CardDescription className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-xl font-medium tracking-tighter text-foreground tabular-nums">
            ₹{formatCompactNumber(total)}
          </span>
          <span>{activeMetric.summary}</span>
        </CardDescription>
        <CardAction className="flex flex-wrap items-center gap-2">
          <Select
            items={metrics}
            value={metric}
            onValueChange={(value) => {
              if (value) setMetric(value);
            }}
          >
            <SelectTrigger size="sm" className="w-36 bg-background dark:bg-background" aria-label="Financial metric">
              <SelectValue className="font-450" />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false} className="font-450">
              <SelectGroup>
                {metrics.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            items={years}
            value={year}
            onValueChange={(value) => {
              if (value) setYear(value);
            }}
          >
            <SelectTrigger size="sm" className="w-40 bg-background dark:bg-background" aria-label="Financial year">
              <CalendarIcon aria-hidden="true" />
              <SelectValue className="font-450" />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false} className="font-450">
              <SelectGroup>
                {years.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-64 w-full sm:h-60"
          aria-label={`Monthly ${activeMetric.label.toLowerCase()}, ${periodLabel}`}
        >
          <AreaChart accessibilityLayer data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`var(--color-${metric})`} stopOpacity={0.16} />
                <stop offset="100%" stopColor={`var(--color-${metric})`} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} strokeDasharray="3 4" />
            <XAxis
              dataKey="month"
              tickFormatter={(value: string) => data.find((item) => item.month === value)?.axisLabel ?? value}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
            />
            <YAxis
              ticks={axisTicks}
              domain={[0, axisMaximum]}
              tickFormatter={formatAxisValue}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({ ...item, value: `₹${formatCompactNumber(Number(item.value))}` }))}
                  className="[&_.font-mono]:font-sans [&_.font-mono]:font-450"
                />
              )}
            />
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              stroke={`var(--color-${metric})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

import { FilterIcon } from "@keyline-icons/react";
import { useState } from "react";
import { Pie, PieChart } from "recharts";
import colors from "tailwindcss/colors";

import { Button } from "@tenderlayer/ui/components/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";
import { formatCompactNumber } from "@tenderlayer/ui/lib/utils";

const departments = [
  { key: "cci", name: "CCI", value: 600000, color: "var(--chart-1)", textColor: colors.white },
  {
    key: "defense",
    name: "Ministry of Defense",
    value: 500000,
    color: "color-mix(in oklch, var(--chart-1) 85%, var(--background))",
    textColor: colors.white,
  },
  {
    key: "railway",
    name: "Railway",
    value: 300000,
    color: "color-mix(in oklch, var(--chart-1) 70%, var(--background))",
    textColor: "var(--foreground)",
  },
  {
    key: "education",
    name: "Education",
    value: 200000,
    color: "color-mix(in oklch, var(--chart-1) 55%, var(--background))",
    textColor: "var(--foreground)",
  },
  {
    key: "aviation",
    name: "Aviation & Defense",
    value: 150000,
    color: "color-mix(in oklch, var(--chart-1) 40%, var(--background))",
    textColor: "var(--foreground)",
  },
  {
    key: "dh",
    name: "DH",
    value: 90000,
    color: "color-mix(in oklch, var(--chart-1) 25%, var(--background))",
    textColor: "var(--foreground)",
  },
];

const total = departments.reduce((sum, department) => sum + department.value, 0);
const chartConfig = Object.fromEntries(
  departments.map((department) => [
    department.key,
    {
      label: department.name,
      color: department.color,
    },
  ]),
) satisfies ChartConfig;
const data = departments.map((department) => ({ ...department, fill: `var(--color-${department.key})` }));

export function ContractValueByDepartmentChart() {
  const [status, setStatus] = useState("active");

  return (
    <Card size="sm" className="card-plain-footer min-h-0 min-w-0 overflow-visible xl:contain-size">
      <CardHeader>
        <CardTitle className="leading-none text-muted-foreground font-normal">Contract value by department</CardTitle>
        <CardDescription className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-xl font-medium tracking-tighter text-foreground tabular-nums">
            ₹{formatCompactNumber(total)}
          </span>
          <span>across {departments.length} departments</span>
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" />}
              aria-label="Filter contract value"
            >
              <FilterIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 font-450">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                  <DropdownMenuRadioItem value="active">Active contracts</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed">Completed contracts</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="all">All contracts</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <ChartContainer
          config={chartConfig}
          className="h-52 min-h-0 w-full xl:h-0 xl:flex-1"
          aria-label="Active contract value by department"
        >
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="key"
                  hideLabel
                  formatter={(value, name, item) => (
                    <>
                      <span
                        className="size-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: item.payload.fill }}
                        aria-hidden="true"
                      />
                      <div className="flex flex-1 items-center justify-between gap-4">
                        <span className="text-muted-foreground">{chartConfig[String(name)]?.label ?? name}</span>
                        <span className="font-medium text-foreground tabular-nums">
                          ₹{formatCompactNumber(Number(value))}
                        </span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius="52%"
              outerRadius="94%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={3}
              cornerRadius={5}
              stroke="none"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                const department = data[index];
                const percentage = (department.value / total) * 100;
                if (percentage < 7) return null;
                const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) / 2;
                const angle = (-Number(midAngle) * Math.PI) / 180;
                return (
                  <text
                    x={Number(cx) + radius * Math.cos(angle)}
                    y={Number(cy) + radius * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={department.textColor}
                    className="pointer-events-none text-[11px] font-medium tabular-nums"
                  >
                    {Math.round(percentage)}%
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-2" aria-label="Departments">
          {departments.map((department) => (
            <li key={department.key} className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className="size-2 shrink-0 rounded-sm"
                style={{ backgroundColor: department.color }}
                aria-hidden="true"
              />
              <span className="truncate" title={department.name}>
                {department.name}
              </span>
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}

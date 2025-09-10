"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 📊 Project data grouped by year
const chartDataByYear: Record<
  number,
  { month: string; desktop: number; fill: string }[]
> = {
  2023: [
    { month: "January", desktop: 186, fill: "var(--chart-1)" },
    { month: "February", desktop: 305, fill: "var(--chart-2)" },
    { month: "March", desktop: 237, fill: "var(--chart-3)" },
    { month: "April", desktop: 73, fill: "var(--chart-4)" },
    { month: "May", desktop: 209, fill: "var(--chart-5)" },
    { month: "June", desktop: 214, fill: "var(--chart-6)" },
    { month: "July", desktop: 250, fill: "var(--chart-7)" },
    { month: "August", desktop: 310, fill: "var(--chart-8)" },
    { month: "September", desktop: 275, fill: "var(--chart-9)" },
    { month: "October", desktop: 220, fill: "var(--chart-10)" },
    { month: "November", desktop: 195, fill: "var(--chart-11)" },
    { month: "December", desktop: 280, fill: "var(--chart-12)" },
  ],
  2024: [
    { month: "January", desktop: 200, fill: "var(--chart-1)" },
    { month: "February", desktop: 320, fill: "var(--chart-2)" },
    { month: "March", desktop: 250, fill: "var(--chart-3)" },
    { month: "April", desktop: 90, fill: "var(--chart-4)" },
    { month: "May", desktop: 220, fill: "var(--chart-5)" },
    { month: "June", desktop: 230, fill: "var(--chart-6)" },
    { month: "July", desktop: 270, fill: "var(--chart-7)" },
    { month: "August", desktop: 330, fill: "var(--chart-8)" },
    { month: "September", desktop: 290, fill: "var(--chart-9)" },
    { month: "October", desktop: 240, fill: "var(--chart-10)" },
    { month: "November", desktop: 210, fill: "var(--chart-11)" },
    { month: "December", desktop: 300, fill: "var(--chart-12)" },
  ],
  2025: [
    { month: "January", desktop: 210, fill: "var(--chart-1)" },
    { month: "February", desktop: 340, fill: "var(--chart-2)" },
    { month: "March", desktop: 270, fill: "var(--chart-3)" },
    { month: "April", desktop: 100, fill: "var(--chart-4)" },
    { month: "May", desktop: 230, fill: "var(--chart-5)" },
    { month: "June", desktop: 245, fill: "var(--chart-6)" },
    { month: "July", desktop: 280, fill: "var(--chart-7)" },
    { month: "August", desktop: 350, fill: "var(--chart-8)" },
    { month: "September", desktop: 305, fill: "var(--chart-9)" },
    { month: "October", desktop: 260, fill: "var(--chart-10)" },
    { month: "November", desktop: 225, fill: "var(--chart-11)" },
    { month: "December", desktop: 320, fill: "var(--chart-12)" },
  ],
};

const chartConfig = {
  desktop: { label: "Desktop" },
} satisfies ChartConfig;

// 🔹 Custom label renderer
const renderCustomLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text
      x={x}
      y={y - 6}
      fill="#9ca3af"
      fontWeight="normal"
      fontSize={11}
      textAnchor="middle"
    >
      {value}
    </text>
  );
};

type ProjectChartProps = {
  year: number;
};

export function ProjectChart({ year }: ProjectChartProps) {
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card className="bg-neutral-900/80 border border-white h-[490px] w-full md:w-[780px] mx-auto shadow-lg shadow-white/30">
      <CardHeader className="p-4">
        <CardTitle className="text-lg text-white">Project Trends</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          January - December ({year})
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[calc(100%-80px)] p-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid vertical={false} stroke="#333" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fill: "#f87171" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" radius={6}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  stroke={entry.fill}
                  strokeWidth={2}
                />
              ))}
              <LabelList content={renderCustomLabel} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data grouped by year
const chartDataByYear: Record<number, { month: string; cloud: number }[]> = {
  2023: [
    { month: "January", cloud: 5 },
    { month: "February", cloud: 7 },
    { month: "March", cloud: 8 },
    { month: "April", cloud: 9 },
    { month: "May", cloud: 10 },
    { month: "June", cloud: 11 },
    { month: "July", cloud: 12 },
    { month: "August", cloud: 13 },
    { month: "September", cloud: 14 },
    { month: "October", cloud: 10 },
    { month: "November", cloud: 9 },
    { month: "December", cloud: 8 },
  ],
  2024: [
    { month: "January", cloud: 6 },
    { month: "February", cloud: 8 },
    { month: "March", cloud: 9 },
    { month: "April", cloud: 10 },
    { month: "May", cloud: 12 },
    { month: "June", cloud: 13 },
    { month: "July", cloud: 14 },
    { month: "August", cloud: 13 },
    { month: "September", cloud: 12 },
    { month: "October", cloud: 11 },
    { month: "November", cloud: 10 },
    { month: "December", cloud: 9 },
  ],
  2025: [
    { month: "January", cloud: 8 },
    { month: "February", cloud: 9 },
    { month: "March", cloud: 11 },
    { month: "April", cloud: 12 },
    { month: "May", cloud: 13 },
    { month: "June", cloud: 14 },
    { month: "July", cloud: 15 },
    { month: "August", cloud: 16 },
    { month: "September", cloud: 15 },
    { month: "October", cloud: 14 },
    { month: "November", cloud: 13 },
    { month: "December", cloud: 12 },
  ],
};

const chartConfig = {
  cloud: {
    label: "Cloud Computing",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type ChartAreaDefaultProps = {
  year: number;
};

export function ChartAreaDefault({ year }: ChartAreaDefaultProps) {
  const chartColor = "#A07044";
  const textColor = "#E0A800";

  // Pick dataset based on year
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card
      className="bg-neutral-900 border-2 border-transparent rounded-lg p-2 flex flex-col justify-between 
                 transition-all duration-300 ease-in-out 
                 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-400/50"
      style={{
        borderColor: "rgba(255, 165, 0, 0.5)",
        boxShadow:
          "0 0 10px rgba(255, 165, 0, 0.3), inset 0 0 5px rgba(255, 165, 0, 0.2)",
      }}
    >
      {/* 🔽 Shrunk header */}
      <CardHeader className="p-1">
        <CardTitle style={{ color: textColor, fontSize: "0.85rem" }}>
          Cloud Trends
        </CardTitle>
        <div
          className="text-base font-bold mt-0.5"
          style={{ color: textColor }}
        >
          {chartData.length > 0 ? `${chartData[0].cloud}%` : "—"}
        </div>
      </CardHeader>

      {/* 🔽 Shrunk chart area */}
      <CardContent className="p-1">
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={180}
            height={80}
            data={chartData}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={false} // hide month labels
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="cloud"
              type="natural"
              fill={chartColor}
              fillOpacity={0.8}
              stroke={chartColor}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

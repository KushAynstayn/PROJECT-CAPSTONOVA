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

// 📊 IoT data grouped by year
const chartDataByYear: Record<number, { month: string; iot: number }[]> = {
  2023: [
    { month: "January", iot: 15 },
    { month: "February", iot: 20 },
    { month: "March", iot: 25 },
    { month: "April", iot: 30 },
    { month: "May", iot: 35 },
    { month: "June", iot: 37 },
    { month: "July", iot: 38 },
    { month: "August", iot: 36 },
    { month: "September", iot: 37 },
    { month: "October", iot: 35 },
    { month: "November", iot: 36 },
    { month: "December", iot: 38 },
  ],
  2024: [
    { month: "January", iot: 18 },
    { month: "February", iot: 22 },
    { month: "March", iot: 28 },
    { month: "April", iot: 32 },
    { month: "May", iot: 36 },
    { month: "June", iot: 39 },
    { month: "July", iot: 41 },
    { month: "August", iot: 40 },
    { month: "September", iot: 38 },
    { month: "October", iot: 37 },
    { month: "November", iot: 39 },
    { month: "December", iot: 41 },
  ],
  2025: [
    { month: "January", iot: 20 },
    { month: "February", iot: 25 },
    { month: "March", iot: 30 },
    { month: "April", iot: 34 },
    { month: "May", iot: 38 },
    { month: "June", iot: 42 },
    { month: "July", iot: 44 },
    { month: "August", iot: 43 },
    { month: "September", iot: 42 },
    { month: "October", iot: 40 },
    { month: "November", iot: 41 },
    { month: "December", iot: 43 },
  ],
};

const chartConfig = {
  iot: {
    label: "IoT",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type IotChartProps = {
  year: number;
};

export function IotChart({ year }: IotChartProps) {
  const chartColor = "#93C5FD"; // pale blue line color
  const textColor = "#93C5FD"; // pale blue title color

  // ⬇️ Pick dataset by year
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card
      className="bg-neutral-900 border-2 border-transparent rounded-lg p-2 flex flex-col justify-between 
                 transition-all duration-300 ease-in-out 
                 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-300/50"
      style={{
        borderColor: "rgba(147, 197, 253, 0.5)",
        boxShadow:
          "0 0 10px rgba(147, 197, 253, 0.3), inset 0 0 5px rgba(147, 197, 253, 0.2)",
      }}
    >
      {/* 🔽 Compact header */}
      <CardHeader className="p-1">
        <CardTitle style={{ color: textColor, fontSize: "0.85rem" }}>
          IoT Trends
        </CardTitle>
        <div
          className="text-base font-bold mt-0.5"
          style={{ color: textColor }}
        >
          {chartData.length > 0 ? `${chartData[0].iot}%` : "—"}
        </div>
      </CardHeader>

      {/* 🔽 Compact chart */}
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
              dataKey="iot"
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

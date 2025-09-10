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

// 📊 Web Applications data grouped by year
const chartDataByYear: Record<number, { month: string; webApplication: number }[]> = {
  2023: [
    { month: "January", webApplication: 40 },
    { month: "February", webApplication: 48 },
    { month: "March", webApplication: 55 },
    { month: "April", webApplication: 58 },
    { month: "May", webApplication: 62 },
    { month: "June", webApplication: 64 },
    { month: "July", webApplication: 66 },
    { month: "August", webApplication: 63 },
    { month: "September", webApplication: 65 },
    { month: "October", webApplication: 62 },
    { month: "November", webApplication: 64 },
    { month: "December", webApplication: 66 },
  ],
  2024: [
    { month: "January", webApplication: 42 },
    { month: "February", webApplication: 50 },
    { month: "March", webApplication: 57 },
    { month: "April", webApplication: 60 },
    { month: "May", webApplication: 64 },
    { month: "June", webApplication: 66 },
    { month: "July", webApplication: 68 },
    { month: "August", webApplication: 65 },
    { month: "September", webApplication: 67 },
    { month: "October", webApplication: 64 },
    { month: "November", webApplication: 66 },
    { month: "December", webApplication: 68 },
  ],
  2025: [
    { month: "January", webApplication: 45 },
    { month: "February", webApplication: 52 },
    { month: "March", webApplication: 60 },
    { month: "April", webApplication: 63 },
    { month: "May", webApplication: 67 },
    { month: "June", webApplication: 70 },
    { month: "July", webApplication: 72 },
    { month: "August", webApplication: 69 },
    { month: "September", webApplication: 71 },
    { month: "October", webApplication: 68 },
    { month: "November", webApplication: 70 },
    { month: "December", webApplication: 72 },
  ],
};

const chartConfig = {
  webApplication: {
    label: "Web Applications",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type WebApplicationChartProps = {
  year: number;
};

export function WebApplicationChart({ year }: WebApplicationChartProps) {
  const chartColor = "#86EFAC"; // pale green line color
  const textColor = "#86EFAC"; // pale green title color

  // ⬇️ Pick dataset by year
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card
      className="bg-neutral-900 border-2 border-transparent rounded-lg p-2 flex flex-col justify-between 
                 transition-all duration-300 ease-in-out 
                 hover:border-green-300 hover:shadow-2xl hover:shadow-green-300/50"
      style={{
        borderColor: "rgba(134, 239, 172, 0.5)", 
        boxShadow:
          "0 0 10px rgba(134, 239, 172, 0.3), inset 0 0 5px rgba(134, 239, 172, 0.2)",
      }}
    >
      {/* 🔽 Compact header */}
      <CardHeader className="p-1">
        <CardTitle style={{ color: textColor, fontSize: "0.85rem" }}>
          Web Applications Trends
        </CardTitle>
        <div
          className="text-base font-bold mt-0.5"
          style={{ color: textColor }}
        >
          {chartData.length > 0 ? `${chartData[0].webApplication}%` : "—"}
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
              dataKey="webApplication"
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

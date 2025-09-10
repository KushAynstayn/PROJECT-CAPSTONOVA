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

// 📊 Mobile Apps data grouped by year
const chartDataByYear: Record<number, { month: string; mobileApps: number }[]> = {
  2023: [
    { month: "January", mobileApps: 70 },
    { month: "February", mobileApps: 75 },
    { month: "March", mobileApps: 78 },
    { month: "April", mobileApps: 81 },
    { month: "May", mobileApps: 84 },
    { month: "June", mobileApps: 86 },
    { month: "July", mobileApps: 88 },
    { month: "August", mobileApps: 85 },
    { month: "September", mobileApps: 87 },
    { month: "October", mobileApps: 86 },
    { month: "November", mobileApps: 88 },
    { month: "December", mobileApps: 90 },
  ],
  2024: [
    { month: "January", mobileApps: 72 },
    { month: "February", mobileApps: 77 },
    { month: "March", mobileApps: 80 },
    { month: "April", mobileApps: 83 },
    { month: "May", mobileApps: 86 },
    { month: "June", mobileApps: 88 },
    { month: "July", mobileApps: 90 },
    { month: "August", mobileApps: 87 },
    { month: "September", mobileApps: 89 },
    { month: "October", mobileApps: 88 },
    { month: "November", mobileApps: 90 },
    { month: "December", mobileApps: 92 },
  ],
  2025: [
    { month: "January", mobileApps: 75 },
    { month: "February", mobileApps: 80 },
    { month: "March", mobileApps: 83 },
    { month: "April", mobileApps: 86 },
    { month: "May", mobileApps: 89 },
    { month: "June", mobileApps: 91 },
    { month: "July", mobileApps: 93 },
    { month: "August", mobileApps: 90 },
    { month: "September", mobileApps: 92 },
    { month: "October", mobileApps: 91 },
    { month: "November", mobileApps: 93 },
    { month: "December", mobileApps: 95 },
  ],
};

const chartConfig = {
  mobileApps: {
    label: "Mobile Apps",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type MobileAppsChartProps = {
  year: number;
};

export function MobileAppsChart({ year }: MobileAppsChartProps) {
  const chartColor = "#F5F5F5"; // pale white line color
  const textColor = "#F5F5F5";  // pale white title color

  // ⬇️ Pick dataset by year
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card
      className="bg-neutral-900 border-2 border-transparent rounded-lg p-2 flex flex-col justify-between 
                 transition-all duration-300 ease-in-out 
                 hover:border-white/50 hover:shadow-2xl hover:shadow-white/30"
      style={{
        borderColor: "rgba(245, 245, 245, 0.5)",
        boxShadow:
          "0 0 10px rgba(245, 245, 245, 0.3), inset 0 0 5px rgba(245, 245, 245, 0.2)",
      }}
    >
      {/* 🔽 Compact header */}
      <CardHeader className="p-1">
        <CardTitle style={{ color: textColor, fontSize: "0.85rem" }}>
          Mobile Apps Trends
        </CardTitle>
        <div
          className="text-base font-bold mt-0.5"
          style={{ color: textColor }}
        >
          {chartData.length > 0 ? `${chartData[0].mobileApps}%` : "—"}
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
              dataKey="mobileApps"
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

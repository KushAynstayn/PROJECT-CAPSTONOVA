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

// 📊 AI/ML data grouped by year
const chartDataByYear: Record<number, { month: string; aiml: number }[]> = {
  2023: [
    { month: "January", aiml: 12 },
    { month: "February", aiml: 18 },
    { month: "March", aiml: 22 },
    { month: "April", aiml: 28 },
    { month: "May", aiml: 32 },
    { month: "June", aiml: 34 },
    { month: "July", aiml: 36 },
    { month: "August", aiml: 38 },
    { month: "September", aiml: 40 },
    { month: "October", aiml: 42 },
    { month: "November", aiml: 44 },
    { month: "December", aiml: 45 },
  ],
  2024: [
    { month: "January", aiml: 14 },
    { month: "February", aiml: 20 },
    { month: "March", aiml: 25 },
    { month: "April", aiml: 30 },
    { month: "May", aiml: 35 },
    { month: "June", aiml: 38 },
    { month: "July", aiml: 40 },
    { month: "August", aiml: 42 },
    { month: "September", aiml: 44 },
    { month: "October", aiml: 46 },
    { month: "November", aiml: 48 },
    { month: "December", aiml: 50 },
  ],
  2025: [
    { month: "January", aiml: 16 },
    { month: "February", aiml: 22 },
    { month: "March", aiml: 28 },
    { month: "April", aiml: 34 },
    { month: "May", aiml: 38 },
    { month: "June", aiml: 41 },
    { month: "July", aiml: 44 },
    { month: "August", aiml: 46 },
    { month: "September", aiml: 48 },
    { month: "October", aiml: 50 },
    { month: "November", aiml: 52 },
    { month: "December", aiml: 54 },
  ],
};

const chartConfig = {
  aiml: {
    label: "AI/ML",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type AIMLChartProps = {
  year: number;
};

export function AIMLChart({ year }: AIMLChartProps) {
  const chartColor = "#CFA0FF"; // pale purple line color
  const textColor = "#CFA0FF";  // pale purple title color

  // ⬇️ Pick dataset by year
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card
      className="bg-neutral-900 border-2 border-transparent rounded-lg p-2 flex flex-col justify-between 
                 transition-all duration-300 ease-in-out 
                 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-400/30"
      style={{
        borderColor: "rgba(207, 160, 255, 0.5)",
        boxShadow:
          "0 0 10px rgba(207, 160, 255, 0.3), inset 0 0 5px rgba(207, 160, 255, 0.2)",
      }}
    >
      {/* 🔽 Compact header */}
      <CardHeader className="p-1">
        <CardTitle style={{ color: textColor, fontSize: "0.85rem" }}>
          AI/ML Trends
        </CardTitle>
        <div
          className="text-base font-bold mt-0.5"
          style={{ color: textColor }}
        >
          {chartData.length > 0 ? `${chartData[0].aiml}%` : "—"}
        </div>
      </CardHeader>

      {/* 🔽 Compact chart */}
      <CardContent className="p-1">
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={180}
            height={80} // same height as other mini charts
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
              dataKey="aiml"
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

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
const chartDataByYear: Record<number, { month: string; socialMedia: number }[]> = {
  2023: [
    { month: "January", socialMedia: 2 },
    { month: "February", socialMedia: 4 },
    { month: "March", socialMedia: 6 },
    { month: "April", socialMedia: 5 },
    { month: "May", socialMedia: 6 },
    { month: "June", socialMedia: 7 },
    { month: "July", socialMedia: 8 },
    { month: "August", socialMedia: 6 },
    { month: "September", socialMedia: 7 },
    { month: "October", socialMedia: 5 },
    { month: "November", socialMedia: 6 },
    { month: "December", socialMedia: 7 },
  ],
  2024: [
    { month: "January", socialMedia: 5 },
    { month: "February", socialMedia: 6 },
    { month: "March", socialMedia: 7 },
    { month: "April", socialMedia: 8 },
    { month: "May", socialMedia: 9 },
    { month: "June", socialMedia: 10 },
    { month: "July", socialMedia: 11 },
    { month: "August", socialMedia: 10 },
    { month: "September", socialMedia: 9 },
    { month: "October", socialMedia: 8 },
    { month: "November", socialMedia: 7 },
    { month: "December", socialMedia: 6 },
  ],
  2025: [
    { month: "January", socialMedia: 7 },
    { month: "February", socialMedia: 8 },
    { month: "March", socialMedia: 9 },
    { month: "April", socialMedia: 10 },
    { month: "May", socialMedia: 11 },
    { month: "June", socialMedia: 12 },
    { month: "July", socialMedia: 13 },
    { month: "August", socialMedia: 14 },
    { month: "September", socialMedia: 15 },
    { month: "October", socialMedia: 14 },
    { month: "November", socialMedia: 13 },
    { month: "December", socialMedia: 12 },
  ],
};

const chartConfig = {
  socialMedia: {
    label: "Social Media",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type SocialMediaChartProps = {
  year: number;
};

export function SocialMediaChart({ year }: SocialMediaChartProps) {
  const chartColor = "#FCA5A5"; // pale red line color
  const textColor = "#FCA5A5"; // pale red title color

  // Pick dataset based on year
  const chartData = chartDataByYear[year] ?? [];

  return (
    <Card
      className="bg-neutral-900 border-2 border-white/20 rounded-lg p-2 flex flex-col justify-between 
                 transition-all duration-300 ease-in-out 
                 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-300/50"
      style={{
        borderColor: "rgba(252, 165, 165, 0.5)", // pale red border
        boxShadow:
          "0 0 10px rgba(252, 165, 165, 0.3), inset 0 0 5px rgba(252, 165, 165, 0.2)",
      }}
    >
      {/* 🔽 Smaller header */}
      <CardHeader className="p-1">
        <CardTitle style={{ color: textColor, fontSize: "0.85rem" }}>
          Social Media Trends
        </CardTitle>
        <div
          className="text-base font-bold mt-0.5"
          style={{ color: textColor }}
        >
          {chartData.length > 0 ? `${chartData[0].socialMedia}%` : "—"}
        </div>
      </CardHeader>

      {/* 🔽 Shorter chart */}
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
              dataKey="socialMedia"
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

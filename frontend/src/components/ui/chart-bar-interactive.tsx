"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

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

interface ViewersData {
  total: number;
  by_department: { department: string; count: number }[];
}

interface GuestDistributionChartProps {
  viewersData: ViewersData;
}

// --- MODIFIED THIS LINE ---
// Changed the color palette to shades of maroon
const PALETTE = ["#660000", "#8B0000", "#C75B5B"]; // Dark Maroon, Maroon, Light Maroon

const chartConfig = {
  guests: {
    label: "Guests",
  },
} satisfies ChartConfig;

export function GuestDistributionChart({
  viewersData,
}: GuestDistributionChartProps) {
  const chartData = viewersData.by_department.map((d, index) => ({
    course: d.department,
    guests: d.count,
    fill: PALETTE[index % PALETTE.length], // Assigns color from the palette
  }));

  return (
    <Card className="border border-gray-300 shadow-md rounded-md">
      <CardHeader>
        <CardTitle>Viewers</CardTitle>
        <CardDescription>Total: {viewersData.total} Viewers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="course"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="guests" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.course} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
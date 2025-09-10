"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
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

// Define the shape of the data points the chart will receive
type ChartDataPoint = {
  name: string;
  count: number;
};

interface ProjectToolsChartProps {
  data: ChartDataPoint[];
  projectType: string;
}

// A vibrant, varied color palette for the chart bars
const COLOR_PALETTE = [
  "#800000",
  "#9A2A2A",
  "#B35353",
  "#CC7D7D",
  "#E6A6A6",
  "#8B4513",
  "#A0522D",
  "#CD853F",
  "#D2B48C",
  "#F5DEB3",
];

export function ProjectToolsChart({
  data,
  projectType,
}: ProjectToolsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Project Tools Usage</CardTitle>
          <CardDescription>
            No data available for the selected filters.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Dynamically create chart configuration based on the data received
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    };
    return acc;
  }, {} as ChartConfig);

  // Add the fill color to each data point for the chart cells
  const chartDataWithColor = data.map((item) => ({
    ...item,
    fill: chartConfig[item.name].color,
  }));

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{projectType} - Tools Usage</CardTitle>
        <CardDescription>
          Comparing total usage of different programming languages and tools.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataWithColor} margin={{ bottom: 100 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-60}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={8}>
                {chartDataWithColor.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

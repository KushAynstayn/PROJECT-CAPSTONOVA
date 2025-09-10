"use client";

import * as React from "react";
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

interface ChartData {
  year?: string; // Year is optional now as the API aggregates
  [projectType: string]: number | string | undefined;
}

interface ProjectTypeChartProps {
  data: ChartData[];
}

// A vibrant and distinct color palette for the chart bars
const COLOR_PALETTE = ["#800000", "#B33A3A", "#E67373", "#FFAAAA"];

export function ProjectTypeChart({ data }: ProjectTypeChartProps) {
  // If there's no data or the data object is empty, show a message.
  if (!data || data.length === 0 || Object.keys(data[0]).length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Project Type Distribution</CardTitle>
          <CardDescription>
            No data available for the selected period.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Dynamically generate chart config and data from the API response
  const projectTypes = Object.keys(data[0]).filter((key) => key !== "year");

  const chartConfig = projectTypes.reduce((acc, name, index) => {
    acc[name] = {
      label: name,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    };
    return acc;
  }, {} as ChartConfig);

  const comparisonData = projectTypes.map((name) => ({
    name,
    count: data[0][name] as number,
    fill: chartConfig[name].color,
  }));

  const title = data[0].year
    ? `Project Types for ${data[0].year}`
    : "Project Type Distribution";

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Comparing total projects by type.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={8}>
                {comparisonData.map((entry) => (
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

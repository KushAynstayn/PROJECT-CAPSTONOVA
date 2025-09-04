"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import * as React from "react";

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

interface ProjectTypesData {
  category: string;
  value: number;
  fill: string;
}

interface ProjectTypesChartProps {
  data: ProjectTypesData[];
  year: number;
}

// MODIFIED: Chart configuration updated to match the new data categories
const chartConfig = {
  value: {
    label: "Count",
  },
  Advisee: {
    label: "Advisee",
    color: "hsl(340, 75%, 55%)",
  },
  Projects: {
    label: "Projects",
    color: "hsl(160, 70%, 45%)",
  },
  Suggestions: {
    label: "Suggestions",
    color: "hsl(214, 75%, 65%)",
  },
} satisfies ChartConfig;

export function ProjectTypesChart({ data, year }: ProjectTypesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Advisers Overview for {year}</CardTitle>
          <CardDescription>
            No data available for the selected period.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl border-none shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardTitle>Advisers Overview for {year}</CardTitle>
        <CardDescription>
          A summary of adviser metrics for the selected year.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[350px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 0, right: 20, bottom: 20, left: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="value" radius={8}>
              {data.map((item) => (
                <Cell key={item.category} fill={item.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
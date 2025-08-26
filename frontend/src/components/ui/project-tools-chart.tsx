"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = {
  year: string;
  [tool: string]: number | string;
};

interface ProjectToolsChartProps {
  data: ChartData[];
  projectType: string;
  layerType: string;
}

// Mock config for a single maroon color
const chartConfig = {
  default: {
    color: "hsl(0, 70%, 40%)", // A consistent maroon color
    label: "Tool Usage",
  },
};

export function ProjectToolsChart({ data, projectType, layerType }: ProjectToolsChartProps) {
  if (data.length === 0) {
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

  const isSingleYearView = data.length === 1;

  // Determine the correct data keys for the bars from the first data object
  const toolKeys = Object.keys(data?.[0] || {}).filter((key) => key !== "year");

  // Transform data for the single-year view to match the chart's needs
  const singleYearData = isSingleYearView
    ? toolKeys.map((key) => ({
        name: key,
        value: data?.[0]?.[key] as number,
      }))
    : [];

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>
          {projectType} - {layerType} Tools
        </CardTitle>
        <CardDescription>
          Showing tool usage from {data?.[0]?.year} to {data?.[data.length - 1]?.year}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {isSingleYearView ? (
              // Single-year view with tools on the X-Axis and a single bar
              <BarChart data={singleYearData} margin={{ bottom: 50 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill={chartConfig.default.color} radius={8} />
              </BarChart>
            ) : (
              // Multi-year view with year on the X-Axis and multiple bars
              <BarChart data={data} margin={{ bottom: 50 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                {toolKeys.map((tool) => (
                  <Bar
                    key={tool}
                    dataKey={tool}
                    fill={chartConfig.default.color} 
                    radius={4}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
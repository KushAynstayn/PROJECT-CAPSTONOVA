"use client";

import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiCall, ApiError } from "@/lib/api";

// Define the interface for the API response
interface ProjectTypeData {
  type: string;
  count: number;
}

const chartConfig = {
  projects: {
    label: "Projects",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Color palette for the bars
const PALETTE = ["#800000", "#A52A2A", "#B22222", "#C0392B"];

export function ChartBarLabel() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        setIsLoading(true);
        const data: ProjectTypeData[] = await apiCall("/util/projects-by-type");

        // Map the API response to the format expected by the chart
        const formattedData = data.map((item, index) => ({
          type: item.type,
          projects: item.count,
          fill: PALETTE[index % PALETTE.length],
        }));

        setChartData(formattedData);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(
            "An unexpected error occurred while fetching project types."
          );
        }
        console.error("Failed to fetch project types:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectTypes();
  }, []);

  return (
    <Card className="flex h-full flex-col border-1 border-gray-500">
      <CardHeader>
        <CardTitle>Projects by Type</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="projects" radius={8}>
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.type}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

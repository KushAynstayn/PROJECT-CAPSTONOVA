"use client";

import React, { useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiCall, ApiError } from "@/lib/api";

// Define an interface for the expected API response
interface ToolUsageData {
  name: string;
  projects_count: number;
}

const chartConfig = {
  Projects: {
    label: "Projects",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineLinear() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setIsLoading(true);
        const data: ToolUsageData[] = await apiCall(
          "/util/programming-tools-usage"
        );

        // Map the API response to the format expected by the chart
        const formattedData = data.map((item) => ({
          tool: item.name,
          Projects: item.projects_count,
        }));

        setChartData(formattedData);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching data.");
        }
        console.error("Failed to fetch programming tools usage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Programming Tools Usage</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[140px]">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[140px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[140px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tool"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="tool"
                    labelFormatter={(name) => `${name}`}
                  />
                }
              />
              <Line
                dataKey="Projects"
                type="linear"
                stroke="var(--color-Projects)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

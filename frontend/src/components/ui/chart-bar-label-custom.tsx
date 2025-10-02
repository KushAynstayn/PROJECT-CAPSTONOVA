"use client";

import React, { useState, useEffect } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiCall, ApiError } from "@/lib/api";

// Define interfaces for the data shapes
interface TopAdviserData {
  adviser_name: string;
  project_count: number;
}

interface ApiResponse {
  message: string;
  data: TopAdviserData[];
}

interface ChartData {
  adviser: string;
  projects: number;
  fill: string;
}

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const INITIAL_CHART_CONFIG = {
  projects: {
    label: "Projects",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ChartBarLabelCustom() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartConfig, setChartConfig] =
    useState<ChartConfig>(INITIAL_CHART_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopAdvisers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response: ApiResponse = await apiCall("/util/top-advisers");
        const advisers = response.data;

        // Debug: log the received data
        console.log("Fetched advisers data:", advisers);

        // Check if data is empty
        if (!advisers || advisers.length === 0) {
          setChartData([]);
          return;
        }

        // Generate a key-friendly name (e.g., "Adviser User 5" -> "adviseruser5")
        const generateKey = (name: string) =>
          name
            .replace(/\s+/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();

        const newChartData: ChartData[] = advisers.map((adviser, index) => ({
          adviser: generateKey(adviser.adviser_name),
          projects: adviser.project_count,
          fill: PALETTE[index % PALETTE.length],
        }));

        const newChartConfig = advisers.reduce(
          (config, adviser, index) => {
            const key = generateKey(adviser.adviser_name);
            config[key] = {
              label: adviser.adviser_name,
              color: PALETTE[index % PALETTE.length],
            };
            return config;
          },
          { ...INITIAL_CHART_CONFIG } as ChartConfig
        );

        setChartData(newChartData);
        setChartConfig(newChartConfig);

        console.log("Processed chart data:", newChartData);
      } catch (err) {
        console.error("Failed to fetch top advisers:", err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching data.");
        }
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAdvisers();
  }, []);

  if (!isLoading && !error && chartData.length === 0) {
    return (
      <Card className="w-full h-full border-1 border-gray-500">
        <CardHeader>
          <CardTitle>Projects Handled by Adviser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[140px]">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full border-1 border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle>Projects Handled by Adviser</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[140px]">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[140px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[140px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
            >
              <YAxis
                dataKey="adviser"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={120}
                tickFormatter={(value) => chartConfig[value]?.label || value}
              />
              <XAxis dataKey="projects" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel />}
              />
              <Bar dataKey="projects" layout="vertical" radius={5}>
                <LabelList
                  dataKey="projects"
                  position="insideRight"
                  offset={8}
                  className="fill-white font-medium"
                  fontSize={12}
                  formatter={(value: number) => value.toString()}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

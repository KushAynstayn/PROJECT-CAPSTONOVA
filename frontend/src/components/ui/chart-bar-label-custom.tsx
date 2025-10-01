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
  name: string;
  projects_handled: number;
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
        const advisers: TopAdviserData[] = await apiCall("/util/top-advisers");

        // Generate a key-friendly name (e.g., "Dr. Reyes" -> "drReyes")
        const generateKey = (name: string) =>
          name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

        const newChartData: ChartData[] = advisers.map((adviser, index) => ({
          adviser: generateKey(adviser.name),
          projects: adviser.projects_handled,
          fill: PALETTE[index % PALETTE.length],
        }));

        const newChartConfig = advisers.reduce(
          (config, adviser, index) => {
            const key = generateKey(adviser.name);
            config[key] = {
              label: adviser.name,
              color: PALETTE[index % PALETTE.length],
            };
            return config;
          },
          { ...INITIAL_CHART_CONFIG } as ChartConfig
        );

        setChartData(newChartData);
        setChartConfig(newChartConfig);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Failed to fetch top advisers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAdvisers();
  }, []);

  return (
    <Card className="w-full h-full border-1 border-gray-500">
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
              margin={{ left: 5, right: 5 }}
            >
              <YAxis
                dataKey="adviser"
                type="category"
                tickLine={false} // Cleaner look
                axisLine={false} // Cleaner look
                tickMargin={10}
                width={120} // Give space for long names
                tickFormatter={(value) => chartConfig[value]?.label ?? value}
              />
              <XAxis dataKey="projects" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel />}
              />
              <Bar dataKey="projects" layout="vertical" radius={5}>
                <LabelList
                  dataKey="projects"
                  position="insideRight" // Move count inside the bar
                  offset={10}
                  className="fill-white" // Make text white for contrast
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

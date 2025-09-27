"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data grouped by year with more project types and amber-like colors
const dataByYear: Record<number, { type: string; count: number; fill: string }[]> = {
  2023: [
    { type: "Web Applications", count: 275, fill: "var(--color-web)" },
    { type: "Mobile Apps", count: 200, fill: "var(--color-mobile)" },
    { type: "AI/ML", count: 110, fill: "var(--color-aiml)" },
    { type: "IoT", count: 90, fill: "var(--color-iot)" },
    { type: "Cloud", count: 45, fill: "var(--color-cloud)" },
    { type: "Social Media", count: 30, fill: "var(--color-social)" },
    { type: "Data Science", count: 60, fill: "var(--color-data-science)" }, // New type
    { type: "Cybersecurity", count: 50, fill: "var(--color-cybersecurity)" }, // New type
  ],
  2024: [
    { type: "Web Applications", count: 250, fill: "var(--color-web)" },
    { type: "Mobile Apps", count: 220, fill: "var(--color-mobile)" },
    { type: "AI/ML", count: 130, fill: "var(--color-aiml)" },
    { type: "IoT", count: 100, fill: "var(--color-iot)" },
    { type: "Cloud", count: 60, fill: "var(--color-cloud)" },
    { type: "Social Media", count: 25, fill: "var(--color-social)" },
    { type: "Data Science", count: 70, fill: "var(--color-data-science)" }, // New type
    { type: "Cybersecurity", count: 55, fill: "var(--color-cybersecurity)" }, // New type
  ],
  2025: [
    { type: "Web Applications", count: 210, fill: "var(--color-web)" },
    { type: "Mobile Apps", count: 250, fill: "var(--color-mobile)" },
    { type: "AI/ML", count: 150, fill: "var(--color-aiml)" },
    { type: "IoT", count: 120, fill: "var(--color-iot)" },
    { type: "Cloud", count: 80, fill: "var(--color-cloud)" },
    { type: "Social Media", count: 20, fill: "var(--color-social)" },
    { type: "Data Science", count: 90, fill: "var(--color-data-science)" }, // New type
    { type: "Cybersecurity", count: 65, fill: "var(--color-cybersecurity)" }, // New type
  ],
};

const chartConfig = {
  "Web Applications": { label: "Web Applications", color: "#fcd34d" }, // yellow-300
  "Mobile Apps": { label: "Mobile Apps", color: "#fbbf24" }, // amber-400
  "AI/ML": { label: "AI/ML", color: "#f59e0b" }, // amber-500
  IoT: { label: "IoT", color: "#d97706" }, // amber-600
  Cloud: { label: "Cloud", color: "#b45309" }, // amber-700
  "Social Media": { label: "Social Media", color: "#92400e" }, // amber-800
  "Data Science": { label: "Data Science", color: "#78350f" }, // amber-900 (New)
  "Cybersecurity": { label: "Cybersecurity", color: "#facc15" }, // yellow-400 (New)
} satisfies ChartConfig;


export function ProjectTypesChart({ year }: { year: number }) {
  // Select data for the year, with a fallback to the latest year's data
  const chartData = dataByYear[year] ?? dataByYear[2025]; 

  const totalProjects = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="bg-transparent border-none shadow-none relative">
      <CardHeader className="items-center p-0 pb-4">
        <CardTitle className="text-lg text-yellow-400">Project Type Distribution</CardTitle>
        <CardDescription className="text-gray-400">
          Breakdown for the year {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}
              paddingAngle={4}
            >
                {chartData.map((entry) => (
                    <Cell key={entry.type} fill={chartConfig[entry.type as keyof typeof chartConfig]?.color || "#ccc"} />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-[2px]"
            />
          </PieChart>
        </ChartContainer>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%-1.5rem)] flex flex-col items-center pointer-events-none">
            <span className="text-3xl font-bold text-white">{totalProjects}</span>
            <span className="text-xs text-gray-400">Total Projects</span>
        </div>
      </CardContent>
    </Card>
  );
}
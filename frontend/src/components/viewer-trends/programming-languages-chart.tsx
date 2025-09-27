"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data now includes Go and Kotlin
const dataByYear: Record<number, { language: string; projects: number }[]> = {
  2023: [
    { language: "JavaScript", projects: 250 },
    { language: "Python", projects: 210 },
    { language: "Java", projects: 180 },
    { language: "PHP", projects: 150 },
    { language: "C#", projects: 120 },
    { language: "TypeScript", projects: 90 },
    { language: "Go", projects: 70 },
    { language: "Kotlin", projects: 55 },
  ],
  2024: [
    { language: "JavaScript", projects: 280 },
    { language: "Python", projects: 240 },
    { language: "Java", projects: 160 },
    { language: "PHP", projects: 130 },
    { language: "C#", projects: 110 },
    { language: "TypeScript", projects: 150 },
    { language: "Go", projects: 95 },
    { language: "Kotlin", projects: 75 },
  ],
  2025: [
    { language: "JavaScript", projects: 310 },
    { language: "Python", projects: 270 },
    { language: "Java", projects: 140 },
    { language: "PHP", projects: 110 },
    { language: "C#", projects: 95 },
    { language: "TypeScript", projects: 180 },
    { language: "Go", projects: 115 },
    { language: "Kotlin", projects: 90 },
  ],
};

const chartConfig = {
  projects: {
    label: "Projects",
    color: "#000", // FIX: Added a dummy color to satisfy TypeScript's type checker
  },
  JavaScript: { label: "JavaScript", color: "#fcd34d" }, // yellow-300
  Python: { label: "Python", color: "#fbbf24" }, // amber-400
  Java: { label: "Java", color: "#f59e0b" }, // amber-500
  PHP: { label: "PHP", color: "#d97706" }, // amber-600
  "C#": { label: "C#", color: "#b45309" }, // amber-700
  TypeScript: { label: "TypeScript", color: "#facc15" }, // yellow-400
  Go: { label: "Go", color: "#92400e" }, // amber-800
  Kotlin: { label: "Kotlin", color: "#78350f" }, // amber-900
} satisfies ChartConfig;

export function ProgrammingLanguagesChart({ year }: { year: number }) {
  const chartData = (dataByYear[year] ?? dataByYear[2025]).sort(
    (a, b) => b.projects - a.projects
  );

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg text-yellow-400">
          Most Used Programming Languages
        </CardTitle>
        <CardDescription className="text-gray-400">
          Project count by language for the year {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
            <YAxis
              dataKey="language"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              stroke="#a1a1aa"
              fontSize={12}
              width={80}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
              wrapperStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '0.5rem' }}
            />
            <Bar dataKey="projects" radius={5}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.language}
                  fill={chartConfig[entry.language as keyof typeof chartConfig]?.color || "#ccc"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
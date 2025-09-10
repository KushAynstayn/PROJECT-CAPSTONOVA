"use client";

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 📊 Programming languages data grouped by year
const chartDataByYear: Record<
  number,
  { language: string; correct: number; fill: string }[]
> = {
  2023: [
    { language: "Java", correct: 70, fill: "var(--chart-1)" },
    { language: "Python", correct: 85, fill: "var(--chart-2)" },
    { language: "PHP", correct: 100, fill: "var(--chart-3)" },
    { language: "JavaScript", correct: 80, fill: "var(--chart-4)" },
    { language: "C", correct: 69, fill: "var(--chart-5)" },
    { language: "C++", correct: 70, fill: "var(--chart-6)" },
  ],
  2024: [
    { language: "Java", correct: 75, fill: "var(--chart-1)" },
    { language: "Python", correct: 88, fill: "var(--chart-2)" },
    { language: "PHP", correct: 95, fill: "var(--chart-3)" },
    { language: "JavaScript", correct: 85, fill: "var(--chart-4)" },
    { language: "C", correct: 72, fill: "var(--chart-5)" },
    { language: "C++", correct: 74, fill: "var(--chart-6)" },
  ],
  2025: [
    { language: "Java", correct: 78, fill: "var(--chart-1)" },
    { language: "Python", correct: 90, fill: "var(--chart-2)" },
    { language: "PHP", correct: 92, fill: "var(--chart-3)" },
    { language: "JavaScript", correct: 88, fill: "var(--chart-4)" },
    { language: "C", correct: 75, fill: "var(--chart-5)" },
    { language: "C++", correct: 80, fill: "var(--chart-6)" },
  ],
};

const chartConfig = {
  correct: { label: "Correct" },
  Java: { label: "Java", color: "var(--chart-1)" },
  Python: { label: "Python", color: "var(--chart-2)" },
  PHP: { label: "PHP", color: "var(--chart-3)" },
  JavaScript: { label: "JavaScript", color: "var(--chart-4)" },
  C: { label: "C", color: "var(--chart-5)" },
  "C++": { label: "C++", color: "var(--chart-6)" },
} satisfies ChartConfig;

type ProgrammingLanguagesChartProps = {
  year: number;
};

export function ProgrammingLanguagesChart({ year }: ProgrammingLanguagesChartProps) {
  const chartData = chartDataByYear[year] ?? [];

  return (
    <>
      <style jsx global>
        {`
          :root {
            --chart-1: hsl(0 80% 60%);
            --chart-2: hsl(45 90% 60%);
            --chart-3: hsl(240 70% 50%);
            --chart-4: hsl(60 80% 55%);
            --chart-5: hsl(120 70% 50%);
            --chart-6: hsl(300 70% 50%);
          }

          /* Custom minimal white scrollbar */
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
          }
        `}
      </style>

      <Card className="bg-yellow-500/10 border border-yellow-500 h-full w-full">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-yellow-400">
            Programming Languages ({year})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-2 pt-0 h-[400px] overflow-y-auto scrollbar-thin">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 10, bottom: 20 }}
              barCategoryGap="20%"
            >
              <YAxis
                dataKey="language"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
                tick={{ fill: "#facc15" }}
              />
              <XAxis dataKey="correct" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="correct" layout="vertical" radius={6}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke={entry.fill}
                    strokeWidth={2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}

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

export const description = "A bar chart of environment study trends";

// 📊 Data grouped by year
const chartDataByYear: Record<
  number,
  { category: string; correct: number; fill: string }[]
> = {
  2023: [
    { category: "Agriculture", correct: 70, fill: "var(--chart-1)" },
    { category: "Education", correct: 85, fill: "var(--chart-2)" },
    { category: "Commerce", correct: 100, fill: "var(--chart-3)" },
    { category: "Health", correct: 80, fill: "var(--chart-4)" },
    { category: "Home", correct: 75, fill: "var(--chart-5)" },
    { category: "Livelihood", correct: 69, fill: "var(--chart-6)" },
    { category: "Environment", correct: 72, fill: "var(--chart-7)" },
    { category: "Governance", correct: 60, fill: "var(--chart-8)" },
    { category: "Media and Entertainment", correct: 77, fill: "var(--chart-9)" },
    { category: "Disaster Management", correct: 68, fill: "var(--chart-10)" },
    { category: "Social Sciences", correct: 82, fill: "var(--chart-11)" },
    { category: "Power and Energy", correct: 90, fill: "var(--chart-12)" },
    { category: "Telecommunication", correct: 74, fill: "var(--chart-13)" },
    { category: "Tourism", correct: 88, fill: "var(--chart-14)" },
  ],
  2024: [
    { category: "Agriculture", correct: 74, fill: "var(--chart-1)" },
    { category: "Education", correct: 88, fill: "var(--chart-2)" },
    { category: "Commerce", correct: 95, fill: "var(--chart-3)" },
    { category: "Health", correct: 85, fill: "var(--chart-4)" },
    { category: "Home", correct: 78, fill: "var(--chart-5)" },
    { category: "Livelihood", correct: 72, fill: "var(--chart-6)" },
    { category: "Environment", correct: 76, fill: "var(--chart-7)" },
    { category: "Governance", correct: 65, fill: "var(--chart-8)" },
    { category: "Media and Entertainment", correct: 80, fill: "var(--chart-9)" },
    { category: "Disaster Management", correct: 70, fill: "var(--chart-10)" },
    { category: "Social Sciences", correct: 85, fill: "var(--chart-11)" },
    { category: "Power and Energy", correct: 92, fill: "var(--chart-12)" },
    { category: "Telecommunication", correct: 77, fill: "var(--chart-13)" },
    { category: "Tourism", correct: 90, fill: "var(--chart-14)" },
  ],
  2025: [
    { category: "Agriculture", correct: 78, fill: "var(--chart-1)" },
    { category: "Education", correct: 90, fill: "var(--chart-2)" },
    { category: "Commerce", correct: 98, fill: "var(--chart-3)" },
    { category: "Health", correct: 87, fill: "var(--chart-4)" },
    { category: "Home", correct: 80, fill: "var(--chart-5)" },
    { category: "Livelihood", correct: 75, fill: "var(--chart-6)" },
    { category: "Environment", correct: 79, fill: "var(--chart-7)" },
    { category: "Governance", correct: 68, fill: "var(--chart-8)" },
    { category: "Media and Entertainment", correct: 83, fill: "var(--chart-9)" },
    { category: "Disaster Management", correct: 72, fill: "var(--chart-10)" },
    { category: "Social Sciences", correct: 87, fill: "var(--chart-11)" },
    { category: "Power and Energy", correct: 95, fill: "var(--chart-12)" },
    { category: "Telecommunication", correct: 80, fill: "var(--chart-13)" },
    { category: "Tourism", correct: 93, fill: "var(--chart-14)" },
  ],
};

const chartConfig = {
  correct: { label: "Correct" },
  Agriculture: { label: "Agriculture", color: "var(--chart-1)" },
  Education: { label: "Education", color: "var(--chart-2)" },
  Commerce: { label: "Commerce", color: "var(--chart-3)" },
  Health: { label: "Health", color: "var(--chart-4)" },
  Home: { label: "Home", color: "var(--chart-5)" },
  Livelihood: { label: "Livelihood", color: "var(--chart-6)" },
  Environment: { label: "Environment", color: "var(--chart-7)" },
  Governance: { label: "Governance", color: "var(--chart-8)" },
  "Media and Entertainment": { label: "Media and Entertainment", color: "var(--chart-9)" },
  "Disaster Management": { label: "Disaster Management", color: "var(--chart-10)" },
  "Social Sciences": { label: "Social Sciences", color: "var(--chart-11)" },
  "Power and Energy": { label: "Power and Energy", color: "var(--chart-12)" },
  Telecommunication: { label: "Telecommunication", color: "var(--chart-13)" },
  Tourism: { label: "Tourism", color: "var(--chart-14)" },
} satisfies ChartConfig;

type EnvironmentTrendsChartProps = {
  year: number;
};

export function EnvironmentTrendsChart({ year }: EnvironmentTrendsChartProps) {
  const chartData = chartDataByYear[year] ?? [];

  return (
    <>
      <style jsx global>{`
        :root {
          --chart-1: hsl(0 80% 60%);
          --chart-2: hsl(45 90% 60%);
          --chart-3: hsl(240 70% 50%);
          --chart-4: hsl(60 80% 55%);
          --chart-5: hsl(120 70% 50%);
          --chart-6: hsl(300 70% 50%);
          --chart-7: hsl(15 80% 60%);
          --chart-8: hsl(75 70% 50%);
          --chart-9: hsl(200 80% 50%);
          --chart-10: hsl(340 70% 50%);
          --chart-11: hsl(180 70% 50%);
          --chart-12: hsl(30 70% 50%);
          --chart-13: hsl(270 70% 50%);
          --chart-14: hsl(90 70% 50%);
        }

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
      `}</style>

      <Card className="bg-yellow-500/10 border border-yellow-500 h-full w-full">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-yellow-400">
            Environment Study Trends ({year})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-2 pt-0 h-[400px] overflow-y-auto scrollbar-thin">
          <ChartContainer config={chartConfig} className="h-[360px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 70, right: 20, top: 10, bottom: 20 }}
              barCategoryGap="40%"
            >
              <YAxis
                dataKey="category"
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

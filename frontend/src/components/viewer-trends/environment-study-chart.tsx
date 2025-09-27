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

// Mock data for environment study trends, grouped by year
const dataByYear: Record<number, { category: string; projects: number }[]> = {
  2023: [
    { category: "Commerce", projects: 100 },
    { category: "Power & Energy", projects: 90 },
    { category: "Tourism", projects: 88 },
    { category: "Education", projects: 85 },
    { category: "Social Sciences", projects: 82 },
    { category: "Health", projects: 80 },
    { category: "Media & Ent.", projects: 77 },
    { category: "Telecommunication", projects: 74 },
    { category: "Environment", projects: 72 },
    { category: "Agriculture", projects: 70 },
    { category: "Livelihood", projects: 69 },
    { category: "Disaster Mgmt.", projects: 68 },
    { category: "Governance", projects: 60 },
  ],
  2024: [
    { category: "Commerce", projects: 95 },
    { category: "Power & Energy", projects: 92 },
    { category: "Tourism", projects: 90 },
    { category: "Education", projects: 88 },
    { category: "Social Sciences", projects: 85 },
    { category: "Health", projects: 85 },
    { category: "Media & Ent.", projects: 80 },
    { category: "Telecommunication", projects: 77 },
    { category: "Environment", projects: 76 },
    { category: "Agriculture", projects: 74 },
    { category: "Livelihood", projects: 72 },
    { category: "Disaster Mgmt.", projects: 70 },
    { category: "Governance", projects: 65 },
  ],
  2025: [
    { category: "Commerce", projects: 98 },
    { category: "Power & Energy", projects: 95 },
    { category: "Tourism", projects: 93 },
    { category: "Education", projects: 90 },
    { category: "Social Sciences", projects: 87 },
    { category: "Health", projects: 87 },
    { category: "Media & Ent.", projects: 83 },
    { category: "Telecommunication", projects: 80 },
    { category: "Environment", projects: 79 },
    { category: "Agriculture", projects: 78 },
    { category: "Livelihood", projects: 75 },
    { category: "Disaster Mgmt.", projects: 72 },
    { category: "Governance", projects: 68 },
  ],
};

const chartConfig = {
  projects: { label: "Projects", color: "#000" }, // Dummy color for TS
  Commerce: { label: "Commerce", color: "#fcd34d" },
  "Power & Energy": { label: "Power & Energy", color: "#fbbf24" },
  Tourism: { label: "Tourism", color: "#f59e0b" },
  Education: { label: "Education", color: "#d97706" },
  "Social Sciences": { label: "Social Sciences", color: "#b45309" },
  Health: { label: "Health", color: "#92400e" },
  "Media & Ent.": { label: "Media & Entertainment", color: "#78350f" },
  Telecommunication: { label: "Telecommunication", color: "#fcd34d" },
  Environment: { label: "Environment", color: "#fbbf24" },
  Agriculture: { label: "Agriculture", color: "#f59e0b" },
  Livelihood: { label: "Livelihood", color: "#d97706" },
  "Disaster Mgmt.": { label: "Disaster Management", color: "#b45309" },
  Governance: { label: "Governance", color: "#92400e" },
} satisfies ChartConfig;

export function EnvironmentStudyChart({ year }: { year: number }) {
  const chartData = dataByYear[year] ?? dataByYear[2025];

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg text-yellow-400">
          Environment Study Trends
        </CardTitle>
        <CardDescription className="text-gray-400">
          Project distribution by application domain for {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ left: 20 }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              stroke="#a1a1aa"
              fontSize={12}
              width={110} // Allocate more space for long labels
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
                  key={entry.category}
                  fill={chartConfig[entry.category as keyof typeof chartConfig]?.color || "#ccc"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

// Mock data for advisers, grouped by year
const dataByYear: Record<number, { adviser: string; projects: number }[]> = {
  2023: [
    { adviser: "Dr. Evelyn Cruz", projects: 12 },
    { adviser: "Prof. Marco Reyes", projects: 10 },
    { adviser: "Dr. Lilian Santos", projects: 9 },
    { adviser: "Prof. David Garcia", projects: 7 },
    { adviser: "Dr. Angela Mendoza", projects: 6 },
    { adviser: "Prof. John Dela Cruz", projects: 5 },
    { adviser: "Dr. Maria Gonzales", projects: 4 },
  ],
  2024: [
    { adviser: "Dr. Evelyn Cruz", projects: 14 },
    { adviser: "Prof. Marco Reyes", projects: 11 },
    { adviser: "Dr. Lilian Santos", projects: 10 },
    { adviser: "Prof. David Garcia", projects: 8 },
    { adviser: "Dr. Angela Mendoza", projects: 7 },
    { adviser: "Prof. John Dela Cruz", projects: 6 },
    { adviser: "Dr. Maria Gonzales", projects: 5 },
  ],
  2025: [
    { adviser: "Dr. Evelyn Cruz", projects: 15 },
    { adviser: "Prof. Marco Reyes", projects: 13 },
    { adviser: "Dr. Lilian Santos", projects: 11 },
    { adviser: "Prof. David Garcia", projects: 9 },
    { adviser: "Dr. Angela Mendoza", projects: 8 },
    { adviser: "Prof. John Dela Cruz", projects: 7 },
    { adviser: "Dr. Maria Gonzales", projects: 6 },
  ],
};

const chartConfig = {
  projects: {
    label: "Supervised Projects",
    color: "#f59e0b", // amber-500
  },
} satisfies ChartConfig;

export function TopAdvisersChart({ year }: { year: number }) {
  // Select data, sort it descending, and take the top 5
  const topAdvisersData = (dataByYear[year] ?? dataByYear[2025])
    .sort((a, b) => b.projects - a.projects)
    .slice(0, 5);

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg text-yellow-400">Top 5 Advisers</CardTitle>
        <CardDescription className="text-gray-400">
          By projects supervised in {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            data={topAdvisersData}
            margin={{ top: 20, right: 10, left: -10, bottom: 50 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="adviser"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              angle={-45} // Rotate labels to prevent overlap
              textAnchor="end"
              stroke="#a1a1aa"
              fontSize={12}
              // Set a fixed height for the XAxis to ensure labels have enough space
              height={50} 
            />
            <YAxis stroke="#a1a1aa" fontSize={12} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
               wrapperStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '0.5rem' }}
            />
            <Bar
              dataKey="projects"
              fill={chartConfig.projects.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for the chart. In a real application, you would fetch this.
const chartData = [
  { year: 2018, BSIS: 170, BSIT: 220, "BIT-CT": 85 },
  { year: 2019, BSIS: 180, BSIT: 320, "BIT-CT": 120 },
  { year: 2020, BSIS: 240, BSIT: 255, "BIT-CT": 135 },
  { year: 2021, BSIS: 260, BSIT: 200, "BIT-CT": 150 },
  { year: 2022, BSIS: 240, BSIT: 265, "BIT-CT": 170 },
  { year: 2023, BSIS: 220, BSIT: 340, "BIT-CT": 190 },
  { year: 2024, BSIS: 245, BSIT: 210, "BIT-CT": 175 },
  { year: 2025, BSIS: 220, BSIT: 200, "BIT-CT": 160 },
];

const chartConfig = {
  BSIS: {
    label: "BSIS",
    color: "#fbbf24", // amber-400
  },
  BSIT: {
    label: "BSIT",
    color: "#f59e0b", // amber-500
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "#d97706", // amber-600
  },
} satisfies ChartConfig;

interface ArchivedProjectsChartProps {
  year: number; // The year selected from the picker
}

export function ArchivedProjectsChart({ year: selectedYear }: ArchivedProjectsChartProps) {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg text-yellow-400">
          Archived Capstone Projects
        </CardTitle>
        <CardDescription className="text-gray-400">
          Total projects archived annually by course, highlighting {selectedYear}.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#a1a1aa"
              fontSize={12}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              stroke="#a1a1aa" 
              fontSize={12} 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
              wrapperStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '0.5rem' }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            
            {/* Render bars for each course */}
            {Object.entries(chartConfig).map(([key, config]) => (
              <Bar key={key} dataKey={key} radius={4}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={config.color}
                    // Apply opacity to highlight the selected year
                    fillOpacity={entry.year === selectedYear ? 1 : 0.3}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
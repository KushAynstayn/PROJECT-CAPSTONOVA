"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  ResponsiveContainer,
  Cell, // 1. Import the Cell component
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a label";

// 2. Add a `fill` property with a unique maroon color to each data object
const chartData = [
  { type: "Web App", projects: 51, fill: "#800000" }, // Maroon
  { type: "Mobile App", projects: 25, fill: "#A52A2A" }, // Brown
  { type: "Hybrid", projects: 42, fill: "#B22222" }, // Firebrick
  { type: "IoT", projects: 15, fill: "#C0392B" }, // Pomegranate
];

const chartConfig = {
  projects: {
    label: "Projects",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartBarLabel() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Projects by Type</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              {/* 3. Remove the static `fill` prop from <Bar> and map over the data to create a <Cell> for each bar */}
              <Bar dataKey="projects" radius={8}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.type}`} fill={entry.fill} />
                ))}
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description =
  "A line chart showing programming tools usage by students";

const chartData = [
  { tool: "HTML", Projects: 15 },
  { tool: "CSS", Projects: 7 },
  { tool: "PHP", Projects: 25 },
  { tool: "Python", Projects: 12 },
  { tool: "TypeScript", Projects: 5 },
  { tool: "Java", Projects: 18 },
  { tool: "C#", Projects: 10 },
  { tool: "C++", Projects: 8 },
  { tool: "Ruby", Projects: 6 },
  { tool: "Go", Projects: 9 },
];

const chartConfig = {
  Projects: {
    label: "Projects",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineLinear() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Programming Tools Usage</CardTitle>
        
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[140px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 35,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tool"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0} // show all ticks
              angle={0} // rotate labels
              textAnchor="end"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="tool"
                  labelFormatter={(name) => `${name}`}
                />
              }
            />
            <Line
              dataKey="Projects"
              type="linear"
              stroke="var(--color-Projects)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

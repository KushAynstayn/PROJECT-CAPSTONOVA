"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  advisers: {
    label: "Advisers",
    color: "#C75B5B", // Changed to light maroon
  },
} satisfies ChartConfig;

export function AdviserDistributionChart({
  adviserCount,
}: {
  adviserCount: number;
}) {
  const chartData = [
    { course: "Advisers", advisers: adviserCount, fill: "#C75B5B" }, // Changed to light maroon
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Advisers</CardTitle>
        <CardDescription>Total: {adviserCount} Advisers</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="advisers"
              nameKey="course"
              innerRadius={50}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.course}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
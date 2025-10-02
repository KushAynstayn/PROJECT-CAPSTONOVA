"use client";

import { Pie, PieChart, Legend } from "recharts";

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
  count: {
    label: "Admins",
  },
  Admins: {
    label: "Admins",
    color: "#8B0000", // Changed from dark blue to maroon
  },
} satisfies ChartConfig;

export function AdminDistributionChart({ adminCount }: { adminCount: number }) {
  const chartData = [{ course: "Admins", count: adminCount, fill: "#8B0000" }]; // Changed from dark blue to maroon
  return (
    <Card className="border border-gray-300 shadow-md rounded-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Admins</CardTitle>
        <CardDescription>Total: {adminCount} Admins</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="course" />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
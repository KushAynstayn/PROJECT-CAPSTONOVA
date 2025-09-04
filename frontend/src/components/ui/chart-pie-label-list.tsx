"use client";

import { useMemo } from "react";
// 1. Import ResponsiveContainer
import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader, // Import CardHeader
  CardTitle,  // Import CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend in the footer";

const chartData = [
  { role: "leaders", count: 275, fill: "#800000" },
  { role: "advisers", count: 200, fill: "#B33A3A" },
];

const chartConfig = {
  count: {
    label: "Count",
  },
  leaders: {
    label: "Project Leaders",
    color: "#800000",
  },
  advisers: {
    label: "Project Advisers",
    color: "#B33A3A",
  },
} satisfies ChartConfig;

export function ChartPieLabelList() {
  const totalMembers = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    // 2. Ensure the card is a flex container with a defined height
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Role Distribution</CardTitle>
      </CardHeader>
      
      {/* 3. CardContent will now fill the available space */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          // 4. Remove fixed height and let it fill the container
          className="h-full w-full"
        >
          {/* 5. Wrap the PieChart in a ResponsiveContainer */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="role"
                innerRadius="60%" // Use percentages for responsive radius
                outerRadius="90%"
              >
                <LabelList
                  dataKey="count"
                  className="fill-white"
                  stroke="none"
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) =>
                    `${((value / totalMembers) * 100).toFixed(0)}%`
                  }
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex w-full items-center justify-center gap-4">
          {chartData.map((item) => (
            <div key={item.role} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="font-medium text-muted-foreground">
                {chartConfig[item.role as keyof typeof chartConfig].label}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
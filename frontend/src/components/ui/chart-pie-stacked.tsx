"use client";

import * as React from "react";
import { Legend, Label, Pie, PieChart, Cell } from "recharts";

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

interface ProponentsData {
  total: number;
  by_department: { department: string; count: number }[];
}

interface ProponentDistributionChartProps {
  proponentsData: ProponentsData;
}

const PALETTE = ["#660000", "#ea0700", "#ff8383", "#fec832", "#0c284d"];

export function ProponentDistributionChart({
  proponentsData,
}: ProponentDistributionChartProps) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const data = proponentsData.by_department.map((d, index) => ({
      course: d.department,
      proponents: d.count,
      fill: PALETTE[index % PALETTE.length],
    }));

    const config: ChartConfig = data.reduce((acc, entry) => {
      acc[entry.course] = {
        label: entry.course,
        color: entry.fill,
      };
      return acc;
    }, {} as ChartConfig);
    config.proponents = { label: "Proponents" };

    return { chartData: data, chartConfig: config };
  }, [proponentsData]);

  const totalProponents = proponentsData.total;

  return (
    <Card className="border border-gray-300 shadow-md rounded-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proponents</CardTitle>
        <CardDescription>Total: {totalProponents} Proponents</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="proponents"
              nameKey="course"
              innerRadius={60}
              outerRadius={90}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalProponents}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground"
                        >
                          Proponents
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

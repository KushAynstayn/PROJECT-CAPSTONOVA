"use client";

import { useEffect, useState } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  projects: {
    label: "Projects",
  },
} satisfies ChartConfig;

export function ChartRadialShape() {
  const [totalAdvisers, setTotalAdvisers] = useState(32);

  const chartData = [
    { name: "projects", value: totalAdvisers, fill: "var(--chart-2)" },
  ];

  return (
    // CHANGED: Use w-full and h-full to fill the parent container
    <Card className="w-full h-full">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={450}
            innerRadius={70}
            outerRadius={110}
          >
            <RadialBar
              dataKey="value"
              data={[{ value: 100 }]}
              cornerRadius={60}
              fill="#d1d5db"
            />
            <RadialBar dataKey="value" cornerRadius={50} fill="teal" />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-black text-xl font-bold"
                        >
                          {totalAdvisers}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 1) + 13}
                          className="fill-black text-sm font-semibold"
                        >
                          Project Advisers
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
"use client";

import { PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const totalProjectLeaders = 95;

const chartData = [
  {
    role: "projectLeaders",
    value: totalProjectLeaders,
    fill: "var(--color-leaders)",
  },
];

const chartConfig = {
  projectLeaders: {
    label: "Project Leaders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartRadialText() {
  return (
    // CHANGED: Use w-full and h-full to fill the parent container
    <Card className="w-full h-full">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[185px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={70}
            outerRadius={110}
          >
            <RadialBar
              dataKey="value"
              data={[{ value: 100 }]}
              cornerRadius={40}
              fill="#d1d5db"
            />
            <RadialBar dataKey="value" cornerRadius={50} fill="black" />
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
                          {totalProjectLeaders}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 1) + 13}
                          className="fill-black text-sm font-semibold"
                        >
                          Project Leaders
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
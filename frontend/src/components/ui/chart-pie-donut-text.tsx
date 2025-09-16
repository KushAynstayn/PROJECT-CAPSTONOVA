"use client";

import * as React from "react";
import { Pie, PieChart, Label, Cell } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SubmissionData {
  course: string;
  count: number;
}

interface ModifiedPieChartProps {
  size?: number;
  data: SubmissionData[];
}

const chartConfig = {
  submissions: {
    label: "Submissions",
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "#cc3333",
  },
  BSIS: {
    label: "BSIS",
    color: "#0c284d",
  },
  BSIT: {
    label: "BSIT",
    color: "#fec832",
  },
} satisfies ChartConfig;

const colorMapping: { [key: string]: string } = {
  "BIT-CT": "#cc3333",
  BSIS: "#0c284d",
  BSIT: "#fec832",
};

export function ModifiedPieChart({
  size = 250,
  data = [],
}: ModifiedPieChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    submissions: item.count, // recharts Pie component expects a specific key
    fill: colorMapping[item.course] || "#cccccc", // Add fill color
  }));

  const totalSubmissions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.submissions, 0);
  }, [chartData]);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="submissions"
          nameKey="course"
          innerRadius={100}
          strokeWidth={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalSubmissions.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Total Submissions
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

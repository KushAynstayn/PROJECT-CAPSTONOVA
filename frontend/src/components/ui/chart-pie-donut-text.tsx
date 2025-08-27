"use client"

import * as React from "react"
import { Pie, PieChart, Label, Cell } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ## 1. Update colors in chartData ##
const chartData = [
  { course: "BIT-CT", submissions: 3, fill: "#cc3333" }, // Green changed to red
  { course: "BSIS", submissions: 20, fill: "#0c284d" }, // Blue changed to dark blue
  { course: "BSIT", submissions: 15, fill: "#fec832" }, // Purple changed to yellow/gold
]

// ## 2. Update colors in chartConfig ##
const chartConfig = {
  submissions: {
    label: "Submissions",
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "#cc3333", // Green changed to red
  },
  BSIS: {
    label: "BSIS",
    color: "#0c284d", // Blue changed to dark blue
  },
  BSIT: {
    label: "BSIT",
    color: "#fec832", // Purple changed to yellow/gold
  },
} satisfies ChartConfig

interface ModifiedPieChartProps {
  size?: number; 
}

export function ModifiedPieChart({ size = 250 }: ModifiedPieChartProps) {
  const totalSubmissions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.submissions, 0)
  }, [])

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
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
"use client"

import * as React from "react"
// Cell is now imported to apply individual colors
import { Cell, Legend, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated data with your new fill colors
const chartData = [
  { course: "BIT-CT", advisers: 11, fill: "#2d8bba" }, // Red is now light blue
  { course: "BSIS", advisers: 11, fill: "#0c284d" },   // Blue is now dark blue
  { course: "BSIT", advisers: 10, fill: "#8eb5ea" },   
]

// Updated chart configuration to match the new colors
const chartConfig = {
  advisers: {
    label: "Advisers",
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "#2d8bba", 
  },
  BSIS: {
    label: "BSIS",
    color: "#0c284d",
  },
  BSIT: {
    label: "BSIT",
    color: "#8eb5ea",
  },
} satisfies ChartConfig

export function AdviserDistributionChart() {
  return (
    <Card className="flex flex-col w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Advisers</CardTitle>
        <CardDescription>Total: 32 Advisers</CardDescription>
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
              {/* This map is necessary to apply the individual fill colors */}
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.course}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
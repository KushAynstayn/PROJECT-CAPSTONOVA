"use client"

import * as React from "react"
// 1. Import 'Cell' from recharts
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

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

// 2. Add a 'fill' property with the correct color to each data item
const chartData = [
    { course: "BSIS", guests: 15, fill: "#093e00" }, // Blue
    { course: "BSIT", guests: 12, fill: "#0f8516" }, // Purple
    { course: "BIT-CT", guests: 8, fill: "#8adb90" },  // Green
]

const chartConfig = {
  guests: {
    label: "Guests",
    // This color is now a fallback and used by the tooltip
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function GuestDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guests</CardTitle>
        <CardDescription>Total: 35 Guests</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="course"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* 3. Map over the data to render a Cell with a unique color for each bar */}
            <Bar dataKey="guests" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.course} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
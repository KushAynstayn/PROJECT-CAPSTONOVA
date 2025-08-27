"use client"

import { Pie, PieChart, Legend } from "recharts"

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

// ## THE COLORS ARE UPDATED HERE ##
const chartData = [
  { course: "BIT-CT", count: 1, fill: "#fec832" }, // Green is now Red
  { course: "BSIS", count: 1, fill: "#cc9747" }, // Blue is now Dark Blue
  { course: "BSIT", count: 1, fill: "#f5dda8" }, // Purple is now Yellow/Gold
]

// ## AND ALSO UPDATED HERE FOR THE LEGEND ##
const chartConfig = {
  count: {
    label: "Admins",
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "#cc3333", // Green -> Red
  },
  BSIS: {
    label: "BSIS",
    color: "#0c284d", // Blue -> Dark Blue
  },
  BSIT: {
    label: "BSIT",
    color: "#fec832", // Purple -> Yellow/Gold
  },
} satisfies ChartConfig

export function AdminDistributionChart() {
  return (
    <Card className="flex flex-col w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Admins</CardTitle>
        <CardDescription>Total: 3 Admins</CardDescription>
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
  )
}
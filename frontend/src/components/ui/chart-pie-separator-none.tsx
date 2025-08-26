"use client"

import { Pie, PieChart, Cell } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { course: "BIT-CT", records: 5, fill: "#34d399" },
  { course: "BSIS", records: 10, fill: "#3b82f6" },
  { course: "BSIT", records: 20, fill: "#a78bfa" },
]

const chartConfig = {
  records: {
    label: "Records",
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "#34d399",
  },
  BSIS: {
    label: "BSIS",
    color: "#3b82f6",
  },
  BSIT: {
    label: "BSIT",
    color: "#a78bfa",
  },
} satisfies ChartConfig

export  function ModifiedPieChart() {
  return (
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
          dataKey="records"
          nameKey="course"
          stroke="0"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
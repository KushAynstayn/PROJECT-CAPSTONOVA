"use client"

import * as React from "react"
import { Legend, Label, Pie, PieChart } from "recharts"

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

const chartData = [
  { course: "BSIS", proponents: 15, fill: "var(--color-bsis)" },
  { course: "BSIT", proponents: 12, fill: "var(--color-bsit)" },
  { course: "BIT-CT", proponents: 8, fill: "var(--color-bit-ct)" },
]

const chartConfig = {
  proponents: {
    label: "Proponents",
  },
  bsis: {
    label: "BSIS",
    color: "#660000",
  },
  bsit: {
    label: "BSIT",
    color: "#ea0700",
  },
  "bit-ct": {
    label: "BIT-CT",
    color: "#ff8383",
  },
} satisfies ChartConfig

export function ProponentDistributionChart() {
  const totalProponents = React.useMemo(() => {
    return chartData.reduce((sum, current) => sum + current.proponents, 0)
  }, [])

  return (
    <Card className="flex flex-col w-[300px]">
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
                    )
                  }
                }}
              />
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart showing projects handled by advisers."

const chartData = [
  { adviser: "drReyes", projects: 10, fill: "var(--color-drReyes)" },
  { adviser: "profSantos", projects: 9, fill: "var(--color-profSantos)" },
  { adviser: "drCruz", projects: 8, fill: "var(--color-drCruz)" },
  { adviser: "profGarcia", projects: 7, fill: "var(--color-profGarcia)" },
  { adviser: "msOcampo", projects: 5, fill: "var(--color-msOcampo)" },
];

const chartConfig = {
  projects: {
    label: "Projects",
  },
  label: {
    color: "hsl(var(--background))",
  },
  drReyes: {
    label: "Dr. Reyes",
    color: "var(--chart-1)",
  },
  profSantos: {
    label: "Prof. Santos",
    color: "var(--chart-2)",
  },
  drCruz: {
    label: "Dr. Cruz",
    color: "var(--chart-3)",
  },
  profGarcia: {
    label: "Prof. Garcia",
    color: "var(--chart-4)",
  },
  msOcampo: {
    label: "Ms. Ocampo",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartBarLabelCustom() {
  return (
    
      <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Projects Handled by Adviser</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[140px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 5, right: 5 }}
          >
            <YAxis dataKey="adviser" type="category" hide />
            <XAxis dataKey="projects" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" hideLabel />}
            />
            <Bar dataKey="projects" layout="vertical" radius={5}>
              <LabelList
                dataKey="adviser"
                position="insideLeft"
                offset={8}
                className="fill-[var(--color-label)]"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  typeof chartConfig[value] === "object" && "label" in chartConfig[value] && typeof chartConfig[value].label === "string"
                    ? chartConfig[value].label
                    : value
                }
              />
              <LabelList
                dataKey="projects"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
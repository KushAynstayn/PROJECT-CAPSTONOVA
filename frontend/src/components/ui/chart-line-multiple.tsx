"use client"

import * as React from "react"
import { useInView } from "react-intersection-observer"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple line chart showing programming language trends."

const currentYear = new Date().getFullYear();

// --- Improved Mock Data with Varied Trends ---
const chartData = Array.from({ length: currentYear - 2018 + 1 }, (_, i) => {
    const year = 2018 + i;
    return {
        year: year.toString(),
        Python: 200 + i * 70 + Math.floor(Math.random() * 40),
        JavaScript: 280 + i * 15 + Math.floor(Math.random() * 30),
        TypeScript: 80 + i * i * 12 + Math.floor(Math.random() * 50),
        Go: 60 + Math.min(i, 5) * 60 + Math.floor(Math.random() * 25),
        Rust: 20 + i * i * 5 + Math.floor(Math.random() * 35),
        CPlusPlus: 350 - i * 20 + Math.floor(Math.random() * 20),
    };
});

const chartConfig = {
  Python: {
    label: "Python",
    color: "hsl(48, 96%, 56%)",
  },
  JavaScript: {
    label: "JavaScript",
    color: "hsl(35, 91%, 65%)",
  },
  TypeScript: {
    label: "TypeScript",
    color: "hsl(54, 95%, 70%)",
  },
  Go: {
    label: "Go",
    color: "hsl(30, 95%, 53%)",
  },
  Rust: {
    label: "Rust",
    color: "hsl(24, 95%, 53%)",
  },
  CPlusPlus: {
    label: "C++",
    color: "hsl(210, 85%, 65%)",
  },
} satisfies ChartConfig

export function ChartLineMultiple() {
  const { ref, inView } = useInView({
    // CHANGE: The 'triggerOnce: true' option has been removed.
    // Now the animation will re-trigger every time it enters the view.
    threshold: 0.3,
  });

  return (
    <Card ref={ref} className="bg-black text-gray-300 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Programming Language Trends</CardTitle>
        <CardDescription>Popularity Index: 2018 - {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        {inView ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} className="stroke-gray-700" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  className="bg-white border-gray-700 text-black"
                  indicator="dot"
                  animationDuration={500}
                />}
              />
              {Object.keys(chartConfig).map((key) => (
                  <Line
                      key={key}
                      dataKey={key}
                      type="monotone"
                      stroke={`var(--color-${key})`}
                      strokeWidth={2}
                      dot={true}
                      animationDuration={1200} 
                      animationEasing="ease-in-out"
                  />
              ))}
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px]" />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-white">
              Python shows significant growth <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-gray-400">
              Showing popularity trends from 2018 to {currentYear}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
"use client"

import * as React from "react"
import { useInView } from "react-intersection-observer"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart showing total archived projects per year by course."

// --- Define the shape of the project data ---
type MonthlyProjectData = {
  month: string;
  bsis: number;
  bsit: number;
  bit_ct: number;
};

type ChartDataByYear = {
  [year: string]: MonthlyProjectData[];
};

type YearlyTotalData = {
  year: string;
  bsis: number;
  bsit: number;
  bit_ct: number;
};

// --- Helper function to generate mock monthly data ---
const generateMonthlyDataForYear = (): MonthlyProjectData[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map(month => ({
    month,
    bsis: Math.floor(Math.random() * (30 - 5 + 1) + 5),
    bsit: Math.floor(Math.random() * (40 - 5 + 1) + 5),
    bit_ct: Math.floor(Math.random() * (25 - 5 + 1) + 5),
  }));
};

// --- Generate nested monthly data ---
const currentYear = new Date().getFullYear();
const allMonthlyData = Array.from({ length: currentYear - 2018 + 1 }, (_, i) => 2018 + i)
  .reduce((acc, year) => {
    acc[year] = generateMonthlyDataForYear();
    return acc;
  }, {} as ChartDataByYear);

// --- Process monthly data into yearly totals ---
const chartData: YearlyTotalData[] = Object.entries(allMonthlyData).map(([year, monthlyData]) => ({
    year: year,
    bsis: monthlyData.reduce((sum, month) => sum + month.bsis, 0),
    bsit: monthlyData.reduce((sum, month) => sum + month.bsit, 0),
    bit_ct: monthlyData.reduce((sum, month) => sum + month.bit_ct, 0),
}));

// --- Chart config with the gold tone color scheme ---
const chartConfig = {
  bsis: { label: "BSIS", color: "hsl(45, 80%, 65%)" },   // Light Gold
  bsit: { label: "BSIT", color: "hsl(45, 85%, 50%)" },   // Medium Gold
  bit_ct: { label: "BIT-CT", color: "hsl(40, 80%, 40%)" }, // Dark Gold
} satisfies ChartConfig

export function ChartBarMultiple() {
  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  return (
    <Card ref={ref} className="bg-black text-gray-300 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Archived Capstone Projects</CardTitle>
        <CardDescription>Total projects per year: 2018 - {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        {inView ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} className="stroke-gray-700" />
              <XAxis
                dataKey="year"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="bg-white text-black border-gray-700" indicator="dot" />}
              />
              {/* This legend will show the color for each course */}
              <ChartLegend content={<ChartLegendContent />} />
              
              {Object.entries(chartConfig).map(([key, { color }]) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200} 
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px]" />
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          Steady increase in archived projects <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-400">
          Showing projects archived annually by course
        </div>
      </CardFooter>
    </Card>
  )
}
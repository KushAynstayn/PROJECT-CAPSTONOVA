"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartData {
  year: string;
  [adviser: string]: number | string;
}

interface AdviserLoadChartProps {
  data: ChartData[];
}

const COLOR_PALETTE = ["#800000", "#9A2A2A", "#B35353", "#CC7D7D", "#E6A6A6", "#8B4513", "#A0522D", "#CD853F", "#D2B48C", "#F5DEB3"];

export function AdviserLoadChart({ data }: AdviserLoadChartProps) {
  const [selectedAdviser, setSelectedAdviser] = React.useState<string>("all");

  // This determines if we are in "single year" mode
  const isSingleYearView = data.length === 1;

  // When the data changes (e.g., switching from range to single), reset the dropdown
  React.useEffect(() => {
    setSelectedAdviser("all");
  }, [data]);

  if (data.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Advisory Load</CardTitle>
          <CardDescription>Please select a year or range to view the data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const adviserNames = Object.keys(data[0]).filter(key => key !== 'year');
  const chartConfig = adviserNames.reduce((acc, name, index) => {
    acc[name] = { label: name, color: COLOR_PALETTE[index % COLOR_PALETTE.length] };
    return acc;
  }, {} as ChartConfig);

  // Data for comparing all advisers in a single year
  const singleYearComparisonData = adviserNames.map((name, index) => ({
    name,
    projects: data[0][name] as number,
    fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  // Data for comparing total adviser load over a range
  const rangeComparisonData = adviserNames.map((name, index) => ({
      name,
      projects: data.reduce((sum, yearData) => sum + (yearData[name] as number), 0),
      fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  const isAllAdvisersSelected = selectedAdviser === "all";

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>
          Advisory Load for {isSingleYearView ? data[0].year : `${data[0].year} - ${data[data.length - 1].year}`}
        </CardTitle>
        <CardDescription>
          {isAllAdvisersSelected
            ? "Comparing total projects handled by each adviser."
            : `Showing project trend for ${selectedAdviser}.`}
        </CardDescription>
        
        {/* THIS IS THE FIX: Only show the dropdown if it's NOT a single year view */}
        {!isSingleYearView && (
          <div className="pt-4">
            <Select value={selectedAdviser} onValueChange={setSelectedAdviser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an Adviser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Advisers</SelectItem>
                {adviserNames.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {isSingleYearView ? (
            // --- Single Year: Compare all advisers ---
            <BarChart data={singleYearComparisonData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="projects" radius={4}>
                {singleYearComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : isAllAdvisersSelected ? (
            // --- Date Range: Compare total load for all advisers ---
            <BarChart data={rangeComparisonData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="projects" radius={4}>
                {rangeComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            // --- Date Range: Show trend for a single adviser ---
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey={selectedAdviser} fill={chartConfig[selectedAdviser]?.color} radius={4} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

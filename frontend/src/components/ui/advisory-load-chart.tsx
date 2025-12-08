"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ChartData {
  year: string;
  [adviser: string]: number | string;
}

interface AdviserLoadChartProps {
  data: ChartData[];
}

const COLOR_PALETTE = [
  "#800000",
  "#9A2A2A",
  "#B35353",
  "#CC7D7D",
  "#E6A6A6",
  "#8B4513",
  "#A0522D",
  "#CD853F",
  "#D2B48C",
  "#F5DEB3",
];

export function AdviserLoadChart({ data }: AdviserLoadChartProps) {
  const [selectedAdviser, setSelectedAdviser] = React.useState<string>("all");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // This determines if we are in "single year" mode
  const isSingleYearView = data.length === 1;

  // When the data changes, reset selection
  React.useEffect(() => {
    setSelectedAdviser("all");
  }, [data]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Pixels to scroll per click
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (data.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Advisory Load</CardTitle>
          <CardDescription>
            Please select a year or range to view the data.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const adviserNames = Object.keys(data[0]).filter((key) => key !== "year");
  const chartConfig = adviserNames.reduce((acc, name, index) => {
    acc[name] = {
      label: name,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    };
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
    projects: data.reduce(
      (sum, yearData) => sum + (yearData[name] as number),
      0
    ),
    fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  const isAllAdvisersSelected = selectedAdviser === "all";

  // --- DYNAMIC WIDTH CALCULATION ---
  const minItemWidth = 120; // Pixels per bar/item
  let dynamicMinWidth = "100%";

  if (isSingleYearView || isAllAdvisersSelected) {
    const itemCount = adviserNames.length;
    dynamicMinWidth = `${Math.max(itemCount * minItemWidth, 600)}px`;
  } else {
    const itemCount = data.length;
    dynamicMinWidth = `${Math.max(itemCount * minItemWidth, 600)}px`;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Advisory Load for{" "}
              {isSingleYearView
                ? data[0].year
                : `${data[0].year} - ${data[data.length - 1].year}`}
            </CardTitle>
            <CardDescription>
              {isAllAdvisersSelected
                ? "Comparing total projects handled by each adviser."
                : `Showing project trend for ${selectedAdviser}.`}
            </CardDescription>
          </div>

          {/* Navigation Buttons for Sliding */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              title="Slide Left"
              className="h-8 w-8 rounded-full shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              title="Slide Right"
              className="h-8 w-8 rounded-full shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isSingleYearView && (
          <div className="pt-4">
            <Select value={selectedAdviser} onValueChange={setSelectedAdviser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an Adviser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Advisers</SelectItem>
                {adviserNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Scrollable Container with Hidden Scrollbar */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div style={{ minWidth: dynamicMinWidth, height: "400px" }}>
            <ChartContainer config={chartConfig} className="h-full w-full">
              {isSingleYearView ? (
                // --- Single Year: Compare all advisers ---
                <BarChart
                  data={singleYearComparisonData}
                  margin={{ bottom: 80 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="projects" radius={4}>
                    {singleYearComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : isAllAdvisersSelected ? (
                // --- Date Range: Compare total load for all advisers ---
                <BarChart data={rangeComparisonData} margin={{ bottom: 80 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
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
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey={selectedAdviser}
                    fill={chartConfig[selectedAdviser]?.color}
                    radius={4}
                  />
                </BarChart>
              )}
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

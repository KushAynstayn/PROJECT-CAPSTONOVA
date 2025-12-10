// src/components/viewer-trends/project-types-chart.tsx
// [MODIFIED FILE]
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

// Define the shape of the data we expect from the component state
interface ProjectTypeData {
  type: string;
  count: number;
  fill: string;
}

const chartConfig = {
  count: {
    label: "Projects",
  },
} satisfies ChartConfig;

const generateColor = (index: number) => {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  return colors[index % colors.length];
};

export function ProjectTypesChart({ year }: { year: number }) {
  const [data, setData] = React.useState<ProjectTypeData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination / Sliding State
  const [startIndex, setStartIndex] = React.useState(0);
  const itemsPerPage = 5;

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch data using the corrected endpoint
        const result = await apiCall(`/util/project-type-distribution/${year}`);

        const rawData = result?.data?.platforms || [];

        if (!Array.isArray(rawData)) {
          console.error("Unexpected data format:", result);
          setData([]);
          return;
        }

        // 3. Transform and sort data
        const transformedData = rawData
          .map((item: any, index: number) => ({
            type: item.platform_type || "Unknown",
            count: Number(item.count) || 0,
            fill: generateColor(index),
          }))
          .sort((a: any, b: any) => b.count - a.count);

        setData(transformedData);
        setStartIndex(0);
      } catch (err) {
        console.error("Failed to fetch project types:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [year]);

  // Derived state for the "window" of data to show
  const visibleData = React.useMemo(() => {
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, startIndex]);

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + itemsPerPage < data.length;

  const handlePrev = () => {
    if (canGoPrev) {
      setStartIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setStartIndex((prev) => Math.min(data.length - itemsPerPage, prev + 1));
    }
  };

  return (
    <Card className="flex flex-col h-full bg-neutral-900 border-yellow-500/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl text-yellow-400">
            Project Types
          </CardTitle>
          <CardDescription className="text-gray-400">
            Distribution for {year}
          </CardDescription>
        </div>

        {/* Navigation Arrows */}
        {data.length > itemsPerPage && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white disabled:opacity-30"
              onClick={handlePrev}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white disabled:opacity-30"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        ) : error ? (
          <div className="flex h-[250px] items-center justify-center text-red-400 text-sm">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-gray-500">
            No data available for this year.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] w-full"
          >
            <BarChart
              data={visibleData}
              layout="vertical"
              margin={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              }}
              barSize={32}
            >
              <CartesianGrid
                horizontal={false}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                dataKey="type"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={100}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="count" layout="vertical" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      {/* Footer showing simple stats */}
      {!loading && !error && data.length > 0 && (
        <div className="flex-col gap-2 text-sm text-center py-4 text-gray-400">
          <div className="flex items-center justify-center gap-2 font-medium leading-none text-yellow-500">
            Top Type: {data[0]?.type}{" "}
            <span className="text-gray-500">({data[0]?.count})</span>
          </div>
        </div>
      )}
    </Card>
  );
}

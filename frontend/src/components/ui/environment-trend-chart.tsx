"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

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

interface ChartData {
  year: string;
  [environment: string]: number | string;
}

interface EnvironmentTrendChartProps {
  data: ChartData[];
}

// --- Updated Rainbow Color Palette ---
const COLOR_PALETTE = [
  "#FF6B6B", // Red
  "#FFD166", // Orange-Yellow
  "#06D6A0", // Green-Cyan
  "#118AB2", // Blue
  "#7F5AF0", // Purple
  "#F78154", // Coral
  "#FF9F1C", // Bright Orange
  "#4ECDC4", // Teal
  "#5465FF", // Indigo
  "#D45079", // Pink
  "#A05195", // Magenta
  "#2F4858", // Dark Blue-Green
  "#F3C623", // Gold
  "#4CAF50", // Green
  "#9C27B0", // Deep Purple
];

export function EnvironmentTrendChart({ data }: EnvironmentTrendChartProps) {
  const [selectedEnv, setSelectedEnv] = React.useState<string>("all");

  const isSingleYearView = data.length === 1;

  React.useEffect(() => {
    setSelectedEnv("all");
  }, [data]);

  if (data.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Environment Trend</CardTitle>
          <CardDescription>
            Please select a year or range to view the data.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const environmentTypes = Object.keys(data[0]).filter((key) => key !== "year");

  const chartConfig = environmentTypes.reduce((acc, name, index) => {
    acc[name] = {
      label: name,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    };
    return acc;
  }, {} as ChartConfig);

  const singleYearComparisonData = environmentTypes.map((name, index) => ({
    name,
    count: data[0][name] as number,
    fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  const isAllTypesSelected = selectedEnv === "all";

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>
          Environment Trends for{" "}
          {isSingleYearView
            ? data[0].year
            : `${data[0].year} - ${data[data.length - 1].year}`}
        </CardTitle>
        <CardDescription>
          {isAllTypesSelected
            ? "Comparing project counts by environment."
            : `Showing trend for ${selectedEnv}.`}
        </CardDescription>

        {!isSingleYearView && (
          <div className="pt-4">
            <Select value={selectedEnv} onValueChange={setSelectedEnv}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                {environmentTypes.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex justify-center">
        {isSingleYearView ? (
          // --- Single Year Chart ---
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={singleYearComparisonData} margin={{ bottom: 50 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" radius={4}>
                  {singleYearComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : isAllTypesSelected ? (
          // --- Multi-Year Chart (All Environments) ---
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ bottom: 50 }}>
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
                  content={<ChartTooltipContent />}
                />
                <Legend />
                {environmentTypes.map((typeName) => (
                  <Bar
                    key={typeName}
                    dataKey={typeName}
                    fill={chartConfig[typeName]?.color}
                    radius={4}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          // --- Multi-Year Chart (Single Environment) ---
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                  dataKey={selectedEnv}
                  fill={chartConfig[selectedEnv]?.color}
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

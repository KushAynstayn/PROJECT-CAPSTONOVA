"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiCall } from "@/lib/api";

export const description =
  "A multiple line chart showing programming language trends.";

// Define the data structure based on the backend response
interface SeriesData {
  name: string;
  data: number[];
}

interface ProgrammingLanguageTrendsResponse {
  series: SeriesData[];
  xaxis: {
    categories: string[];
  };
}

// Generate consistent colors for dynamic series
const generateColors = (count: number): string[] => {
  const colors = [
    "hsl(48, 96%, 56%)", // Yellow
    "hsl(35, 91%, 65%)", // Orange
    "hsl(54, 95%, 70%)", // Light Yellow
    "hsl(30, 95%, 53%)", // Dark Orange
    "hsl(24, 95%, 53%)", // Red Orange
    "hsl(210, 85%, 65%)", // Blue
    "hsl(120, 65%, 60%)", // Green
    "hsl(280, 65%, 60%)", // Purple
    "hsl(0, 65%, 60%)", // Red
    "hsl(180, 65%, 60%)", // Teal
    "hsl(300, 65%, 60%)", // Pink
    "hsl(30, 85%, 55%)", // Brown
  ];

  return colors.slice(0, count);
};

// Transform backend data to recharts format
const transformData = (response: ProgrammingLanguageTrendsResponse) => {
  const { series, xaxis } = response;

  return xaxis.categories.map((year, index) => {
    const dataPoint: { [key: string]: string | number } = { year };

    series.forEach((seriesItem) => {
      dataPoint[seriesItem.name] = seriesItem.data[index] || 0;
    });

    return dataPoint;
  });
};

// Generate chart config dynamically based on series names
const generateChartConfig = (seriesNames: string[]): ChartConfig => {
  const colors = generateColors(seriesNames.length);

  return seriesNames.reduce((config, name, index) => {
    config[name] = {
      label: name,
      color: colors[index],
    };
    return config;
  }, {} as ChartConfig);
};

export function ChartLineMultiple() {
  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const [chartData, setChartData] = React.useState<any[]>([]);
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data from backend when component mounts or when inView becomes true
  React.useEffect(() => {
    const fetchData = async () => {
      if (!inView) return;

      try {
        setIsLoading(true);
        setError(null);
        const response: ProgrammingLanguageTrendsResponse = await apiCall(
          "/util/viewer-reports-analytics/programming-language-trends",
          "GET"
        );

        // Transform the backend data to recharts format
        const transformedData = transformData(response);
        setChartData(transformedData);

        // Generate dynamic chart config based on series names
        const seriesNames = response.series.map((series) => series.name);
        const dynamicConfig = generateChartConfig(seriesNames);
        setChartConfig(dynamicConfig);
      } catch (err) {
        console.error("Failed to fetch programming language trends:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [inView]);

  const yearRange =
    chartData.length > 0
      ? `${chartData[0]?.year} - ${chartData[chartData.length - 1]?.year}`
      : "";

  return (
    <Card ref={ref} className="bg-black text-gray-300 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          Programming Language Trends
        </CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading data..."
            : `Technology Usage Over Time: ${yearRange}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="h-[300px] flex items-center justify-center text-red-400">
            Error: {error}
          </div>
        ) : inView && !isLoading && chartData.length > 0 ? (
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
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#9CA3AF" }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="bg-white border-gray-700 text-black"
                    indicator="dot"
                    animationDuration={500}
                  />
                }
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
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? "Loading chart data..." : "No data available"}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-white">
              {isLoading
                ? "Loading trends..."
                : "Dynamic technology usage data"}
              {!isLoading && chartData.length > 0 && (
                <TrendingUp className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-gray-400">
              {isLoading
                ? "Fetching data from server..."
                : chartData.length > 0
                ? `Showing trends from ${yearRange}`
                : "No data to display"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

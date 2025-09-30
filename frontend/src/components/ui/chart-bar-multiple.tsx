"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiCall } from "@/lib/api";

export const description =
  "A multiple bar chart showing total archived projects per year by department.";

// Define the data structure based on the backend response
interface SeriesData {
  name: string;
  data: number[];
}

interface ArchivedProjectsResponse {
  series: SeriesData[];
  xaxis: {
    categories: string[];
  };
}

// Constant color scheme for the three fixed categories
const chartConfig = {
  BSIS: {
    label: "BSIS",
    color: "hsl(45, 80%, 65%)", // Light Gold
  },
  BSIT: {
    label: "BSIT",
    color: "hsl(45, 85%, 50%)", // Medium Gold
  },
  "BIT-CT": {
    label: "BIT-CT",
    color: "hsl(40, 80%, 40%)", // Dark Gold
  },
} satisfies ChartConfig;

// Transform backend data to recharts format
const transformData = (response: ArchivedProjectsResponse) => {
  const { series, xaxis } = response;

  return xaxis.categories.map((year, index) => {
    const dataPoint: { [key: string]: string | number } = { year };

    series.forEach((seriesItem) => {
      dataPoint[seriesItem.name] = seriesItem.data[index] || 0;
    });

    return dataPoint;
  });
};

export function ChartBarMultiple() {
  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data from backend when component mounts or when inView becomes true
  React.useEffect(() => {
    const fetchData = async () => {
      if (!inView) return;

      try {
        setIsLoading(true);
        setError(null);
        const response: ArchivedProjectsResponse = await apiCall(
          "/util/viewer-reports-analytics/archived-projects-by-department",
          "GET"
        );

        // Transform the backend data to recharts format
        const transformedData = transformData(response);
        setChartData(transformedData);
      } catch (err) {
        console.error("Failed to fetch archived projects data:", err);
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

  const totalProjects = chartData.reduce((total, yearData) => {
    Object.keys(chartConfig).forEach((department) => {
      total += yearData[department] || 0;
    });
    return total;
  }, 0);

  return (
    <Card ref={ref} className="bg-black text-gray-300 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Archived Capstone Projects</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading data..."
            : `Total projects: ${totalProjects} | Years: ${yearRange}`}
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
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} className="stroke-gray-700" />
              <XAxis
                dataKey="year"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="bg-white text-black border-gray-700"
                    indicator="dot"
                  />
                }
              />
              {/* This legend will show the color for each department */}
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
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? "Loading chart data..." : "No data available"}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {isLoading
            ? "Loading project trends..."
            : totalProjects > 0
            ? "Department-wise project distribution"
            : "No projects data available"}
          {!isLoading && totalProjects > 0 && (
            <TrendingUp className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-gray-400">
          {isLoading
            ? "Fetching archived projects data..."
            : chartData.length > 0
            ? `Showing projects archived by department across ${chartData.length} years`
            : "No archived projects data to display"}
        </div>
      </CardFooter>
    </Card>
  );
}

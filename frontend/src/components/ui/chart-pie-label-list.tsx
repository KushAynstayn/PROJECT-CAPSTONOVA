"use client";

import { useMemo, useState, useEffect } from "react";
import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
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
import { apiCall, ApiError } from "@/lib/api";

// Define an interface for the API response
interface RoleData {
  role: string;
  count: number;
}

const PALETTE: { [key: string]: string } = {
  Proponent: "#800000",
  Adviser: "#B33A3A",
};

const LABEL_MAP: { [key: string]: string } = {
  Proponent: "Project Leaders",
  Adviser: "Project Advisers",
};

export function ChartPieLabelList() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleDistribution = async () => {
      try {
        setIsLoading(true);
        const data: RoleData[] = await apiCall("/util/role-distribution");

        const formattedData = data.map((item) => ({
          role: item.role,
          count: item.count,
          fill: PALETTE[item.role] || "#cccccc",
        }));

        const newChartConfig = data.reduce((config, item) => {
          config[item.role] = {
            label: LABEL_MAP[item.role] || item.role,
            color: PALETTE[item.role] || "#cccccc",
          };
          return config;
        }, {} as ChartConfig);
        newChartConfig.count = { label: "Count" };

        setChartData(formattedData);
        setChartConfig(newChartConfig);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Failed to fetch role distribution:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleDistribution();
  }, []);

  const totalMembers = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex h-full flex-col border-1 border-gray-500">
      <CardHeader>
        <CardTitle>Role Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="role"
                  innerRadius="60%"
                  outerRadius="90%"
                >
                  <LabelList
                    dataKey="count"
                    className="fill-white"
                    stroke="none"
                    fontSize={12}
                    fontWeight="bold"
                    formatter={(value: number) =>
                      totalMembers > 0
                        ? `${((value / totalMembers) * 100).toFixed(0)}%`
                        : "0%"
                    }
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex w-full items-center justify-center gap-4">
          {chartData.map((item) => (
            <div key={item.role} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="font-medium text-muted-foreground">
                {chartConfig[item.role as keyof typeof chartConfig]?.label}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

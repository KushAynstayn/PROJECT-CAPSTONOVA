"use client"

import * as React from "react"
// 1. Import LineChart, Line, and Legend components
import { Pie, PieChart, Cell, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartData {
  year: string;
  [projectType: string]: number | string;
}

interface ProjectTypeChartProps {
  data: ChartData[];
}

const COLOR_PALETTE = ["#800000", "#9A2A2A", "#B35353", "#CC7D7D"];

export function ProjectTypeChart({ data }: ProjectTypeChartProps) {
  const [selectedType, setSelectedType] = React.useState<string>("all");

  const isSingleYearView = data.length === 1;

  React.useEffect(() => {
    setSelectedType("all");
  }, [data]);

  if (data.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Project Type Distribution</CardTitle>
          <CardDescription>Please select a year or range to view the data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const projectTypes = Object.keys(data[0]).filter(key => key !== 'year');
  const chartConfig = projectTypes.reduce((acc, name, index) => {
    acc[name] = { label: name, color: COLOR_PALETTE[index % COLOR_PALETTE.length] };
    return acc;
  }, {} as ChartConfig);

  // Data for single year comparison
  const singleYearComparisonData = projectTypes.map((name, index) => ({
    name,
    count: data[0][name] as number,
    fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  const isAllTypesSelected = selectedType === "all";

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>
          Project Types for {isSingleYearView ? data[0].year : `${data[0].year} - ${data[data.length - 1].year}`}
        </CardTitle>
        <CardDescription>
          {isAllTypesSelected
            ? "Comparing project types."
            : `Showing trend for ${selectedType}.`}
        </CardDescription>
        
        {!isSingleYearView && (
          <div className="pt-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Project Types</SelectItem>
                {projectTypes.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex justify-center">
        {isSingleYearView ? (
          // 2. --- Single Year View: Now a Bar Chart for comparison ---
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={singleYearComparisonData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={4}>
                  {singleYearComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : isAllTypesSelected ? (
          // 3. --- Range View, All Types: Now a Line Chart for trends ---
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                {projectTypes.map((typeName) => (
                  <Line
                    key={typeName}
                    type="monotone"
                    dataKey={typeName}
                    stroke={chartConfig[typeName]?.color}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          // --- Range View, Single Type: Still a Bar Chart ---
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey={selectedType} fill={chartConfig[selectedType]?.color} radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

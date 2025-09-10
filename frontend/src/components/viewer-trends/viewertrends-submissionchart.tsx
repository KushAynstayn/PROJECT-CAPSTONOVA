"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
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
  ChartStyle,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 📊 Submission data grouped by year
const submissionDataByYear: Record<
  number,
  { program: "bsis" | "bsit" | "bit-ct"; submissions: number; fill: string }[]
> = {
  2023: [
    { program: "bsis", submissions: 12, fill: "var(--color-bsis)" },
    { program: "bsit", submissions: 20, fill: "var(--color-bsit)" },
    { program: "bit-ct", submissions: 14, fill: "var(--color-bit-ct)" },
  ],
  2024: [
    { program: "bsis", submissions: 15, fill: "var(--color-bsis)" },
    { program: "bsit", submissions: 22, fill: "var(--color-bsit)" },
    { program: "bit-ct", submissions: 18, fill: "var(--color-bit-ct)" },
  ],
  2025: [
    { program: "bsis", submissions: 18, fill: "var(--color-bsis)" },
    { program: "bsit", submissions: 25, fill: "var(--color-bsit)" },
    { program: "bit-ct", submissions: 20, fill: "var(--color-bit-ct)" },
  ],
};

const chartConfig = {
  submissions: { label: "Submissions" },
  bsis: { label: "BSIS", color: "var(--chart-1)" },
  bsit: { label: "BSIT", color: "var(--chart-2)" },
  "bit-ct": { label: "BIT-CT", color: "var(--chart-3)" },
} satisfies ChartConfig;

// 🔹 Custom tooltip with white text
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-800 text-white border border-neutral-700 p-2 rounded-lg">
        <p className="text-sm font-semibold">
          {chartConfig[data.program as keyof typeof chartConfig]?.label}:{" "}
          {data.submissions}
        </p>
      </div>
    );
  }
  return null;
};

type SubmissionChartProps = {
  year: number;
};

export function SubmissionChart({ year }: SubmissionChartProps) {
  const id = "pie-interactive";
  const submissionData = submissionDataByYear[year] ?? [];
  const [activeProgram, setActiveProgram] = React.useState(
    submissionData[0]?.program
  );

  const activeIndex = React.useMemo(
    () => submissionData.findIndex((item) => item.program === activeProgram),
    [activeProgram, submissionData]
  );

  const totalSubmissions = React.useMemo(
    () => submissionData.reduce((sum, item) => sum + item.submissions, 0),
    [submissionData]
  );

  React.useEffect(() => {
    // reset active program when year changes
    if (submissionData.length > 0) {
      setActiveProgram(submissionData[0].program);
    }
  }, [year, submissionData]);

  return (
    <Card
      data-chart={id}
      className="relative flex flex-col w-full h-[450px] bg-red-900/30 border-red-500 shadow-lg shadow-red-500/20"
    >
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="items-start pb-0">
        <div className="grid gap-1 text-left">
          <CardTitle className="text-red-400">Project Submissions</CardTitle>
          <CardDescription className="text-gray-400">
            {`BSIS, BSIT, BIT-CT - `}
            <span className="font-semibold text-white">
              {totalSubmissions}
            </span>{" "}
            total ({year})
          </CardDescription>
        </div>
      </CardHeader>
      <div className="absolute top-6 right-6 z-10">
        <Select
          value={activeProgram}
          onValueChange={(value) =>
            setActiveProgram(value as "bsis" | "bsit" | "bit-ct")
          }
        >
          <SelectTrigger
            className="h-9 w-[150px] rounded-lg pl-2.5 bg-neutral-800 text-white border-neutral-700"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent
            align="center"
            className="rounded-xl bg-neutral-800 text-white border-neutral-700"
          >
            {submissionData.map((item) => (
              <SelectItem
                key={item.program}
                value={item.program}
                className="rounded-lg [&_span]:flex focus:bg-neutral-700 focus:text-white"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: `var(--color-${item.program})` }}
                  />
                  {chartConfig[item.program as keyof typeof chartConfig]?.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CardContent className="flex-1 flex items-center justify-center pb-0 p-6">
        <ChartContainer id={id} config={chartConfig} className="w-full h-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Pie
              data={submissionData}
              dataKey="submissions"
              nameKey="program"
              innerRadius="45%"
              outerRadius="85%"
              strokeWidth={4}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 8} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 18}
                    innerRadius={outerRadius + 10}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="text-4xl font-bold fill-white"
                        >
                          {submissionData[activeIndex]?.submissions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="text-base fill-white"
                        >
                          Submissions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
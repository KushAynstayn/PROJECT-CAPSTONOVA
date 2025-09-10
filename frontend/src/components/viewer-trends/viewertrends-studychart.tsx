"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "A multiple line chart";

// 📊 Study data grouped by year
const chartDataByYear: Record<
  number,
  { month: string; BSIS: number; BSIT: number; "BIT-CT": number }[]
> = {
  2023: [
    { month: "January", BSIS: 250, BSIT: 300, "BIT-CT": 150 },
    { month: "February", BSIS: 280, BSIT: 320, "BIT-CT": 180 },
    { month: "March", BSIS: 260, BSIT: 310, "BIT-CT": 170 },
    { month: "April", BSIS: 290, BSIT: 330, "BIT-CT": 190 },
    { month: "May", BSIS: 320, BSIT: 350, "BIT-CT": 210 },
    { month: "June", BSIS: 310, BSIT: 340, "BIT-CT": 200 },
    { month: "July", BSIS: 340, BSIT: 370, "BIT-CT": 230 },
    { month: "August", BSIS: 360, BSIT: 390, "BIT-CT": 250 },
    { month: "September", BSIS: 350, BSIT: 380, "BIT-CT": 240 },
    { month: "October", BSIS: 370, BSIT: 400, "BIT-CT": 260 },
    { month: "November", BSIS: 380, BSIT: 410, "BIT-CT": 270 },
    { month: "December", BSIS: 390, BSIT: 420, "BIT-CT": 280 },
  ],
  2024: [
    { month: "January", BSIS: 270, BSIT: 310, "BIT-CT": 160 },
    { month: "February", BSIS: 300, BSIT: 335, "BIT-CT": 190 },
    { month: "March", BSIS: 280, BSIT: 320, "BIT-CT": 180 },
    { month: "April", BSIS: 310, BSIT: 340, "BIT-CT": 200 },
    { month: "May", BSIS: 340, BSIT: 360, "BIT-CT": 220 },
    { month: "June", BSIS: 330, BSIT: 350, "BIT-CT": 210 },
    { month: "July", BSIS: 360, BSIT: 380, "BIT-CT": 240 },
    { month: "August", BSIS: 380, BSIT: 400, "BIT-CT": 260 },
    { month: "September", BSIS: 370, BSIT: 390, "BIT-CT": 250 },
    { month: "October", BSIS: 390, BSIT: 410, "BIT-CT": 270 },
    { month: "November", BSIS: 400, BSIT: 420, "BIT-CT": 280 },
    { month: "December", BSIS: 410, BSIT: 430, "BIT-CT": 290 },
  ],
  2025: [
    { month: "January", BSIS: 280, BSIT: 320, "BIT-CT": 170 },
    { month: "February", BSIS: 310, BSIT: 340, "BIT-CT": 200 },
    { month: "March", BSIS: 290, BSIT: 330, "BIT-CT": 190 },
    { month: "April", BSIS: 320, BSIT: 350, "BIT-CT": 210 },
    { month: "May", BSIS: 350, BSIT: 370, "BIT-CT": 230 },
    { month: "June", BSIS: 340, BSIT: 360, "BIT-CT": 220 },
    { month: "July", BSIS: 370, BSIT: 390, "BIT-CT": 250 },
    { month: "August", BSIS: 390, BSIT: 410, "BIT-CT": 270 },
    { month: "September", BSIS: 380, BSIT: 400, "BIT-CT": 260 },
    { month: "October", BSIS: 400, BSIT: 420, "BIT-CT": 280 },
    { month: "November", BSIS: 410, BSIT: 430, "BIT-CT": 290 },
    { month: "December", BSIS: 420, BSIT: 440, "BIT-CT": 300 },
  ],
};

const chartConfig = {
  BSIS: { label: "BSIS", color: "var(--chart-1)" },
  BSIT: { label: "BSIT", color: "var(--chart-2)" },
  "BIT-CT": { label: "BIT-CT", color: "var(--chart-3)" },
} satisfies ChartConfig;

type StudyChartProps = {
  year: number;
};

export function StudyChart({ year }: StudyChartProps) {
  const chartData = chartDataByYear[year] ?? [];

  return (
    <>
      <style jsx global>{`
        :root {
          --chart-1: hsl(0 80% 60%);
          --chart-2: hsl(45 90% 60%);
          --chart-3: hsl(240 70% 50%);
        }
      `}</style>

      <Card className="w-full bg-gray-900 border-blue-500 shadow-lg shadow-blue-500/20 h-[450px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-blue-400">Study Trend Analytics</CardTitle>
          <CardDescription className="text-gray-400">
            January - December ({year})
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-2 relative flex flex-col">
          {/* Chart */}
          <ChartContainer config={chartConfig} className="w-full flex-1">
            <LineChart
              data={chartData}
              width={700}
              height={280}
              margin={{ top: 20, right: 20, left: 20, bottom: 201 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={16}
                tickFormatter={(value) => value.slice(0, 3)}
                className="fill-gray-400"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="BSIS"
                type="monotone"
                stroke="var(--color-BSIS)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="BSIT"
                type="monotone"
                stroke="var(--color-BSIT)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="BIT-CT"
                type="monotone"
                stroke="var(--color-BIT-CT)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>

          {/* Legend inside container, top-right */}
          <div className="absolute top-[-50px] right-4 flex gap-4 bg-gray-800 bg-opacity-70 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-red-500 rounded-full"></span>
              <span className="text-gray-400 text-sm">BSIS</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-400 text-sm">BSIT</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              <span className="text-gray-400 text-sm">BIT-CT</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

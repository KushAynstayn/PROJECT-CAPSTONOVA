"use client";

import React, { useState, useEffect } from "react";
import { YearPicker } from "@/components/ui/year-picker";
import { ProjectToolsChart } from "@/components/ui/project-tools-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

// Define the structure for a single data point in the chart
interface ChartDataPoint {
  name: string;
  count: number;
}

const ProjectToolsView = () => {
  const [pickerMode, setPickerMode] = useState<"single" | "range">("single");
  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();
  // Set the default projectType to 'Web' to match the database value
  const [projectType, setProjectType] = useState<string>("Web");

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fromYear = 2010;
  const toYear = currentYear;

  // This effect fetches data whenever the filters change
  useEffect(() => {
    const fetchProjectTools = async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (pickerMode === "single" && singleYear) {
        params.append("start_year", singleYear.toString());
      } else if (pickerMode === "range" && startYear && endYear) {
        params.append("start_year", startYear.toString());
        params.append("end_year", endYear.toString());
      }

      if (projectType) {
        params.append("platform_type", projectType);
      }

      try {
        const response = await apiCall(
          `/util/project-tools?${params.toString()}`
        );

        // Transform the API response { "Tool": count } into an array [{ name: "Tool", count: count }]
        const formattedData = Object.entries(response.data).map(
          ([name, count]) => ({
            name,
            count: count as number,
          })
        );

        setChartData(formattedData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch project tools data.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectTools();
  }, [pickerMode, singleYear, startYear, endYear, projectType]);

  const handleModeToggle = () => {
    const newMode = pickerMode === "single" ? "range" : "single";
    setPickerMode(newMode);

    if (newMode === "range") {
      setStartYear(fromYear);
      setEndYear(toYear);
      setSingleYear(undefined);
    } else {
      setSingleYear(toYear);
      setStartYear(undefined);
      setEndYear(undefined);
    }
  };

  const handleStartYearChange = (year: number | undefined) => {
    setStartYear(year);
    if (endYear && year && endYear < year) {
      setEndYear(undefined);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          {pickerMode === "single" ? (
            <YearPicker
              year={singleYear}
              setYear={setSingleYear}
              placeholder="Select year"
              fromYear={fromYear}
              toYear={toYear}
            />
          ) : (
            <>
              <YearPicker
                year={startYear}
                setYear={handleStartYearChange}
                placeholder="Start year"
                fromYear={fromYear}
                toYear={toYear}
              />
              <YearPicker
                year={endYear}
                setYear={setEndYear}
                placeholder="End year"
                fromYear={startYear || fromYear}
                toYear={toYear}
                disabled={!startYear}
              />
            </>
          )}

          <Button variant="outline" onClick={handleModeToggle}>
            {pickerMode === "single" ? "Select Range" : "Select Single Year"}
          </Button>
        </div>

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Project Type" />
            </SelectTrigger>
            <SelectContent>
              {/* These values now exactly match your database enums */}
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="IoT">IoT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p>Loading chart data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ProjectToolsChart data={chartData} projectType={projectType} />
      )}
    </div>
  );
};

export default ProjectToolsView;

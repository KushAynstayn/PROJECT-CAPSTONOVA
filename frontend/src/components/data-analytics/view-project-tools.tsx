"use client";

import React, { useState, useEffect } from "react";
import { YearPicker } from "@/components/ui/year-picker";
import { ProjectToolsChart } from "@/components/ui/project-tools-chart";
import { CreatableCombobox, Option } from "@/components/ui/creatable-combobox"; // Import the new component
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

  // Options for the dropdown
  const projectTypeOptions: Option[] = [
    { value: "Web", label: "Web" },
    { value: "Mobile", label: "Mobile" },
    { value: "Desktop", label: "Desktop" },
    { value: "IoT", label: "IoT" },
  ];

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

          <Button
            variant="outline"
            onClick={handleModeToggle}
            className="border border-gray-300 shadow-md rounded-md hover:bg-[#660000] hover:text-white hover:border-[#660000]"
          >
            {pickerMode === "single" ? "Select Range" : "Select Single Year"}
          </Button>
        </div>

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          {/* Replaced Select with CreatableCombobox */}
          <CreatableCombobox
            items={projectTypeOptions}
            value={projectType}
            onValueChange={setProjectType}
            placeholder="Select or Type..."
            searchPlaceholder="Search project type..."
            emptyMessage="No type found. Type to create."
            className="w-full md:w-[200px] border border-gray-300 shadow-md rounded-md"
          />
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

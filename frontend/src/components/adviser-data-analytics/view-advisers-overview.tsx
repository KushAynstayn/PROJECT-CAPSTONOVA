"use client";

import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { YearPicker } from "@/components/ui/year-picker";
import { Button } from "@/components/ui/button";
import { ProjectTypesChart } from "@/components/ui/advisers-overview-chart";
import { apiCall } from "@/lib/api";

const AdviserOverviewView = () => {
  const [pickerMode, setPickerMode] = useState<"single" | "range">("single");
  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromYear = currentYear - 15;
  const toYear = currentYear;

  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      setError(null);
      let params = new URLSearchParams();

      if (pickerMode === "single" && singleYear) {
        params.append("year", singleYear.toString());
      } else if (pickerMode === "range" && startYear && endYear) {
        params.append(
          "start_date",
          format(new Date(startYear, 0, 1), "yyyy-MM-dd")
        );
        params.append(
          "end_date",
          format(new Date(endYear, 11, 31), "yyyy-MM-dd")
        );
      }

      try {
        const response = await apiCall(
          `/util/adviser-overview?${params.toString()}`
        );
        const { data } = response;
        const formattedData = [
          {
            category: "Advisee",
            value: data.advisees,
            fill: "hsl(0, 80%, 30%)",
          },
          {
            category: "Projects",
            value: data.projects,
            fill: "hsl(0, 70%, 40%)",
          },
          {
            category: "Suggestions",
            value: data.suggestions,
            fill: "hsl(0, 60%, 70%)",
          },
        ];
        setChartData(formattedData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch overview data.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, [pickerMode, singleYear, startYear, endYear]);

  const handleModeToggle = () => {
    const newMode = pickerMode === "single" ? "range" : "single";
    setPickerMode(newMode);

    if (newMode === "range") {
      const defaultStartYear = currentYear;
      setStartYear(defaultStartYear);
      setEndYear(defaultStartYear);
      setSingleYear(undefined);
    } else {
      setStartYear(undefined);
      setEndYear(undefined);
      setSingleYear(currentYear);
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
      </div>

      <div className="mt-6 flex justify-start px-4 md:px-6">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <ProjectTypesChart
            data={chartData}
            year={singleYear ?? startYear ?? currentYear}
          />
        )}
      </div>
    </div>
  );
};

export default AdviserOverviewView;

"use client";

import React, { useState, useEffect } from "react";
import { YearPicker } from "@/components/ui/year-picker";
import { EnvironmentTrendChart } from "@/components/ui/environment-trend-chart";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

const EnvironmentTrendView = () => {
  const [pickerMode, setPickerMode] = useState<"single" | "range">("single");
  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(
    currentYear - 1
  );
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();

  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fromYear = currentYear - 15;
  const toYear = currentYear;

  useEffect(() => {
    const fetchEnvironmentTrends = async () => {
      if (
        (pickerMode === "single" && !singleYear) ||
        (pickerMode === "range" && (!startYear || !endYear))
      ) {
        setChartData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();

      if (pickerMode === "single" && singleYear) {
        // The API expects 'start_year' for a single year query
        params.append("start_year", singleYear.toString());
      } else if (pickerMode === "range" && startYear && endYear) {
        params.append("start_year", startYear.toString());
        params.append("end_year", endYear.toString());
      }

      try {
        const response = await apiCall(
          `/util/environment-trends?${params.toString()}`
        );

        // Transform the API response object { "2024": { ... } }
        // into an array the chart can use: [{ year: "2024", ... }]
        const formattedData = Object.entries(response.data).map(
          ([year, values]) => ({
            year: year,
            ...(values as object),
          })
        );

        setChartData(formattedData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch environment trend data.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvironmentTrends();
  }, [pickerMode, singleYear, startYear, endYear]);

  const handleModeToggle = () => {
    const newMode = pickerMode === "single" ? "range" : "single";
    setPickerMode(newMode);

    if (newMode === "range") {
      setStartYear(fromYear);
      setEndYear(toYear);
      setSingleYear(undefined);
    } else {
      setStartYear(undefined);
      setEndYear(undefined);
      setSingleYear(currentYear - 1);
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

      <div>
        {isLoading ? (
          <p>Loading chart data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <EnvironmentTrendChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default EnvironmentTrendView;

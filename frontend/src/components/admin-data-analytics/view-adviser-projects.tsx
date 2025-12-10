"use client";

import React, { useState, useMemo, useEffect } from "react";
import { YearPicker } from "@/components/ui/year-picker";
// FIX: Corrected the import name from AdvisoryLoadChart to AdviserLoadChart
import { AdviserLoadChart } from "@/components/ui/advisory-load-chart";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

// Interface for the data returned from the API
interface AdvisoryLoadData {
  adviser_name: string;
  projects_handled: number;
}

const AdvisoryLoadView = () => {
  const [pickerMode, setPickerMode] = useState<"single" | "range">("single");
  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();

  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fromYear = 2010;
  const toYear = currentYear;

  useEffect(() => {
    const fetchAdvisoryLoad = async () => {
      // Prevent fetching if dates are not properly set
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
        params.append("year", singleYear.toString());
      } else if (pickerMode === "range" && startYear && endYear) {
        params.append("from_year", startYear.toString());
        params.append("to_year", endYear.toString());
      }

      try {
        const response: AdvisoryLoadData[] = await apiCall(
          `/util/advisory-load?${params.toString()}`
        );

        // FIX: Transform data to the format expected by AdviserLoadChart
        // The chart expects: [{ year: "2024", "Adviser A": 5, "Adviser B": 3 }]

        const yearLabel =
          pickerMode === "single"
            ? singleYear?.toString() || ""
            : `${startYear}-${endYear}`;

        // Create one data object for the chart
        const dataPoint: { [key: string]: string | number } = {
          year: yearLabel,
        };

        response.forEach((item) => {
          dataPoint[item.adviser_name] = item.projects_handled;
        });

        // Set as an array containing this single data object
        setChartData([dataPoint]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch advisory load data.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvisoryLoad();
  }, [pickerMode, singleYear, startYear, endYear]);

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
      </div>

      <div>
        {isLoading ? (
          <p>Loading chart data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          // FIX: Updated component usage
          <AdviserLoadChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default AdvisoryLoadView;

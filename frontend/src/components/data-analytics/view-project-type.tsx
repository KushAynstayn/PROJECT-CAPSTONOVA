"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { YearPicker } from "@/components/ui/year-picker";
import { ProjectTypeChart } from "@/components/ui/project-type-chart";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

const ProjectTypeView = () => {
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
    const fetchProjectTypes = async () => {
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
        // Correctly format dates for the backend
        params.append("start_date", `${startYear}-01-01`);
        params.append("end_date", `${endYear}-12-31`);
      }

      try {
        const response = await apiCall(`/util/project-types?${params}`);

        // The API returns an object of counts. We wrap it in an array
        // because the chart component is designed to handle a list of data points.
        // For this aggregated view, it will always be an array with one item.
        setChartData(response.data ? [response.data] : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch project type data.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectTypes();
  }, [pickerMode, singleYear, startYear, endYear]);

  const handleModeToggle = () => {
    const newMode = pickerMode === "single" ? "range" : "single";
    setPickerMode(newMode);

    if (newMode === "range") {
      const defaultStartYear = currentYear - 1;
      setStartYear(defaultStartYear);
      setEndYear(defaultStartYear);
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
          <ProjectTypeChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default ProjectTypeView;

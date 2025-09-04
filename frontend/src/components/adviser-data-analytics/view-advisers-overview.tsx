"use client";

import React, { useState } from "react";
import { YearPicker } from "@/components/ui/year-picker";
import { Button } from "@/components/ui/button";
import { ProjectTypesChart } from "@/components/ui/advisers-overview-chart";

const AdviserOverviewView = () => {
  const [pickerMode, setPickerMode] = useState<"single" | "range">("single");
  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();

  const fromYear = currentYear - 15;
  const toYear = currentYear;

  const sampleChartData = [
    // MODIFIED: Colors changed to shades of red
    { category: "Advisee", value: 10, fill: "hsl(0, 80%, 30%)" }, // Dark Red
    { category: "Projects", value: 10, fill: "hsl(0, 70%, 40%)" }, // Red
    { category: "Suggestions", value: 4, fill: "hsl(0, 60%, 70%)" }, // Light Red
  ];

  const handleModeToggle = () => {
    const newMode = pickerMode === "single" ? "range" : "single";
    setPickerMode(newMode);

    if (newMode === "range") {
      const defaultStartYear = currentYear;
      setStartYear(defaultStartYear);
      setEndYear(defaultStartYear);
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
        {pickerMode === "single" && singleYear && (
          <ProjectTypesChart data={sampleChartData} year={singleYear} />
        )}
      </div>
    </div>
  );
};

export default AdviserOverviewView;
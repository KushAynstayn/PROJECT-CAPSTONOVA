"use client";

import React, { useState, useMemo } from "react";
import { YearPicker } from "@/components/ui/year-picker";
import { EnvironmentTrendChart } from "@/components/ui/environment-trend-chart";
import { Button } from "@/components/ui/button";
import { fullChartData } from "@/data/environment-trend";

const EnvironmentTrendView = () => {
  const [pickerMode, setPickerMode] = useState<'single' | 'range'>('single');
  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear - 1);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();

  const fromYear = currentYear - 15;
  const toYear = currentYear;

  const handleModeToggle = () => {
    const newMode = pickerMode === 'single' ? 'range' : 'single';
    setPickerMode(newMode);

    if (newMode === 'range') {
      const defaultStartYear = currentYear - 1;
      setStartYear(defaultStartYear);
      setEndYear(defaultStartYear);
    } else {
      // Clear range state when switching to single-year mode
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

  const filteredData = useMemo(() => {
    if (pickerMode === 'single' && singleYear) {
      return fullChartData.filter(item => parseInt(item.year, 10) === singleYear);
    }
    if (pickerMode === 'range' && startYear && endYear) {
      if (startYear > endYear) return [];
      return fullChartData.filter(item => {
        const itemYear = parseInt(item.year, 10);
        return itemYear >= startYear && itemYear <= endYear;
      });
    }
    // Return a default set of data or an empty array if no years are selected
    if (pickerMode === 'single' && singleYear === undefined) {
      return [];
    }
    return fullChartData.filter(item => parseInt(item.year, 10) === currentYear - 1);
  }, [pickerMode, singleYear, startYear, endYear, currentYear]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          {pickerMode === 'single' ? (
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
            {pickerMode === 'single' ? 'Select Range' : 'Select Single Year'}
          </Button>
        </div>
      </div>

      <div>
        <EnvironmentTrendChart data={filteredData} />
      </div>
    </div>
  );
};

export default EnvironmentTrendView;
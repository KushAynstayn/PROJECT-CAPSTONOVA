"use client";

import React, { useState, useMemo } from "react";
import { YearPicker } from "@/components/ui/year-picker";
import { AdviserLoadChart } from "@/components/ui/advisory-load-chart";
import { Button } from "@/components/ui/button";
import { fullChartData } from "@/data/advisory-load";

const AdvisoryLoadView = () => {
  const [pickerMode, setPickerMode] = useState<'single' | 'range'>('single');

  const currentYear = new Date().getFullYear();
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear - 1);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();

  const fromYear = 2010;
  const toYear = 2024;

  const handleModeToggle = () => {
    const newMode = pickerMode === 'single' ? 'range' : 'single';
    setPickerMode(newMode);

    if (newMode === 'range') {
      const defaultYear = toYear;
      setStartYear(fromYear);
      setEndYear(defaultYear);
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
    // Default data view for single mode
    return fullChartData.filter(item => parseInt(item.year, 10) === (singleYear || toYear));
  }, [pickerMode, singleYear, startYear, endYear, toYear]);

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
        <AdviserLoadChart data={filteredData} />
      </div>
    </div>
  );
};

export default AdvisoryLoadView;
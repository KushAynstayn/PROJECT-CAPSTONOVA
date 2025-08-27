"use client";

import React, { useState, useMemo } from "react";
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
import { fullChartData } from "@/data/project-tools";

const ProjectToolsView = () => {
  const [pickerMode, setPickerMode] = useState<'single' | 'range'>('single');
  const [singleYear, setSingleYear] = useState<number | undefined>(2024);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();
  const [projectType, setProjectType] = useState<string>("Website Application");
  const [layerType, setLayerType] = useState<string>("Front End");

  const fromYear = 2010;
  const toYear = 2024;
  
  const handleModeToggle = () => {
    const newMode = pickerMode === 'single' ? 'range' : 'single';
    setPickerMode(newMode);

    if (newMode === 'range') {
      // Set a default range when switching to 'range' mode
      setStartYear(fromYear);
      setEndYear(toYear);
    } else {
      // Set a default single year when switching to 'single' mode
      setSingleYear(toYear);
    }
  };
  
  const handleStartYearChange = (year: number | undefined) => {
    setStartYear(year);
    if (endYear && year && endYear < year) {
      setEndYear(undefined);
    }
  };

  const filteredData = useMemo(() => {
    if (!projectType || !layerType) return [];

    const selectedData = fullChartData[projectType as keyof typeof fullChartData]?.[layerType as keyof (typeof fullChartData)["Website Application"]];
    if (!selectedData) return [];

    if (pickerMode === 'single' && singleYear) {
      return selectedData.filter(item => parseInt(item.year, 10) === singleYear);
    }

    if (pickerMode === 'range' && startYear && endYear) {
      if (startYear > endYear) return [];
      return selectedData.filter(item => {
        const itemYear = parseInt(item.year, 10);
        return itemYear >= startYear && itemYear <= endYear;
      });
    }

    // Default to the full dataset if no selection
    return selectedData;
  }, [pickerMode, singleYear, startYear, endYear, projectType, layerType]);

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
              />
            </>
          )}
          
          <Button variant="outline" onClick={handleModeToggle}>
            {pickerMode === 'single' ? 'Select Range' : 'Select Single Year'}
          </Button>
        </div>

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Project Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(fullChartData).map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={layerType} onValueChange={setLayerType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Layer Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(fullChartData["Website Application"]).map((layer) => (
                <SelectItem key={layer} value={layer}>{layer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProjectToolsChart
        data={filteredData}
        projectType={projectType}
        layerType={layerType}
      />
    </div>
  );
};

export default ProjectToolsView;
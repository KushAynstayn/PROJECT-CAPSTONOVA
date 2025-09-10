'use client';

import React, { useState } from 'react';
import { ChartAreaDefault } from '@/components/viewer-trends/viewertrends-cloudchart';
import { SocialMediaChart } from '@/components/viewer-trends/viewertrends-socialchart';
import { IotChart } from '@/components/viewer-trends/viewertrends-iotchart';
import { WebApplicationChart } from '@/components/viewer-trends/viewertrends-webchart';
import { MobileAppsChart } from '@/components/viewer-trends/viewertrends-mobilechart';
import { AIMLChart } from '@/components/viewer-trends/viewertrends-aimlchart';
import { ProjectChart } from '@/components/viewer-trends/viewertrends-projectchart';
import { StudyChart } from '@/components/viewer-trends/viewertrends-studychart';
import { SubmissionChart } from '@/components/viewer-trends/viewertrends-submissionchart';
import { ProgrammingLanguagesChart } from '@/components/viewer-trends/viewertrends-programmingchart';
import { EnvironmentTrendsChart } from '@/components/viewer-trends/viewertrends-environmentchart';

const ViewTrends = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => 2010 + i);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  return (
    <div className="p-3 bg-black min-h-screen text-white">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Project Trends</h1>
        <p className="mt-1 text-md text-gray-400">Project data trends</p>

        {/* Custom Single Year Picker */}
        <div className="mt-4 flex items-center gap-2">
          <label htmlFor="year-picker" className="text-gray-300">
            Select Year:
          </label>
          <div className="relative">
            <select
              id="year-picker"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-gray-800 text-white border border-gray-600 rounded-md px-3 pr-10 py-2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {/* Custom Arrow */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Layout */}
      <div className="flex flex-col gap-3">
        {/* Top Row */}
        <div className="flex gap-50 items-start">
          {/* Left side chart: ProjectTrend */}
          <div className="w-[600px] h-[700px]">
            <ProjectChart year={selectedYear} />
          </div>

          {/* Right side grid: Six small charts */}
          <div className="flex flex-col gap-13">
            {/* First row: Cloud, Social, IoT */}
            <div className="grid grid-cols-3 gap-x-2">
              <div className="w-[220px] h-[200px]">
                <ChartAreaDefault year={selectedYear} />
              </div>
              <div className="w-[220px] h-[200px]">
                <SocialMediaChart year={selectedYear} />
              </div>
              <div className="w-[220px] h-[200px]">
                <IotChart year={selectedYear} />
              </div>
            </div>

            {/* Second row: Web, Mobile, AI */}
            <div className="grid grid-cols-3 gap-x-3">
              <div className="w-[220px] h-[200px]">
                <WebApplicationChart year={selectedYear} />
              </div>
              <div className="w-[220px] h-[200px]">
                <MobileAppsChart year={selectedYear} />
              </div>
              <div className="w-[220px] h-[200px]">
                <AIMLChart year={selectedYear} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-row gap-4 mt-2">
          <div className="w-[1000px] h-[450px] -mt-50">
            <StudyChart year={selectedYear} />
          </div>
          <div className="w-[600px] h-[429px] -mt-50">
            <SubmissionChart year={selectedYear} />
          </div>
        </div>

        {/* Row: Programming Languages & Environment Charts side by side */}
        <div className="flex flex-row gap-4 mt-4">
          <div className="w-[750px] h-[400px]">
            <ProgrammingLanguagesChart year={selectedYear} />
          </div>
          <div className="w-[800px] h-[400px]">
            <EnvironmentTrendsChart year={selectedYear} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTrends;

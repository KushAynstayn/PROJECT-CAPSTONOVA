"use client";

import React, { useState } from "react";
import { ArchivedProjectsChart } from "@/components/viewer-trends/archived-projects-chart";
import { ProjectTypesChart } from "@/components/viewer-trends/project-types-chart";
import { ProgrammingLanguagesChart } from "@/components/viewer-trends/programming-languages-chart";
import { TechStackChart } from "@/components/viewer-trends/tech-stack-chart";
import { EnvironmentStudyChart } from "@/components/viewer-trends/environment-study-chart";
import { TopAdvisersChart } from "@/components/viewer-trends/top-advisers-chart";

const AnalyticsDashboardPage = () => {
  const currentYear = new Date().getFullYear();
  // MODIFICATION: Generate a list of years from 2000 to the current year
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  return (
    <div className="p-4 md:p-8 mt-24 bg-black min-h-screen text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1
          className="text-3xl font-bold text-[#E0A800] mb-4 md:mb-0"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          Project Data Analytics
        </h1>

        {/* Year Picker */}
        <div className="flex items-center gap-2">
          <label htmlFor="year-picker" className="text-gray-300 font-medium">
            Select Year:
          </label>
          <div className="relative">
            <select
              id="year-picker"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-gray-800 text-white border border-yellow-500/50 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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

      {/* Charts Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          {/* MODIFICATION: Pass selectedYear for highlighting, not fetching */}
          <ArchivedProjectsChart selectedYear={selectedYear} />
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          {/* MODIFICATION: Pass year for fetching */}
          <ProjectTypesChart year={selectedYear} />
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-3 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          {/* MODIFICATION: Pass year for fetching */}
          <ProgrammingLanguagesChart year={selectedYear} />
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          {/* MODIFICATION: No year prop needed, fetches all-time data */}
          <TopAdvisersChart />
        </div>
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          {/* MODIFICATION: Pass year for fetching */}
          <EnvironmentStudyChart year={selectedYear} />
        </div>

        {/* Row 4 (Tech Stacks - Unchanged as per instruction) */}
        <div className="mb-14 lg:col-span-3 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          <TechStackChart year={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;

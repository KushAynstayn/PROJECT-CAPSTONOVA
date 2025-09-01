"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarLabelCustom } from "@/components/ui/chart-bar-label-custom";
import { ChartLineLinear } from "@/components/ui/chart-line-linear";
import { Calendar22 } from "@/components/ui/date-picker";
import { ChartPieLabelList } from "@/components/ui/chart-pie-label-list";
import { ChartBarLabel } from "@/components/ui/chart-bar-label";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { LatestSubmission } from "@/components/ui/latest-submission-dashboard";
import { LatestSuggestion } from "@/components/ui/latest-suggestion-dashboardAdmin"; // Import the new component

const SuperAdminDashboardPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    // Use a React Fragment to place the header outside the main padded area
    <>
      {/* Main content now has padding-top to create space below the header */}
      <main className="flex min-h-screen flex-col p-2 pt-2 sm:p-2 lg:p-4 lg:pt-0">
        <div className="mt-1">
          <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputWithClear
              type="search"
              placeholder="Search more capstone projects here"
              className="w-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")} // Function to clear the input
            />
            <Calendar22 />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-stretch gap-2 md:flex-row">
              <div className="w-full md:w-2/3">
                <ChartLineLinear />
              </div>
              <div className="w-full md:w-1/3">
                <ChartBarLabelCustom />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2 md:flex-row">
              <div className="grow">
                <ChartBarLabel />
              </div>
              
              <div className="md:w-1/4">
                <ChartPieLabelList />
              </div>
              
              <div className="md:w-1/4">
                <LatestSubmission />
              </div>
              <div className="md:w-1/4">
                <LatestSuggestion /> {/* Add the new component here */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SuperAdminDashboardPage;
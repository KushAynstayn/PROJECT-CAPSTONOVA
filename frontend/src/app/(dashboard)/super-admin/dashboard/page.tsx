"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarLabelCustom } from "@/components/chart-bar-label-custom";
import { ChartLineLinear } from "@/components/chart-line-linear";
import { ChartRadialText } from "@/components/chart-radial-text";
import { ChartRadialShape } from "@/components/chart-radial-shape";
import { Calendar22 } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "@/components/ui/inputWithClear";

const SuperAdminDashboardPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    // Use a React Fragment to place the header outside the main padded area
    <>
      <div className="w-full">
        <h1 className="p-1 text-left text-base font-semibold text-[#a7561f] opacity-50 md:text-lg">
          Enhancing Capstone Archiving and Optimizing Data Intelligence with
          Project CapstoNova
        </h1>
        {/* This div creates the blurred, full-width border */}
        <div className="h-[2px] w-full bg-gray-200 " />
      </div>
       {/* END OF HEADER */}

      {/* Main content now has padding-top to create space below the header */}
      <main className="flex min-h-screen flex-col p-2 pt-2 sm:p-2 lg:p-4 lg:pt-0">
        <div className="mt-4">
          <h2 className="mb-4 text-2xl font-bold">Analytics Dashboard</h2>

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
            <div className="flex flex-col items-stretch gap-6 md:flex-row">
              <div className="w-full md:w-2/3">
                <ChartLineLinear />
              </div>
              <div className="w-full md:w-1/3">
                <ChartBarLabelCustom />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2 md:flex-row">
              <div className="md:basis-1/4">
                <ChartRadialText />
              </div>
              <div className="md:basis-1/4">
                <ChartRadialShape />
              </div>
              <div className="grow">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Latest Submission</CardTitle>
                    <Button variant="link" className="px-0">
                      View All Projects
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Smart Library Management System with QR Code Integration
                      <br />
                      Submitted by Mark John C. Lucas
                      <br />
                      Adviser: Dr. Luke Tan
                      <br />
                      Date Submitted: November 20, 2024
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SuperAdminDashboardPage;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ModifiedPieChart } from "@/components/ui/chart-pie-donut-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDistributionChart } from "@/components/ui/chart-pie-label";
import { AdviserDistributionChart } from "@/components/ui/chart-pie-interactive";
import { GuestDistributionChart } from "@/components/ui/chart-bar-interactive";
import { ProponentDistributionChart } from "@/components/ui/chart-pie-stacked";
import { YearPicker } from "@/components/ui/year-picker";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

// --- INTERFACES ---
interface SubmissionByCourse {
  course: string;
  count: number;
}

interface ReportData {
  submissions_per_course: SubmissionByCourse[];
  total_submissions: number;
  total_archived: number;
}

interface UserCounts {
  admins: number;
  advisers: number;
  proponents: {
    total: number;
    by_department: { department: string; count: number }[];
  };
  viewers: {
    total: number;
    by_department: { department: string; count: number }[];
  };
}

const SuperAdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState("project");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [userCountData, setUserCountData] = useState<UserCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the YearPicker
  const currentYear = new Date().getFullYear();
  const [pickerMode, setPickerMode] = useState<"single" | "range">("single");
  const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();
  const fromYear = 2020;
  const toYear = currentYear;

  const legendData = [
    { course: "BIT-CT", color: "#cc3333" },
    { course: "BSIS", color: "#0c284d" },
    { course: "BSIT", color: "#fec832" },
  ];

  const fetchReportData = useCallback(async () => {
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
      const data = await apiCall(
        `/util/submissions-by-course?${params.toString()}`
      );
      setReportData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch report data.");
    } finally {
      setIsLoading(false);
    }
  }, [pickerMode, singleYear, startYear, endYear]);

  const fetchUserCountData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall("/util/user-role-counts");
      setUserCountData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user count data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "project") {
      fetchReportData();
    } else if (activeTab === "user") {
      fetchUserCountData();
    }
  }, [activeTab, fetchReportData, fetchUserCountData]);

  // Handlers for the YearPicker
  const handleModeToggle = () => {
    const newMode = pickerMode === "single" ? "range" : "single";
    setPickerMode(newMode);
  };

  const handleStartYearChange = (year: number | undefined) => {
    setStartYear(year);
    if (endYear && year && endYear < year) {
      setEndYear(undefined);
    }
  };

  return (
    <div>
      <div className="flex justify-start space-x-8">
        <button
          onClick={() => setActiveTab("project")}
          className={`
                        text-lg font-semibold pb-2 transition-colors duration-200
                        ${
                          activeTab === "project"
                            ? "text-[#511b10] border-b-2 border-[#511b10]"
                            : "text-gray-400"
                        }
                    `}
        >
          Project Reports
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`
                        text-lg font-semibold pb-2 transition-colors duration-200
                        ${
                          activeTab === "user"
                            ? "text-[#511b10] border-b-2 border-[#511b10]"
                            : "text-gray-400"
                        }
                    `}
        >
          User Account Report
        </button>
      </div>

      {/* Content for Project Reports Tab */}
      {activeTab === "project" && (
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-700 font-bold">Select Year:</span>
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
            <Button variant="outline" onClick={() => fetchReportData()}>
              Apply Filter
            </Button>
          </div>

          {isLoading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reportData ? (
            <div className="grid grid-cols-[max-content_min-content] grid-rows-2 gap-8">
              <div className="p-4 border border-gray-200 bg-white rounded-lg shadow-md row-span-2">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Submission Per Course
                    </h2>
                    <ModifiedPieChart
                      size={400}
                      data={reportData.submissions_per_course}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:pt-12">
                    {legendData.map((item) => (
                      <div
                        key={item.course}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700">{item.course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Card className="w-60 text-center flex flex-col justify-center h-full">
                <CardHeader className="pt-6 pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-700">
                    Total Submission
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-5xl font-bold text-gray-900">
                    {reportData.total_submissions}
                  </p>
                </CardContent>
              </Card>
              <Card className="w-60 text-center flex flex-col justify-center h-full">
                <CardHeader className="pt-6 pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-700">
                    Total Archived
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-5xl font-bold text-gray-900">
                    {reportData.total_archived}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      )}

      {/* Content for User Account Report Tab */}
{activeTab === "user" && (
  <div className="mt-8">
    {isLoading && <p>Loading user data...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {userCountData && (
      <div className="flex flex-col gap-4">

        {/* --- MODIFIED TOP ROW --- */}
        {/* Changed from 2 columns to a 3-column grid on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Viewers chart now spans 2 of the 3 columns */}
          <div className="lg:col-span-2">
            <GuestDistributionChart viewersData={userCountData.viewers} />
          </div>

          {/* Proponents chart takes up the remaining single column */}
          <ProponentDistributionChart
            proponentsData={userCountData.proponents}
          />
        </div>

        {/* Bottom Row (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminDistributionChart adminCount={userCountData.admins} />
          <AdviserDistributionChart
            adviserCount={userCountData.advisers}
          />
        </div>
        
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default SuperAdminReportsPage;
